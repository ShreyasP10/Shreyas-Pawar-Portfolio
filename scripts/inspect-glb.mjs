/**
 * Inspect a glTF binary (.glb) file: decodes POSITION data from the BIN chunk
 * and prints world-space bounds per node (accounting for the node hierarchy),
 * so GLB models can be scaled/floored correctly in the scene.
 *
 * Uses real three.js matrix math (Euler 'XYZ' order, compose = T*R*S) so the
 * reported transforms match the app exactly.
 *
 * Usage:
 *   node scripts/inspect-glb.mjs <file.glb>                     # raw scene bounds
 *   node scripts/inspect-glb.mjs <file.glb> --probe rx ry rz scale [px py pz]
 *                                                                # bounds after transform
 */
import { readFileSync } from "node:fs";
import * as THREE from "three";

const args = process.argv.slice(2);
const file = args[0];
if (!file) {
  console.error("usage: node scripts/inspect-glb.mjs <file.glb> [--probe rx ry rz scale [px py pz]]");
  process.exit(1);
}

const probeMode = args[1] === "--probe";
const RX = probeMode ? parseFloat(args[2]) : 0;
const RY = probeMode ? parseFloat(args[3]) : 0;
const RZ = probeMode ? parseFloat(args[4]) : 0;
const SC = probeMode ? parseFloat(args[5]) : 1;
const PX = probeMode && args[6] !== undefined ? parseFloat(args[6]) : 0;
const PY = probeMode && args[7] !== undefined ? parseFloat(args[7]) : 0;
const PZ = probeMode && args[8] !== undefined ? parseFloat(args[8]) : 0;

const buf = readFileSync(file);
if (buf.readUInt32LE(0) !== 0x46546c67) {
  console.error("not a GLB file");
  process.exit(1);
}

let offset = 12;
let json;
let bin;
while (offset < buf.length) {
  const len = buf.readUInt32LE(offset);
  const type = buf.readUInt32LE(offset + 4);
  const data = buf.subarray(offset + 8, offset + 8 + len);
  if (type === 0x4e4f534a) json = JSON.parse(data.toString("utf8"));
  if (type === 0x004e4942) bin = data;
  offset += 8 + len;
}

function decodePosition(accessorIndex) {
  const acc = json.accessors[accessorIndex];
  const view = json.bufferViews[acc.bufferView];
  const byteOffset = (view.byteOffset ?? 0) + (acc.byteOffset ?? 0);
  const count = acc.count;
  const stride = view.byteStride ?? 12;
  const out = [];
  for (let i = 0; i < count; i++) {
    const o = byteOffset + i * stride;
    out.push([bin.readFloatLE(o), bin.readFloatLE(o + 4), bin.readFloatLE(o + 8)]);
  }
  return out;
}

const V = new THREE.Vector3();

function walk(nodes, index, parent, depth, out) {
  const node = nodes[index];
  const name = node.name ?? `node_${index}`;
  const local = new THREE.Matrix4().compose(
    new THREE.Vector3(...(node.translation ?? [0, 0, 0])),
    new THREE.Quaternion().fromArray(node.rotation ?? [0, 0, 0, 1]),
    new THREE.Vector3(...(node.scale ?? [1, 1, 1]))
  );
  const world = new THREE.Matrix4().multiplyMatrices(parent, local);

  if (node.mesh !== undefined) {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    for (const prim of json.meshes[node.mesh].primitives) {
      for (const p of decodePosition(prim.attributes.POSITION)) {
        V.fromArray(p).applyMatrix4(world);
        for (let k = 0; k < 3; k++) {
          min[k] = Math.min(min[k], V.getComponent(k));
          max[k] = Math.max(max[k], V.getComponent(k));
        }
      }
    }
    out.push({
      name,
      mesh: node.mesh,
      world,
      min: min.map((v) => +v.toFixed(4)),
      max: max.map((v) => +v.toFixed(4)),
      size: max.map((v, k) => +(v - min[k]).toFixed(4)),
    });
  }
  for (const c of node.children ?? []) walk(nodes, c, world, depth + 1, out);
  return out;
}

const APPLY = new THREE.Matrix4();
if (probeMode) {
  APPLY.compose(
    new THREE.Vector3(PX, PY, PZ),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(RX, RY, RZ, "XYZ")),
    new THREE.Vector3(SC, SC, SC)
  );
} else {
  APPLY.identity();
}

const scene = json.scenes[json.scene ?? 0];
const nodes = [];
for (const root of scene.nodes) walk(json.nodes, root, APPLY, 0, nodes);

console.log(`== ${file} ==` + (probeMode ? `  probe rx=${RX} ry=${RY} rz=${RZ} scale=${SC} pos=(${PX},${PY},${PZ})` : ""));
console.log(`nodes=${json.nodes.length} meshes=${json.meshes.length} materials=${json.materials?.length ?? 0}`);
const all = nodes.reduce(
  (a, n) => ({
    min: [0, 1, 2].map((k) => Math.min(a.min[k], n.min[k])),
    max: [0, 1, 2].map((k) => Math.max(a.max[k], n.max[k])),
  }),
  {
    min: [Infinity, Infinity, Infinity],
    max: [-Infinity, -Infinity, -Infinity],
  }
);
console.log(`SCENE bounds min=[${all.min.map((v) => v.toFixed(3)).join(", ")}] max=[${all.max.map((v) => v.toFixed(3)).join(", ")}] size=[${all.max.map((v, k) => +(v - all.min[k]).toFixed(3)).join(", ")}]`);

const tops = nodes
  .filter((n) => n.size[1] > 0.001 && n.max[1] > all.max[1] - 1.5)
  .sort((a, b) => b.max[1] - a.max[1]);
if (tops.length) {
  console.log("TOP parts (max.y near scene max):");
  for (const n of tops.slice(0, 6)) {
    const area = (n.size[0] * n.size[2]).toFixed(3);
    console.log(`  ${n.name}: top y=${n.max[1].toFixed(3)} size=[${n.size.join(", ")}] xyArea=${area}`);
  }
}
for (const n of nodes) {
  console.log(
    `  - ${n.name}  min=[${n.min.join(", ")}] max=[${n.max.join(", ")}] size=[${n.size.join(", ")}]`
  );
}
