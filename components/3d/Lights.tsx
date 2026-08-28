"use client";

import { useUIStore } from "./store";

export function Lights() {
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  return (
    <>
      <ambientLight intensity={0.35} color="#ffffff" />
      <hemisphereLight args={["#e8e6f0", "#1a1a22", 0.4]} />
      <directionalLight position={[-4, 5, -2]} intensity={0.6} color="#fff7e6" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0001} />

      <spotLight
        position={[-2.6, 3.4, -5.0]}
        intensity={reducedMotion ? 1.8 : 2.4}
        angle={0.55}
        penumbra={0.8}
        color="#ffd700"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      <pointLight position={[0, 1.15, -6.8]} intensity={0.4} distance={5} decay={2} color="#7dd3fc" />
      <pointLight position={[0, 5.5, -4.5]} intensity={0.5} distance={12} decay={2} color="#fff4e0" />

      <rectAreaLight
        position={[0, 3.1, -8.98]}
        rotation={[0, Math.PI, 0]}
        color="#ffd700"
        intensity={reducedMotion ? 3 : 4.5}
        width={7.5}
        height={2.8}
      />
    </>
  );
}
