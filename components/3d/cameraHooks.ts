"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { useUIStore } from "./store";

const v3 = new THREE.Vector3();
const l3 = new THREE.Vector3();
const _scratchDirection = new THREE.Vector3();

const WAY_OUT = new THREE.Vector3(3.6, 1.12, 0.55);
const LOOK_OUT = new THREE.Vector3(3.6, 1.3, -1.8);
const WAY_IN = new THREE.Vector3(3.6, 1.08, -0.55);
const LOOK_IN = new THREE.Vector3(2.0, 1.15, -3.2);
const EXIT_WAY_IN = new THREE.Vector3(3.6, 1.1, -0.5);
const EXIT_LOOK_IN = new THREE.Vector3(3.6, 1.3, 0.8);
const EXIT_WAY_OUT = new THREE.Vector3(3.6, 1.12, 0.55);
const EXIT_LOOK_OUT = new THREE.Vector3(3.6, 1.5, 1.8);

const parallaxOffset = new THREE.Vector3();
const combinedTargetPos = new THREE.Vector3();
const combinedTargetLook = new THREE.Vector3();

export function useCameraDamping() {
  const size = useThree((s) => s.size);
  const target = useUIStore((s) => s.target);
  const freeCam = useUIStore((s) => s.freeCam);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const doorOpen = useUIStore((s) => s.doorOpen);
  const openDoor = useUIStore((s) => s.openDoor);
  const closeDoor = useUIStore((s) => s.closeDoor);
  const setIsMoving = useUIStore((s) => s.setIsMoving);
  const targetPos = useUIStore((s) => s.targetCameraPosition);
  const targetLook = useUIStore((s) => s.targetLookAt);

  const [route, setRoute] = useState<{ pos: THREE.Vector3; look: THREE.Vector3 }[] | null>(null);
  const [routeIdx, setRouteIdx] = useState(0);
  const prevTarget = useRef(target);
  const prevPosRef = useRef(new THREE.Vector3());
  const velocityRef = useRef(0);

  const aspect = size.width / Math.max(1, size.height);
  const isMobile = size.width < 768 || aspect < 1.1;
  const dynamicOffset = isMobile ? 1.45 : 1.0;

  const targetFov =
    target === "laptop" || target === "tablet" || target === "phone"
      ? (isMobile ? 44 : 38)
      : target === "tv"
      ? (isMobile ? 46 : 42)
      : 48;

  useEffect(() => {
    if (prevTarget.current !== target) {
      const isOutsidePrev = prevTarget.current === "door" || prevTarget.current === null;
      const isOutsideNext = target === "door";

      if (isOutsidePrev !== isOutsideNext) {
        setIsMoving(true);
        if (!doorOpen) openDoor();

        if (isOutsidePrev) {
          setRoute([{ pos: WAY_OUT, look: LOOK_OUT }, { pos: WAY_IN, look: LOOK_IN }]);
        } else {
          setRoute([{ pos: EXIT_WAY_IN, look: EXIT_LOOK_IN }, { pos: EXIT_WAY_OUT, look: EXIT_LOOK_OUT }]);
        }
        setRouteIdx(0);
      } else {
        setRoute(null);
        setIsMoving(true);
      }
      prevTarget.current = target;
    }
  }, [target, doorOpen, openDoor, setIsMoving]);

  useFrame((state, delta) => {
    if (freeCam) return;
    const cam = state.camera as THREE.PerspectiveCamera;

    if (reducedMotion) {
      cam.position.set(targetPos[0], targetPos[1], targetPos[2]);
      cam.lookAt(targetLook[0], targetLook[1], targetLook[2]);
      if (cam.fov !== targetFov) {
        cam.fov = targetFov;
        cam.updateProjectionMatrix();
      }
      setIsMoving(false);
      setRoute(null);
      if (doorOpen) closeDoor();
      return;
    }

    if (cam.fov && Math.abs(cam.fov - targetFov) > 0.1) {
      easing.damp(cam, "fov", targetFov, 0.45, delta);
      cam.updateProjectionMatrix();
    }

    const currentTargetPos = v3.set(targetPos[0], targetPos[1], targetPos[2]);
    const currentTargetLook = l3.set(targetLook[0], targetLook[1], targetLook[2]);

    if (target === "laptop" || target === "tablet" || target === "phone" || target === "tv") {
      const direction = _scratchDirection.subVectors(currentTargetPos, currentTargetLook).normalize();
      currentTargetPos.addScaledVector(direction, dynamicOffset - 1);
      if (isMobile && target !== "tv") {
        currentTargetPos.y += 0.06;
      }
    }

    let activeTargetPos = currentTargetPos;
    let activeTargetLook = currentTargetLook;

    if (route && route[routeIdx]) {
      activeTargetPos = route[routeIdx].pos;
      activeTargetLook = route[routeIdx].look;

      if (cam.position.distanceTo(activeTargetPos) < 0.12) {
        if (routeIdx < (route.length ?? 1) - 1) {
          setRouteIdx(routeIdx + 1);
        } else {
          setRoute(null);
          if (doorOpen) closeDoor();
        }
      }
    } else {
      const isDevice = target === "laptop" || target === "tablet" || target === "phone";
      const parallaxFactorX = isDevice ? 0.025 : 0.15;
      const parallaxFactorY = isDevice ? 0.015 : 0.08;

      parallaxOffset.set(
        state.pointer.x * parallaxFactorX,
        state.pointer.y * parallaxFactorY,
        0
      );

      combinedTargetPos.copy(activeTargetPos).add(parallaxOffset);
      combinedTargetLook.copy(activeTargetLook).add(parallaxOffset.clone().multiplyScalar(0.4));

      activeTargetPos = combinedTargetPos;
      activeTargetLook = combinedTargetLook;
    }

    easing.damp3(cam.position, activeTargetPos, 0.38, delta);
    easing.dampLookAt(cam, activeTargetLook, 0.38, delta);

    const currentPos = cam.position.clone();
    const distance = currentPos.distanceTo(currentTargetPos);
    velocityRef.current = currentPos.distanceTo(prevPosRef.current) / Math.max(delta, 0.001);
    prevPosRef.current.copy(currentPos);

    if (!route && distance < 0.08 && velocityRef.current < 0.5) {
      setIsMoving(false);
    }
  });
}