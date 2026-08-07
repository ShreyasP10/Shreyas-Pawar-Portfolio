"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorkspace, type NavTarget } from "./store";

export const POS: Record<NavTarget, [number, number, number]> = {
  door: [-6.9, 1.15, -3.6],
  entry: [-1.2, 0.95, -3.2],
  wall: [0, 3.2, -5.9],
  overview: [0, 3.0, -3.0],
  laptop: [0, 1.38, -6.51],
  tablet: [1.258, 1.277, -6.593],
  phone: [-1.448, 1.115, -6.685],
  tv: [0, 1.9, -2.6],
};

export const LOOK: Record<NavTarget, [number, number, number]> = {
  door: [-5.1, 1.6, -3.6],
  entry: [0, 0.9, -6.5],
  wall: [0, 3.1, -8.95],
  overview: [0, 2.3, -7.8],
  laptop: [0, 1.38, -8.11],
  tablet: [1.817, 1.32, -7.362],
  phone: [-1.89, 1.13, -7.162],
  tv: [0, 1.9, -0.53],
};

export function CameraRig() {
  const target = useWorkspace((s) => s.target);
  const freeCam = useWorkspace((s) => s.freeCam);
  const setFreeCam = useWorkspace((s) => s.setFreeCam);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);
  const camera = useThree((s) => s.camera);

  const scale = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.max(0.55, Math.min(1, Math.min(window.innerWidth / 1400, window.innerHeight / 900)));
  }, []);

  const posRef = useRef(new THREE.Vector3());
  const lookRef = useRef(new THREE.Vector3());
  const posVel = useRef(new THREE.Vector3());
  const lookVel = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentKey = useRef<NavTarget | null>(null);
  const wasFree = useRef(false);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);

    if (freeCam) {
      wasFree.current = true;
      return;
    }

    if (wasFree.current) {
      wasFree.current = false;
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      posRef.current.copy(camera.position);
      lookRef.current.copy(camera.position).addScaledVector(dir, 10);
      posVel.current.set(0, 0, 0);
      lookVel.current.set(0, 0, 0);
    }

    if (currentKey.current !== target || currentKey.current === null) {
      const p = POS[target];
      const l = LOOK[target];
      const s = target === "door" || target === "entry" ? 1 : scale;
      targetPos.current.set(
        l[0] + (p[0] - l[0]) * s,
        l[1] + (p[1] - l[1]) * s,
        l[2] + (p[2] - l[2]) * s
      );
      targetLook.current.set(l[0], l[1], l[2]);
      if (currentKey.current === null) {
        posRef.current.copy(targetPos.current);
        lookRef.current.copy(targetLook.current);
        posVel.current.set(0, 0, 0);
        lookVel.current.set(0, 0, 0);
      }
      currentKey.current = target;
    }

    if (reducedMotion) {
      camera.position.copy(targetPos.current);
      camera.lookAt(targetLook.current);
      if (
        currentKey.current === target &&
        posRef.current.distanceTo(targetPos.current) < 0.03 &&
        lookRef.current.distanceTo(targetLook.current) < 0.03
      ) {
        setFreeCam(true);
      }
      return;
    }

    const step = (vec: THREE.Vector3, vel: THREE.Vector3, tgt: THREE.Vector3, k: number, c: number) => {
      vel.addScaledVector(tgt.clone().sub(vec), k * delta);
      vel.multiplyScalar(Math.exp(-c * delta));
      vec.addScaledVector(vel, delta);
    };
    step(posRef.current, posVel.current, targetPos.current, 11, 4.4);
    step(lookRef.current, lookVel.current, targetLook.current, 14, 4.8);
    camera.position.copy(posRef.current);
    camera.lookAt(lookRef.current);

    if (
      currentKey.current === target &&
      posRef.current.distanceTo(targetPos.current) < 0.03 &&
      lookRef.current.distanceTo(targetLook.current) < 0.03
    ) {
      setFreeCam(true);
    }
  });

  return null;
}
