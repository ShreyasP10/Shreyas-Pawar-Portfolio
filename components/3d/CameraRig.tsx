"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorkspace, type NavTarget } from "./store";

export const POS: Record<NavTarget, [number, number, number]> = {
  door: [3.6, 1.2, 1.6],
  entry: [1.4, 1.0, -1.9],
  wall: [0, 3.15, -5.5],
  overview: [0, 3.0, -3.0],
  laptop: [0, 1.3, -5.75],
  tablet: [0.23, 1.69, -5.85],
  phone: [-0.51, 1.44, -5.81],
  tv: [1.9, 1.9, -4.5],
};

export const LOOK: Record<NavTarget, [number, number, number]> = {
  door: [3.6, 1.5, -0.4],
  entry: [0, 0.95, -6.5],
  wall: [0, 3.1, -8.95],
  overview: [0, 2.3, -7.8],
  laptop: [0, 1.2, -8.09],
  tablet: [1.78, 1.32, -7.36],
  phone: [-1.89, 1.13, -7.16],
  tv: [4.745, 1.9, -4.5],
};

type Waypoint = { pos: THREE.Vector3; look: THREE.Vector3 };

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// Doorway waypoints: the door plane is at z = 0.05, opening between x 3.0 and 4.2.
const WAY_OUT = { pos: v3(3.6, 1.12, 0.55), look: v3(3.6, 1.3, -1.8) };
const WAY_IN = { pos: v3(3.6, 1.08, -0.55), look: v3(2.0, 1.15, -3.2) };
const EXIT_WAY_IN = { pos: v3(3.6, 1.1, -0.5), look: v3(3.6, 1.3, 0.8) };
const EXIT_WAY_OUT = { pos: v3(3.6, 1.12, 0.55), look: v3(3.6, 1.5, -0.4) };

const isOutside = (t: NavTarget) => t === "door";

function finalPos(target: NavTarget, scale: number) {
  const p = POS[target];
  const l = LOOK[target];
  const s = target === "door" || target === "entry" ? 1 : scale;
  return v3(l[0] + (p[0] - l[0]) * s, l[1] + (p[1] - l[1]) * s, l[2] + (p[2] - l[2]) * s);
}

const finalLook = (target: NavTarget) => v3(...LOOK[target]);

export function CameraRig() {
  const target = useWorkspace((s) => s.target);
  const freeCam = useWorkspace((s) => s.freeCam);
  const setFreeCam = useWorkspace((s) => s.setFreeCam);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);
  const doorOpen = useWorkspace((s) => s.doorOpen);
  const openDoor = useWorkspace((s) => s.openDoor);
  const closeDoor = useWorkspace((s) => s.closeDoor);
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
  const route = useRef<Waypoint[] | null>(null);
  const routeIdx = useRef(0);

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

    if (currentKey.current !== target) {
      const prev = currentKey.current;
      currentKey.current = target;
      posRef.current.copy(camera.position);
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      lookRef.current.copy(camera.position).addScaledVector(dir, 10);
      posVel.current.set(0, 0, 0);
      lookVel.current.set(0, 0, 0);

      if (prev !== null && isOutside(prev) !== isOutside(target)) {
        // Crossing the door plane: guide the camera through the open doorway.
        route.current = isOutside(prev) ? [WAY_OUT, WAY_IN] : [EXIT_WAY_IN, EXIT_WAY_OUT];
        routeIdx.current = 0;
        if (!doorOpen) openDoor();
      } else {
        route.current = null;
        routeIdx.current = 0;
        targetPos.current.copy(finalPos(target, scale));
        targetLook.current.copy(finalLook(target));
        if (prev === null) {
          posRef.current.copy(targetPos.current);
          lookRef.current.copy(targetLook.current);
          posVel.current.set(0, 0, 0);
          lookVel.current.set(0, 0, 0);
        }
      }
    }

    const wp = route.current
      ? route.current[Math.min(routeIdx.current, route.current.length - 1)]
      : null;
    const desiredPos = wp ? wp.pos : targetPos.current;
    const desiredLook = wp ? wp.look : targetLook.current;

    if (reducedMotion) {
      const endPos = route.current ? finalPos(target, scale) : desiredPos;
      const endLook = route.current ? finalLook(target) : desiredLook;
      camera.position.copy(endPos);
      camera.lookAt(endLook);
      posRef.current.copy(endPos);
      lookRef.current.copy(endLook);
      posVel.current.set(0, 0, 0);
      lookVel.current.set(0, 0, 0);
      if (route.current) {
        route.current = null;
        routeIdx.current = 0;
        targetPos.current.copy(endPos);
        targetLook.current.copy(endLook);
        if (doorOpen) closeDoor();
      }
      if (
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
    step(posRef.current, posVel.current, desiredPos, 11, 4.4);
    step(lookRef.current, lookVel.current, desiredLook, 14, 4.8);
    camera.position.copy(posRef.current);
    camera.lookAt(lookRef.current);

    if (route.current) {
      if (posRef.current.distanceTo(desiredPos) < 0.07 && lookRef.current.distanceTo(desiredLook) < 0.07) {
        routeIdx.current += 1;
        if (routeIdx.current >= route.current.length) {
          route.current = null;
          routeIdx.current = 0;
          targetPos.current.copy(finalPos(target, scale));
          targetLook.current.copy(finalLook(target));
          if (doorOpen) closeDoor();
        }
      }
    } else if (
      currentKey.current === target &&
      posRef.current.distanceTo(targetPos.current) < 0.03 &&
      lookRef.current.distanceTo(targetLook.current) < 0.03
    ) {
      setFreeCam(true);
    }
  });

  return null;
}
