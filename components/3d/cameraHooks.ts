"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { animate, createTimeline } from "animejs";
import { useUIStore } from "./store";

const WAY_OUT = new THREE.Vector3(3.6, 1.12, 0.55);
const LOOK_OUT = new THREE.Vector3(3.6, 1.3, -1.8);
const WAY_IN = new THREE.Vector3(3.6, 1.08, -0.55);
const LOOK_IN = new THREE.Vector3(2.0, 1.15, -3.2);
const EXIT_WAY_IN = new THREE.Vector3(3.6, 1.1, -0.5);
const EXIT_LOOK_IN = new THREE.Vector3(3.6, 1.3, 0.8);
const EXIT_WAY_OUT = new THREE.Vector3(3.6, 1.12, 0.55);
const EXIT_LOOK_OUT = new THREE.Vector3(3.6, 1.5, 1.8);

export function useCameraDamping() {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const target = useUIStore((s) => s.target);
  const freeCam = useUIStore((s) => s.freeCam);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const doorOpen = useUIStore((s) => s.doorOpen);
  const openDoor = useUIStore((s) => s.openDoor);
  const closeDoor = useUIStore((s) => s.closeDoor);
  const setIsMoving = useUIStore((s) => s.setIsMoving);
  const targetPos = useUIStore((s) => s.targetCameraPosition);
  const targetLook = useUIStore((s) => s.targetLookAt);

  const prevTarget = useRef(target);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const lookProxy = useRef({ x: targetLook[0], y: targetLook[1], z: targetLook[2] });
  const posProxy = useRef({ x: camera.position.x, y: camera.position.y, z: camera.position.z });
  const fovProxy = useRef({ v: camera.fov });

  const aspect = size.width / Math.max(1, size.height);
  const isMobile = size.width < 768 || aspect < 1.1;

  const targetFov =
    target === "laptop" || target === "tablet" || target === "phone"
      ? (isMobile ? 44 : 38)
      : target === "tv"
        ? (isMobile ? 46 : 42)
        : 48;

  // Keep proxies in sync when not animating
  useEffect(() => {
    if (!animRef.current) {
      posProxy.current.x = camera.position.x;
      posProxy.current.y = camera.position.y;
      posProxy.current.z = camera.position.z;
      lookProxy.current.x = targetLook[0];
      lookProxy.current.y = targetLook[1];
      lookProxy.current.z = targetLook[2];
      fovProxy.current.v = camera.fov;
    }
  });

  useEffect(() => {
    if (prevTarget.current === target) return;
    const isOutsidePrev = prevTarget.current === "door" || prevTarget.current === null;
    const isOutsideNext = target === "door";

    // Cancel any ongoing animation
    if (animRef.current) {
      try {
        (animRef.current as unknown as { pause?: () => void }).pause?.();
      } catch {}
      animRef.current = null;
    }

    if (reducedMotion) {
      camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
      camera.lookAt(targetLook[0], targetLook[1], targetLook[2]);
      if (doorOpen) closeDoor();
      setIsMoving(false);
      prevTarget.current = target;
      return;
    }

    setIsMoving(true);

    // Handle door waypoints with a timeline for smooth cornering
    const needsDoorRoute = isOutsidePrev !== isOutsideNext;
    if (needsDoorRoute && !doorOpen) openDoor();

    const finalPos: [number, number, number] = [...targetPos] as [number, number, number];
    const finalLook: [number, number, number] = [...targetLook] as [number, number, number];

    // Apply mobile offset to final pos (pulled back)
    if (target === "laptop" || target === "tablet" || target === "phone" || target === "tv") {
      const dir = new THREE.Vector3(finalPos[0] - finalLook[0], finalPos[1] - finalLook[1], finalPos[2] - finalLook[2]).normalize();
      const offset = isMobile ? 0.45 : 0;
      finalPos[0] += dir.x * offset;
      finalPos[1] += dir.y * offset;
      finalPos[2] += dir.z * offset;
      if (isMobile && target !== "tv") finalPos[1] += 0.06;
    }

    // Build animation
    const doFinal = () => {
      const p = posProxy.current;
      const l = lookProxy.current;
      const f = fovProxy.current;

      // Sync start values to current camera
      p.x = camera.position.x;
      p.y = camera.position.y;
      p.z = camera.position.z;
      l.x = camera.position.x; // placeholder, will be overwritten by look
      // Actually look target is not camera, we use separate look proxy
      // Get current look by projecting
      const lookDir = new THREE.Vector3();
      camera.getWorldDirection(lookDir);
      const curLook = camera.position.clone().add(lookDir);
      l.x = curLook.x;
      l.y = curLook.y;
      l.z = curLook.z;
      f.v = camera.fov;

      const tl = createTimeline({
        defaults: { ease: "inOutCubic" as const, duration: 900 },
        onComplete: () => {
          setIsMoving(false);
          if (!isOutsideNext && doorOpen) {
            // close door after entering
            setTimeout(() => closeDoor(), 400);
          }
          if (isOutsideNext && !isOutsidePrev) {
            // after exiting, keep door open briefly
            setTimeout(() => closeDoor(), 800);
          }
          prevTarget.current = target;
          animRef.current = null;
        },
      });

      // Animate position + look + fov together
      tl.add(p, {
        x: finalPos[0],
        y: finalPos[1],
        z: finalPos[2],
        duration: target === "door" || target === "entry" ? 1100 : 1200,
        ease: "inOutCubic",
        onUpdate: () => {
          camera.position.set(p.x, p.y, p.z);
        },
      });

      tl.add(
        l,
        {
          x: finalLook[0],
          y: finalLook[1],
          z: finalLook[2],
          duration: 1100,
          ease: "inOutCubic",
          onUpdate: () => {
            camera.lookAt(l.x, l.y, l.z);
          },
        },
        0
      );

      tl.add(
        f,
        {
          v: targetFov,
          duration: 800,
          ease: "inOutQuad",
          onUpdate: () => {
            if (Math.abs(camera.fov - f.v) > 0.01) {
              camera.fov = f.v;
              camera.updateProjectionMatrix();
            }
          },
        },
        0
      );

      animRef.current = tl as unknown as ReturnType<typeof animate>;
    };

    if (needsDoorRoute) {
      // Two-step door route: animate via waypoints first
      const waypoints = isOutsidePrev
        ? [
            { pos: WAY_OUT, look: LOOK_OUT, dur: 700 },
            { pos: WAY_IN, look: LOOK_IN, dur: 700 },
          ]
        : [
            { pos: EXIT_WAY_IN, look: EXIT_LOOK_IN, dur: 600 },
            { pos: EXIT_WAY_OUT, look: EXIT_LOOK_OUT, dur: 700 },
          ];

      const p = posProxy.current;
      const l = lookProxy.current;
      p.x = camera.position.x;
      p.y = camera.position.y;
      p.z = camera.position.z;
      const curLook = new THREE.Vector3();
      camera.getWorldDirection(curLook);
      const curLookPos = camera.position.clone().add(curLook);
      l.x = curLookPos.x;
      l.y = curLookPos.y;
      l.z = curLookPos.z;

      const tl = createTimeline({
        defaults: { ease: "inOutCubic" as const },
        onComplete: () => {
          // After waypoints, animate to final
          doFinal();
        },
      });

      waypoints.forEach((wp) => {
        tl.add(
          p,
          {
            x: wp.pos.x,
            y: wp.pos.y,
            z: wp.pos.z,
            duration: wp.dur,
            ease: "inOutCubic",
            onUpdate: () => camera.position.set(p.x, p.y, p.z),
          },
          "+=0"
        );
        tl.add(
          l,
          {
            x: wp.look.x,
            y: wp.look.y,
            z: wp.look.z,
            duration: wp.dur,
            ease: "inOutCubic",
            onUpdate: () => camera.lookAt(l.x, l.y, l.z),
          },
          "<"
        );
      });

      animRef.current = tl as unknown as ReturnType<typeof animate>;
    } else {
      doFinal();
    }

    prevTarget.current = target;
    return () => {
      // cleanup handled by next effect
    };
  }, [target, doorOpen, openDoor, closeDoor, setIsMoving, targetPos, targetLook, targetFov, camera, reducedMotion, isMobile]);

  // Subtle parallax when idle - keep light maath-style for idle sway
  const idleOffset = useRef(new THREE.Vector3());
  useFrame((state) => {
    if (freeCam || reducedMotion) return;
    const isMoving = useUIStore.getState().isMoving;
    if (isMoving) return;
    const isDevice = target === "laptop" || target === "tablet" || target === "phone";
    const fx = isDevice ? 0.02 : 0.08;
    const fy = isDevice ? 0.012 : 0.06;
    idleOffset.current.set(state.pointer.x * fx, state.pointer.y * fy, 0);
    // Apply tiny offset to camera without breaking anime
    // Do not override anime - just nudge
    camera.position.add(idleOffset.current.clone().multiplyScalar(0.0005));
  });
}
