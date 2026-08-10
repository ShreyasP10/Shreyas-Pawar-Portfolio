import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "public/models/simple_office_table.glb";

const buf = readFileSync(file);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("not a GLB");
let offset = 12, json, bin;
while (offset < buf.length) {
  const len = buf.readUInt32LE(offset);
  const type = buf.readUInt32LE(offset + 4);
  const data = buf.subarray(offset + 8, offset + 8 + len);
  if (type === 0x4e4f534a) json = JSON.parse(data.toString("utf8"));
  if (type === 0x004e4942) bin = data;
  offset += 8 + len;
}

function decode(ai) {
  const acc = json.accessors[ai];
  const view = json.bufferViews[acc.bufferView];
  const o0 = (view.byteOffset ?? 0) + (acc.byteOffset ?? 0);
  const stride = view.byteStride ?? 12;
  const out = [];
  for (let i = 0; i < acc.count; i++) {
    const o = o0 + i * stride;
    out.push([bin.readFloatLE(o), bin.readFloatLE(o + 4), bin.readFloatLE(o + 8)]);
  }
  return out;
}

const ROT_X = (t) => [1,0,0,0, 0,Math.cos(t),-Math.sin(t),0, 0,Math.sin(t),Math.cos(t),0, 0,0,0,1];
const ROT_Y = (t) => [Math.cos(t),0,Math.sin(t),0, 0,1,0,0, -Math.sin(t),0,Math.cos(t),0, 0,0,0,1];
const ROT_Z = (t) => [Math.cos(t),-Math.sin(t),0,0, Math.sin(t),Math.cos(t),0,0, 0,0,1,0, 0,0,0,1];
const SCL = (s) => [s,0,0,0, 0,s,0,0, 0,0,s,0, 0,0,0,1];
const mm = (a, b) => {
  const o = new Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      o[r*4+c] = a[r*4]*b[c] + a[r*4+1]*b[4+c] + a[r*4+2]*b[8+c] + a[r*4+3]*b[12+c];
  return o;
};
const XF = (rx, ry, rz, s) => mm(ROT_X(rx), mm(ROT_Y(ry), mm(ROT_Z(rz), SCL(s))));

function perNodeBounds() {
  const out = [];
  const walk = (ni, parent) => {
    const node = json.nodes[ni];
    const t = node.translation ?? [0,0,0];
    const r = node.rotation ?? [0,0,0,1];
    const s = node.scale ?? [1,1,1];
    const [x,y,z,w] = r;
    const x2=x+x, y2=y+y, z2=z+z, xx=x*x2, xy=x*y2, xz=x*z2, yy=y*y2, yz=y*z2, zz=z*z2, wx=w*x2, wy=w*y2, wz=w*z2;
    const local = [
      (1-(yy+zz))*s[0], (xy+wz)*s[0], (xz-wy)*s[0], 0,
      (xy-wz)*s[1], (1-(xx+zz))*s[1], (yz+wx)*s[1], 0,
      (xz+wy)*s[2], (yz-wx)*s[2], (1-(xx+yy))*s[2], 0,
      t[0], t[1], t[2], 1,
    ];
    const world = mm(parent, local);
    if (node.mesh !== undefined) {
      let min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
      for (const prim of json.meshes[node.mesh].primitives) {
        for (const p of decode(prim.attributes.POSITION)) {
          const V = [
            world[0]*p[0]+world[4]*p[1]+world[8]*p[2]+world[12],
            world[1]*p[0]+world[5]*p[1]+world[9]*p[2]+world[13],
            world[2]*p[0]+world[6]*p[1]+world[10]*p[2]+world[14],
          ];
          for (let k=0;k<3;k++){ min[k]=Math.min(min[k],V[k]); max[k]=Math.max(max[k],V[k]); }
        }
      }
      out.push({ min, max });
    }
    for (const c of node.children ?? []) walk(c, world);
  };
  for (const root of json.scenes[json.scene ?? 0].nodes) walk(root, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  return out;
}

const parts = perNodeBounds();
const ID = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
const angles = [0, Math.PI/2, -Math.PI/2, Math.PI];
const results = [];
for (const rx of angles) for (const ry of angles) for (const rz of angles) {
  if (rx === 0 && ry === 0 && rz === 0) continue;
  const xf = XF(rx, ry, rz, 1);
  let min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
  let topSlab = null;
  for (const p of parts) {
    const m = mm(xf, ID);
    const tmin = [0,1,2].map((k) => m[k]*p.min[0] + m[4+k]*p.min[1] + m[8+k]*p.min[2] + m[12+k]);
    const tmax = [0,1,2].map((k) => m[k]*p.max[0] + m[4+k]*p.max[1] + m[8+k]*p.max[2] + m[12+k]);
    const lo = [0,1,2].map((k) => Math.min(tmin[k], tmax[k]));
    const hi = [0,1,2].map((k) => Math.max(tmin[k], tmax[k]));
    for (let k=0;k<3;k++){ min[k]=Math.min(min[k],lo[k]); max[k]=Math.max(max[k],hi[k]); }
    const area = (hi[0]-lo[0])*(hi[2]-lo[2]);
    if (area > 0.3 && !topSlab) topSlab = { lo, hi, area };
  }
  const size = max.map((v,k) => v-min[k]);
  const spikes = Math.max(...size) > 8;
  const heightOK = size[1] > 0.4 && size[1] < 2;
  const footOK = size[0] > 0.4 && size[2] > 0.4 && size[0] < 6 && size[2] < 6;
  results.push({
    key: `rx=${(rx*180/Math.PI).toFixed(0)} ry=${(ry*180/Math.PI).toFixed(0)} rz=${(rz*180/Math.PI).toFixed(0)}`,
    size: size.map(v=>+v.toFixed(2)), min: min.map(v=>+v.toFixed(2)), topSlab,
    ok: !spikes && heightOK && footOK,
  });
}
results.sort((a,b) => (b.ok?1:0)-(a.ok?1:0));
for (const r of results) {
  const ts = r.topSlab ? ` topSlab area=${r.topSlab.area.toFixed(2)} y=${r.topSlab.hi[1].toFixed(2)}..${r.topSlab.lo[1].toFixed(2)}` : " noTopSlab";
  console.log(`${r.ok ? "✓" : " "} ${r.key} size=[${r.size}] min=[${r.min}]${ts}`);
}
