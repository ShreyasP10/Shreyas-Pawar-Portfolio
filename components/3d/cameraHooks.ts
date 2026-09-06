"use client";
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createTimeline } from "animejs";
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

  const prevTarget = useRef<string | null>(null);
  const animRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const isFirstMount = useRef(true);

  const aspect = size.width / Math.max(1, size.height);
  const isMobile = size.width < 768 || aspect < 1.1;

  const targetFov =
    target === "laptop" || target === "tablet" || target === "phone"
      ? (isMobile ? 44 : 38)
      : target === "tv"
        ? (isMobile ? 46 : 42)
        : 48;

  // Initial mount - place camera correctly
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevTarget.current = target;
      camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
      camera.lookAt(targetLook[0], targetLook[1], targetLook[2]);
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, target, targetPos, targetLook, targetFov]);

  useEffect(() => {
    if (isFirstMount.current) return;
    if (prevTarget.current === target) return;

    const isOutsidePrev = prevTarget.current === "door";
    const isOutsideNext = target === "door";

    // Cancel ongoing
    if (animRef.current) {
      try {
        (animRef.current as unknown as { pause: () => void }).pause();
      } catch {}
      animRef.current = null;
    }

    if (reducedMotion) {
      camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
      camera.lookAt(targetLook[0], targetLook[1], targetLook[2]);
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
      if (doorOpen && isOutsideNext === false) closeDoor();
      setIsMoving(false);
      prevTarget.current = target;
      return;
    }

    setIsMoving(true);
    const needsDoorRoute = isOutsidePrev !== isOutsideNext;
    if (needsDoorRoute && !doorOpen) openDoor();

    const finalPos: [number, number, number] = [...targetPos] as [number, number, number];
    const finalLook: [number, number, number] = [...targetLook] as [number, number, number];

    if (target === "laptop" || target === "tablet" || target === "phone" || target === "tv") {
      const dir = new THREE.Vector3(finalPos[0] - finalLook[0], finalPos[1] - finalLook[1], finalPos[2] - finalLook[2]).normalize();
      const offset = isMobile ? 0.45 : 0;
      finalPos[0] += dir.x * offset;
      finalPos[1] += dir.y * offset;
      finalPos[2] += dir.z * offset;
      if (isMobile && target !== "tv") finalPos[1] += 0.06;
    }

    const posProxy = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const curLook = new THREE.Vector3();
    camera.getWorldDirection(curLook);
    const curLookPos = camera.position.clone().add(curLook);
    const lookProxy = { x: curLookPos.x, y: curLookPos.y, z: curLookPos.z };
    const fovProxy = { v: camera.fov };

    const onComplete = () => {
      setIsMoving(false);
      prevTarget.current = target;
      animRef.current = null;
      if (!isOutsideNext && doorOpen) setTimeout(() => closeDoor(), 500);
      if (isOutsideNext) setTimeout(() => closeDoor(), 800);
    };

    const animateToFinal = () => {
      const tl = createTimeline({
        defaults: { ease: "inOutCubic" },
        onComplete,
      });
      tl.add(posProxy, {
        x: finalPos[0],
        y: finalPos[1],
        z: finalPos[2],
        duration: target === "door" || target === "entry" ? 1000 : 1100,
        ease: "inOutCubic",
        onUpdate: () => camera.position.set(posProxy.x, posProxy.y, posProxy.z),
      });
      tl.add(
        lookProxy,
        {
          x: finalLook[0],
          y: finalLook[1],
          z: finalLook[2],
          duration: 1000,
          ease: "inOutCubic",
          onUpdate: () => camera.lookAt(lookProxy.x, lookProxy.y, lookProxy.z),
        },
        0
      );
      tl.add(
        fovProxy,
        {
          v: targetFov,
          duration: 700,
          ease: "inOutQuad",
          onUpdate: () => {
            if (Math.abs(camera.fov - fovProxy.v) > 0.01) {
              camera.fov = fovProxy.v;
              camera.updateProjectionMatrix();
            }
          },
        },
        0
      );
      animRef.current = tl;
    };

    if (needsDoorRoute) {
      const waypoints = isOutsidePrev
        ? [
            { pos: WAY_OUT, look: LOOK_OUT, dur: 650 },
            { pos: WAY_IN, look: LOOK_IN, dur: 650 },
          ]
        : [
            { pos: EXIT_WAY_IN, look: EXIT_LOOK_IN, dur: 550 },
            { pos: EXIT_WAY_OUT, look: EXIT_LOOK_OUT, dur: 650 },
          ];

      const tl = createTimeline({
        defaults: { ease: "inOutCubic" },
        onComplete: animateToFinal,
      });

      waypoints.forEach((wp) => {
        tl.add(
          posProxy,
          {
            x: wp.pos.x,
            y: wp.pos.y,
            z: wp.pos.z,
            duration: wp.dur,
            ease: "inOutCubic",
            onUpdate: () => camera.position.set(posProxy.x, posProxy.y, posProxy.z),
          },
          "+=0"
        );
        tl.add(
          lookProxy,
          {
            x: wp.look.x,
            y: wp.look.y,
            z: wp.look.z,
            duration: wp.dur,
            ease: "inOutCubic",
            onUpdate: () => camera.lookAt(lookProxy.x, lookProxy.y, lookProxy.z),
          },
          "<"
        );
      });
      animRef.current = tl;
    } else {
      animateToFinal();
    }
  }, [target, doorOpen, openDoor, closeDoor, setIsMoving, targetPos, targetLook, targetFov, camera, reducedMotion, isMobile]);

  // Idle parallax
  const idleOffset = useRef(new THREE.Vector3());
  useFrame((state) => {
    if (freeCam || reducedMotion) return;
    if (useUIStore.getState().isMoving) return;
    const isDevice = target === "laptop" || target === "tablet" || target === "phone";
    const fx = isDevice ? 0.015 : 0.06;
    const fy = isDevice ? 0.01 : 0.04;
    idleOffset.current.set(state.pointer.x * fx, state.pointer.y * fy, 0);
    camera.position.add(idleOffset.current.clone().multiplyScalar(0.0004));
  });
}
