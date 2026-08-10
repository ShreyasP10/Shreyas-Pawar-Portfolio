"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export interface GlbTuning {
  url: string;
  scale: number;
  position?: [number, number, number];
  /** Local-space rotation applied first (e.g. stand the model upright). */
  tilt?: [number, number, number];
  /** World-space Y spin applied after the tilt (faces the model correctly). */
  spinY?: number;
}

export const GLB: Record<string, GlbTuning> = {
  chair: {
    url: "/models/office_chair.glb",
    scale: 1,
    // Raw model lies along Z (wheels at z 0, backrest top at z 1.211). The tilt
    // stands it upright; the spinY faces the backrest away from the desk.
    // NOTE: a single Euler rotation with a Y component would invert the model
    // (Euler XYZ applies the Y term in local space) — hence the two nested groups.
    tilt: [-Math.PI / 2, 0, 0],
    spinY: Math.PI,
  },
};

interface GlbModelProps {
  tuning: GlbTuning;
}

export function GlbModel({ tuning }: GlbModelProps) {
  const gltf = useGLTF(tuning.url);

  const model = useMemo(() => {
    const m = gltf.scene.clone(true);
    m.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    return m;
  }, [gltf.scene]);

  return (
    <group position={tuning.position} scale={tuning.scale}>
      <group rotation={[0, tuning.spinY ?? 0, 0]}>
        <group rotation={tuning.tilt}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}
