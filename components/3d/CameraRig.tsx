"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { useWorkspace, type NavTarget } from "./store";

const v3 = new THREE.Vector3();
const l3 = new THREE.Vector3();
const _scratchDirection = new THREE.Vector3();

// Doorway waypoints: the door plane is at z = 0.05, opening between x 3.0 and 4.2.
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

export function CameraRig() {
  const size = useThree((s) => s.size);
  const target = useWorkspace((s) => s.target);
  const targetPos = useWorkspace((s) => s.targetCameraPosition);
  const targetLook = useWorkspace((s) => s.targetLookAt);
  const freeCam = useWorkspace((s) => s.freeCam);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);
  const doorOpen = useWorkspace((s) => s.doorOpen);
  const openDoor = useWorkspace((s) => s.openDoor);
  const closeDoor = useWorkspace((s) => s.closeDoor);
  const setIsMoving = useWorkspace((s) => s.setIsMoving);

  const [route, setRoute] = useState<{ pos: THREE.Vector3; look: THREE.Vector3 }[] | null>(null);
  const [routeIdx, setRouteIdx] = useState(0);
  const prevTarget = useRef<NavTarget | null>(null);

  // Responsive device offset calculation
  const aspect = size.width / Math.max(1, size.height);
  const isMobile = size.width < 768 || aspect < 1.1;
  const dynamicOffset = isMobile ? 1.45 : 1.0;

  // Target FOV per view target
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

    // Dynamic FOV easing
    if (cam.fov && Math.abs(cam.fov - targetFov) > 0.1) {
      easing.damp(cam, "fov", targetFov, 0.45, delta);
      cam.updateProjectionMatrix();
    }

    const currentTargetPos = v3.set(targetPos[0], targetPos[1], targetPos[2]);
    const currentTargetLook = l3.set(targetLook[0], targetLook[1], targetLook[2]);

    // Apply dynamic distance offset for devices on smaller / portrait screens
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
        if (routeIdx < route.length - 1) {
          setRouteIdx(routeIdx + 1);
        } else {
          setRoute(null);
          if (doorOpen) closeDoor();
        }
      }
    } else {
      // Apply subtle mouse pointer parallax sway when sitting at a waypoint
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

    // Smooth cinematic camera position and rotation damping
    easing.damp3(cam.position, activeTargetPos, 0.38, delta);
    easing.dampLookAt(cam, activeTargetLook, 0.38, delta);

    // Check if we arrived
    if (!route && cam.position.distanceTo(currentTargetPos) < 0.06) {
      setIsMoving(false);
    }
  });

  return null;
}
