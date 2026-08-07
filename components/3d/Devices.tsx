"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useWorkspace, type DeviceId } from "./store";
import { LaptopScreen, TabletScreen, PhoneScreen, TvScreen } from "./Screens";
import { brushedTexture, speckleTexture } from "./materials";

const SCREEN_DARK = "#0b0b10";

const BRUSHED = brushedTexture();
const DECK = speckleTexture("#101014", "#1a1a22", "#060609");

interface HoverableProps {
  device?: DeviceId;
  label: string;
  position?: [number, number, number];
  floorOffset?: number;
  showRing?: boolean;
  glowZ?: number;
  children: React.ReactNode;
}

function Hoverable({ device, label, position, floorOffset = 0, showRing = true, glowZ = 0.7, children }: HoverableProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const targetScale = useRef(1);
  const glowRef = useRef<THREE.PointLight>(null);
  const glowTarget = useRef(0);
  const ringMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const openDevice = useWorkspace((s) => s.openDevice);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    targetScale.current = THREE.MathUtils.damp(
      targetScale.current,
      hovered ? 1.05 : 1,
      10,
      delta
    );
    groupRef.current.scale.setScalar(targetScale.current);
    if (glowRef.current && ringMatRef.current) {
      glowTarget.current = THREE.MathUtils.damp(glowTarget.current, hovered ? 1 : 0, 8, delta);
      glowRef.current.intensity = 3.2 * glowTarget.current;
      if (ringMatRef.current) ringMatRef.current.opacity = 0.22 * glowTarget.current;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (device) openDevice(device);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {children}
      <pointLight ref={glowRef} position={[0, 1.4, glowZ]} color="#22d3ee" intensity={0} distance={3.5} decay={2} />
      {showRing && (
        <mesh
          position={[0, floorOffset + 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <circleGeometry args={[0.6, 40]} />
          <meshBasicMaterial
            ref={ringMatRef}
            color="#22d3ee"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      {hovered && (
        <Html center position={[0, 1.1, 0]} zIndexRange={[50, 0]}>
          <div className="whitespace-nowrap rounded border border-[#ffd700]/40 bg-black/70 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-[#ffd700] backdrop-blur">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

export function Devices() {
  const activeDevice = useWorkspace((s) => s.activeDevice);

  return (
    <group>
      <Hoverable device="laptop" label="LAPTOP — PRIMARY HUB · CODE & PROJECTS" position={[0, 0.835, -7.4]} floorOffset={-0.835}>
        <LaptopModel />
        {activeDevice === "laptop" && (
          <group position={[0, 0.03, -0.52]} rotation={[-0.35, 0, 0]}>
            <Html transform position={[0, 0.55, 0.02]} distanceFactor={2} zIndexRange={[40, 0]}>
              <LaptopScreen />
            </Html>
          </group>
        )}
      </Hoverable>

      <Hoverable device="tablet" label="TABLET — EXPERIENCE DASHBOARD" position={[1.8, 0.995, -7.3]} floorOffset={-0.995}>
        <TabletModel />
        {activeDevice === "tablet" && (
          <group position={[0, 0.33, 0.024]} rotation={[-0.24, -Math.PI / 4, 0]}>
            <Html transform position={[0, 0, 0.003]} distanceFactor={2} zIndexRange={[40, 0]}>
              <TabletScreen />
            </Html>
          </group>
        )}
      </Hoverable>

      <Hoverable device="phone" label="PHONE — CONTACT" position={[-1.9, 0.81, -7.1]} floorOffset={-0.81}>
        <PhoneModel />
        {activeDevice === "phone" && (
          <group position={[0, 0.33, 0.02]} rotation={[-0.22, Math.PI / 4, 0]}>
            <Html transform position={[0, 0, 0.002]} distanceFactor={2} zIndexRange={[40, 0]}>
              <PhoneScreen active />
            </Html>
          </group>
        )}
        {activeDevice !== "phone" && (
          <group position={[0, 0.33, 0.02]} rotation={[-0.22, Math.PI / 4, 0]}>
            <Html transform position={[0, 0, 0.002]} distanceFactor={2} zIndexRange={[30, 0]}>
              <PhoneScreen active={false} />
            </Html>
          </group>
        )}
      </Hoverable>

      <TvWall />
    </group>
  );
}

function TvWall() {
  const activeDevice = useWorkspace((s) => s.activeDevice);
  const tvFullscreen = useWorkspace((s) => s.tvFullscreen);
  const setTvFullscreen = useWorkspace((s) => s.setTvFullscreen);
  const closePanels = useWorkspace((s) => s.closePanels);

  const handleTvClick = () => {
    if (!tvFullscreen) {
      setTvFullscreen(true);
    }
  };

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closePanels();
    setTvFullscreen(false);
  };

  return (
    <group>
      <Hoverable
        device="tv"
        label={tvFullscreen ? "EXIT FULLSCREEN" : "TV — SHOWCASE"}
        position={[0, 1.9, -0.6]}
        showRing={false}
        glowZ={-0.7}
      >
        <TvModel onClick={handleTvClick} />
      </Hoverable>
      {activeDevice === "tv" && !tvFullscreen && (
        <group position={[0, 1.9, -0.6]}>
          <Html
            transform
            position={[0, 0, 0.053]}
            rotation={[0, Math.PI, 0]}
            distanceFactor={2}
            zIndexRange={[40, 0]}
          >
            <div style={{ transform: "scaleX(-1)" }}>
              <TvScreen />
            </div>
          </Html>
        </group>
      )}
      {tvFullscreen && (
        <Html
          center
          position={[0, 1.5, -0.5]}
          distanceFactor={1.8}
          zIndexRange={[100, 0]}
          onClick={handleFullscreenClick}
        >
          <div
            className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center backdrop-blur-xl"
            style={{ width: "100vw", height: "100vh" }}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#7dd3fc]">PRESS ESC OR CLICK TO EXIT</span>
              <button
                onClick={handleFullscreenClick}
                className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors text-[#ffd700]"
                aria-label="Exit fullscreen"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <TvScreen fullscreen />
          </div>
        </Html>
      )}
    </group>
  );
}

function TvModel({ }: { onClick?: () => void }) {
  return (
    <group>
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[2.5, 1.45, 0.06]} />
        <meshStandardMaterial color="#08080c" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[2.4, 1.35, 0.008]} />
        <meshStandardMaterial
          color={SCREEN_DARK}
          emissive="#0d0d18"
          emissiveIntensity={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.7, 0.06]}>
        <boxGeometry args={[2.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.9} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.745, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.2]} />
        <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.35} metalness={0.7} />
      </mesh>
      <group position={[0, -1.325, 0.32]}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 1.05, 0.5]} />
          <meshStandardMaterial map={DECK} color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[-0.55, 0.56, 0.28]}>
          <boxGeometry args={[0.24, 0.03, 0.18]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.75, 0.56, 0]}>
          <boxGeometry args={[0.05, 0.25, 0.18]} />
          <meshStandardMaterial color="#3b2a18" roughness={0.85} />
        </mesh>
        <mesh position={[-0.68, 0.55, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.18]} />
          <meshStandardMaterial color="#2c4a3a" roughness={0.85} />
        </mesh>
        <mesh position={[0.2, 0.54, 0.26]}>
          <boxGeometry args={[0.18, 0.24, 0.03]} />
          <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.66, 0.53, 0.2]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color="#8a7355" roughness={0.6} />
        </mesh>
        <mesh position={[0.72, 0.66, 0.2]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#8a7355" roughness={0.6} />
        </mesh>
      </group>
      <pointLight position={[0, 0.45, -1.2]} intensity={1.2} distance={4.5} decay={2} color="#ffb347" />
      <pointLight position={[0, 1.9, -1.2]} intensity={0.6} distance={5} decay={2} color="#7dd3fc" />
    </group>
  );
}

