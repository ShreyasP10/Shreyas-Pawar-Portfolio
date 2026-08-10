"use client";

import { useWorkspace } from "./store";

export function Lights() {
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  return (
    <>
      <ambientLight intensity={0.12} color="#ffffff" />
      <hemisphereLight args={["#d7d3e8", "#0a0a0a", 0.35]} />

      {/* Main Desk Lamp (Key Light) - Warm Luxury Gold Accent */}
      <spotLight
        position={[-2.8, 3.2, -5.2]}
        intensity={reducedMotion ? 2.8 : 3.6}
        angle={0.58}
        penumbra={0.7}
        color="#ffb347"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      />

      {/* Subtle Cyan "Tech" Rim Light to catch edges of devices */}
      <pointLight
        position={[0, 1.15, -6.8]}
        intensity={0.65}
        distance={4.5}
        decay={2}
        color="#7dd3fc"
      />

      {/* Window Moonlight Fill (Subtle Blue Contrast) */}
      <directionalLight
        position={[-6, 4.5, -3.5]}
        intensity={0.55}
        color="#8fa8ff"
      />

      {/* Warm Ambient Ceiling Fill */}
      <pointLight position={[0, 5.8, -4.5]} intensity={0.8} distance={18} decay={2} color="#fff4e0" />

      {/* Luxury Backlight for Wall Board area */}
      <rectAreaLight
        position={[0, 3.1, -8.92]}
        color="#ffd700"
        intensity={reducedMotion ? 4.5 : 6.2}
        width={7.5}
        height={2.8}
      />

      {/* Desk Under-glow LED Strip - Cyan Accents */}
      <rectAreaLight
        position={[0, 0.74, -7.1]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#7dd3fc"
        intensity={3}
        width={5.4}
        height={0.15}
      />
    </>
  );
}
