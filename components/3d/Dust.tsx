"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorkspace } from "./store";

const COUNT = 70;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function Dust() {
  const particlesOn = useWorkspace((s) => s.particlesOn);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const rand = seededRandom(20260805);
    return Array.from({ length: COUNT }, (_, i) => {
      const x = -6.5 + rand() * 13;
      const y = 0.4 + rand() * 5;
      const z = -11.2 + rand() * 8.2;
      const size = 0.008 + rand() * 0.02;
      const speed = 0.12 + rand() * 0.25;
      const phase = rand() * Math.PI * 2;
      const sway = 0.2 + rand() * 0.6;
      return { position: [x, y, z] as const, size, speed, phase, sway, seed: i };
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !particlesOn || reducedMotion) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      if (!p) continue;
      const bob = Math.sin(t * p.speed + p.phase) * p.sway * 0.02;
      const py = p.position[1] + Math.sin(t * p.speed * 0.6 + p.phase) * 0.14;
      const px = p.position[0] + Math.sin(t * p.speed + p.phase * 2) * 0.22 + bob;
      const pz = p.position[2] + Math.cos(t * p.speed * 0.8 + p.phase) * 0.18;
      const twinkle = 0.4 + (Math.sin(t * p.speed * 2 + p.seed * 1.7) * 0.5 + 0.5) * 0.6;

      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(p.size * twinkle);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!particlesOn || reducedMotion) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#ffd700"
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
