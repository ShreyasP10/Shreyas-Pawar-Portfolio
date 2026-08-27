"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, SSAO } from "@react-three/postprocessing";
import * as THREE from "three";
import { Lights } from "./Lights";
import { Room } from "./Room";
import { Devices } from "./Devices";
import { Dust } from "./Dust";
import { CameraRig } from "./CameraRig";
import { FreeCam } from "./FreeCam";
import { WebGLBoundary } from "./WebGLBoundary";
import { useUIStore } from "./store";
import { setAudioListener, startHum, stopHum, DEVICE_SOUND_POS } from "./sound";

function ReadyGate() {
  const setLoading = useUIStore((s) => s.setLoading);
  const ready = useRef(false);

  useFrame(() => {
    if (!ready.current) {
      ready.current = true;
      setLoading(false);
    }
  });

  return null;
}

function AudioRig() {
  const camera = useThree((s) => s.camera);
  const activeDevice = useUIStore((s) => s.activeDevice);
  const soundOn = useUIStore((s) => s.soundOn);
  const [listener] = useState(() => new THREE.AudioListener());

  useEffect(() => {
    camera.add(listener);
    setAudioListener(listener);
    return () => {
      camera.remove(listener);
      setAudioListener(null);
    };
  }, [camera, listener]);

  useEffect(() => {
    stopHum();
    if (activeDevice && soundOn && DEVICE_SOUND_POS[activeDevice]) {
      startHum(DEVICE_SOUND_POS[activeDevice]);
    }
    return () => stopHum();
  }, [activeDevice, soundOn]);

  return null;
}

function Effects() {
  const maxTextures = useThree((s) => s.gl.capabilities.maxTextures);
  const limited = maxTextures <= 16;
  return (
    <EffectComposer multisampling={limited ? 2 : 4} enableNormalPass={!limited}>
      {!limited ? (
        <>
          <SSAO
            radius={0.09}
            intensity={16}
            luminanceInfluence={0.5}
            samples={16}
            distanceScaling
          />
        </>
      ) : (
        <></>
      )}
      <Bloom intensity={0.35} luminanceThreshold={1} mipmapBlur radius={0.7} />
      <Vignette eskil={false} offset={0.18} darkness={0.72} />
    </EffectComposer>
  );
}

export function Experience() {
  return (
    <WebGLBoundary>
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
          <AudioRig />
          <ReadyGate />
          <Effects />
        </Suspense>
      </Canvas>
    </WebGLBoundary>
  );
}
