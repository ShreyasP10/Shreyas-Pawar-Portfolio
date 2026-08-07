"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, SSAO } from "@react-three/postprocessing";
import * as THREE from "three";
import { Lights } from "./Lights";
import { Room } from "./Room";
import { Devices } from "./Devices";
import { Dust } from "./Dust";
import { CameraRig } from "./CameraRig";
import { FreeCam } from "./FreeCam";
import { useWorkspace } from "./store";

function ReadyGate() {
  const setLoading = useWorkspace((s) => s.setLoading);
  const ready = useRef(false);

  useFrame(() => {
    if (!ready.current) {
      ready.current = true;
      setLoading(false);
    }
  });

  return null;
}

export function Experience() {
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 45, near: 0.1, far: 100, position: [0, 3, 9] }}
      onCreated={(state) => state.gl.setClearColor("#0a0a0a")}
    >
      <Suspense fallback={null}>
        <Lights />
        <Room />
        <Devices />
        <Dust />
        <CameraRig />
        <FreeCam />
        <ReadyGate />
        <EffectComposer multisampling={4} enableNormalPass>
          <SSAO
            radius={0.09}
            intensity={16}
            luminanceInfluence={0.5}
            samples={16}
            distanceScaling
          />
          <Bloom intensity={0.35} luminanceThreshold={1} mipmapBlur radius={0.7} />
          <Vignette eskil={false} offset={0.18} darkness={0.72} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
