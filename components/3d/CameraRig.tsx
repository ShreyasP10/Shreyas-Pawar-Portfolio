"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { useWorkspace, type NavTarget } from "./store";

const v3 = new THREE.Vector3();
const l3 = new THREE.Vector3();

// Doorway waypoints: the door plane is at z = 0.05, opening between x 3.0 and 4.2.
const WAY_OUT = new THREE.Vector3(3.6, 1.12, 0.55);
const LOOK_OUT = new THREE.Vector3(3.6, 1.3, -1.8);

const WAY_IN = new THREE.Vector3(3.6, 1.08, -0.55);
const LOOK_IN = new THREE.Vector3(2.0, 1.15, -3.2);

const EXIT_WAY_IN = new THREE.Vector3(3.6, 1.1, -0.5);
const EXIT_LOOK_IN = new THREE.Vector3(3.6, 1.3, 0.8);

const EXIT_WAY_OUT = new THREE.Vector3(3.6, 1.12, 0.55);
const EXIT_LOOK_OUT = new THREE.Vector3(3.6, 1.5, -0.4);

export function CameraRig() {
  const { camera, size } = useThree();
  const target = useWorkspace((s) => s.target);
  const targetPos = useWorkspace((s) => s.targetCameraPosition);
  const targetLook = useWorkspace((s) => s.targetLookAt);
  const freeCam = useWorkspace((s) => s.freeCam);
  const setFreeCam = useWorkspace((s) => s.setFreeCam);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);
  const doorOpen = useWorkspace((s) => s.doorOpen);
  const openDoor = useWorkspace((s) => s.openDoor);
  const closeDoor = useWorkspace((s) => s.closeDoor);
  const setIsMoving = useWorkspace((s) => s.setIsMoving);

  const [route, setRoute] = useState<{ pos: THREE.Vector3; look: THREE.Vector3 }[] | null>(null);
  const [routeIdx, setRouteIdx] = useState(0);
  const prevTarget = useRef<NavTarget | null>(null);

  // Dynamic Offset logic for "30% room visibility" rule
  const dynamicOffset = (size.width < 768) ? 1.4 : 1.0;

  useEffect(() => {
    if (prevTarget.current !== target) {
      const isOutsidePrev = prevTarget.current === "door" || prevTarget.current === null;
      const isOutsideNext = target === "door";

      if (isOutsidePrev !== isOutsideNext) {
        // We are crossing the threshold
        setIsMoving(true);
        if (!doorOpen) openDoor();

        if (isOutsidePrev) {
          // Entering
          setRoute([{ pos: WAY_OUT, look: LOOK_OUT }, { pos: WAY_IN, look: LOOK_IN }]);
        } else {
          // Exiting
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

    if (reducedMotion) {
      camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
      camera.lookAt(targetLook[0], targetLook[1], targetLook[2]);
      setIsMoving(false);
      setRoute(null);
      if (doorOpen) closeDoor();
      return;
    }

    const currentTargetPos = v3.set(targetPos[0], targetPos[1], targetPos[2]);
    const currentTargetLook = l3.set(targetLook[0], targetLook[1], targetLook[2]);

    // Apply dynamic offset if focused on devices
    if (target === "laptop" || target === "tablet" || target === "phone") {
        const direction = new THREE.Vector3().subVectors(currentTargetPos, currentTargetLook).normalize();
        currentTargetPos.addScaledVector(direction, dynamicOffset - 1);
    }

    let activeTargetPos = currentTargetPos;
    let activeTargetLook = currentTargetLook;

    if (route && route[routeIdx]) {
      activeTargetPos = route[routeIdx].pos;
      activeTargetLook = route[routeIdx].look;

      if (camera.position.distanceTo(activeTargetPos) < 0.1) {
        if (routeIdx < route.length - 1) {
          setRouteIdx(routeIdx + 1);
        } else {
          setRoute(null);
          if (doorOpen) closeDoor();
        }
      }
    }

    // Smooth damping
    easing.damp3(camera.position, activeTargetPos, 0.4, delta);
    easing.dampLookAt(camera, activeTargetLook, 0.4, delta);

    // Check if we arrived
    if (!route && camera.position.distanceTo(currentTargetPos) < 0.05) {
        setIsMoving(false);
        // Only set freeCam if we aren't at the door
        if (target !== "door") {
            // setFreeCam(true); // Optional: enable if you want OrbitControls to take over after arrival
        }
    }
  });

  return null;
}
