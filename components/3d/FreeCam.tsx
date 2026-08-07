"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { TOUCH } from "three";
import { useWorkspace } from "./store";
import { LOOK } from "./CameraRig";

export const freeControlsRef: { current: OrbitControlsImpl | null } = { current: null };

export function FreeCam() {
  const freeCam = useWorkspace((s) => s.freeCam);
  const target = useWorkspace((s) => s.target);
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

  return (
    <OrbitControls
      ref={ref}
      enabled={freeCam}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      touches={{ ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_PAN }}
    />
  );
}
