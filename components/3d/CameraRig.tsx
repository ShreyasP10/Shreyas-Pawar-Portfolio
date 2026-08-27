"use client";

import { useCameraDamping } from "./cameraHooks";
import { useScrollSync } from "./useScrollSync";

export function CameraRig() {
  useCameraDamping();
  useScrollSync();

  return null;
}