function LaptopModel() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.015, 0]}>
        <boxGeometry args={[1.7, 0.03, 1.05]} />
        <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.005, -0.15]}>
        <boxGeometry args={[1.55, 0.015, 0.62]} />
        <meshStandardMaterial map={DECK} color="#ffffff" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.005, 0.28]}>
        <boxGeometry args={[1.05, 0.012, 0.02]} />
        <meshStandardMaterial map={DECK} color="#ffffff" roughness={0.3} />
      </mesh>

      <group position={[0, 0.03, -0.52]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[1.7, 1.1, 0.024]} />
          <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.55, 0.013]}>
          <boxGeometry args={[1.62, 1.02, 0.008]} />
          <meshStandardMaterial
            color={SCREEN_DARK}
            emissive="#0e0d18"
            emissiveIntensity={0.6}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 1.07, 0]}>
          <boxGeometry args={[0.32, 0.012, 0.012]} />
          <meshStandardMaterial map={DECK} color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[-0.79, 0.55, 0]}>
          <boxGeometry args={[0.012, 1.05, 0.012]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
}

function TabletModel() {
  return (
    <group rotation={[-0.24, -Math.PI / 4, 0]}>
      <mesh castShadow position={[0, 0.33, 0]}>
        <boxGeometry args={[0.56, 0.86, 0.045]} />
        <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.33, 0.024]}>
        <boxGeometry args={[0.52, 0.82, 0.006]} />
        <meshStandardMaterial
          color={SCREEN_DARK}
          emissive="#0d0d18"
          emissiveIntensity={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0.33, -0.025]}>
        <boxGeometry args={[0.5, 0.8, 0.004]} />
        <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, 0.02]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.015, 10, 10]} />
        <meshStandardMaterial color="#05050a" />
      </mesh>
      <group position={[0, -0.02, -0.04]} rotation={[0.55, 0, 0]}>
        <mesh castShadow position={[0, -0.05, 0.12]}>
          <boxGeometry args={[0.5, 0.02, 0.34]} />
          <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

function PhoneModel() {
  return (
    <group rotation={[-0.22, Math.PI / 4, 0]}>
      <mesh position={[0, 0.05, -0.06]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.04, 24]} />
        <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.33, 0]}>
        <boxGeometry args={[0.33, 0.66, 0.028]} />
        <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.33, 0.015]}>
        <boxGeometry args={[0.3, 0.62, 0.004]} />
        <meshStandardMaterial
          color={SCREEN_DARK}
          emissive="#0d0d18"
          emissiveIntensity={0.7}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0.12, 0.56, 0.012]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#05050a" />
      </mesh>
      <mesh position={[0, 0.02, 0.012]}>
        <torusGeometry args={[0.06, 0.008, 10, 20]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1.1} />
      </mesh>
    </group>
  );
}
