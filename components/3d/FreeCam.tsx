"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { TOUCH, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useUIStore, LOOK } from "./store";

export const freeControlsRef: { current: OrbitControlsImpl | null } = { current: null };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const offset = new Vector3();

// Room interior: walls at x ±4.95 (5.05±0.1), back wall z -8.95 (-9.05+0.1),
// door plane z 0.05, floor y 0.05 (0.1 thick), ceiling y 6.0 (6.05-0.1).
const CAM_BOUNDS = { minX: -4.85, maxX: 4.85, minY: 0.35, maxY: 5.5, minZ: -8.75, maxZ: 0.05 };
const TARGET_BOUNDS = { minX: -4.8, maxX: 4.8, minY: 0.3, maxY: 5.2, minZ: -8.7, maxZ: 0.0 };

export function FreeCam() {
  const freeCam = useUIStore((s) => s.freeCam);
  const target = useUIStore((s) => s.target);
  const ref = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    freeControlsRef.current = ref.current;
    return () => {
      freeControlsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.target.set(...LOOK[target]);
    if (freeCam) c.update();
  }, [freeCam, target]);

  // Clamp camera + look target inside the room so free look never leaves the walls.
  // The controls' internal orbit state (spherical) is closure-private in this
  // OrbitControls build, so instead of syncing it we preserve the camera-target
  // offset (which mirrors that state exactly) and re-derive the target so that
  // target + offset stays inside the room. The offset never changes, so the next
  // damped update reproduces the same state and never fights the clamp.
  useFrame(() => {
    const c = ref.current;
    if (!c || !freeCam) return;
    const p = c.object.position;

    offset.copy(p).sub(c.target);
    c.target.set(
      clamp(clamp(p.x, CAM_BOUNDS.minX, CAM_BOUNDS.maxX) - offset.x, TARGET_BOUNDS.minX, TARGET_BOUNDS.maxX),
      clamp(clamp(p.y, CAM_BOUNDS.minY, CAM_BOUNDS.maxY) - offset.y, TARGET_BOUNDS.minY, TARGET_BOUNDS.maxY),
      clamp(clamp(p.z, CAM_BOUNDS.minZ, CAM_BOUNDS.maxZ) - offset.z, TARGET_BOUNDS.minZ, TARGET_BOUNDS.maxZ)
    );
    p.set(c.target.x + offset.x, c.target.y + offset.y, c.target.z + offset.z);
  }, -1);

  return (
    <OrbitControls
      ref={ref}
      enabled={freeCam}
      enableZoom
      enablePan={false}
      minDistance={0.6}
      maxDistance={10}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2 - 0.08}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.45}
      zoomSpeed={0.7}
      touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
    />
  );
}
