"use client";

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} color="#c9c9d4" />
      <hemisphereLight args={["#d7d3e8", "#141210", 0.45]} />
      <directionalLight
        position={[5, 7, 4]}
        intensity={1.15}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight
        position={[-4, 6, -5]}
        intensity={0.35}
        color="#7db9ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <pointLight position={[-2.6, 3.4, -5.6]} intensity={5} distance={7} decay={2} color="#ffd9a0" />
      <pointLight position={[4.4, 2.6, -6.4]} intensity={3.5} distance={6} decay={2} color="#8f7dff" />
      <pointLight position={[0, 4.6, -10.5]} intensity={2} distance={8} decay={2} color="#ffd700" />
      <rectAreaLight
        position={[0, 2.2, -8.4]}
        color="#ffb347"
        intensity={8}
        width={4}
        height={0.5}
        lookAt={[0, 0.8, -7.6]}
      />
      <rectAreaLight
        position={[0, 1.9, 0.3]}
        color="#fff8e7"
        intensity={5}
        width={2.5}
        height={1.4}
        lookAt={[0, 1.9, -2]}
      />
    </>
  );
}