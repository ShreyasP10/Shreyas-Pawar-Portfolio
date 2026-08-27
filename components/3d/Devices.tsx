"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useWorkspace, type DeviceId } from "./store";
import { LaptopScreen, TabletScreen, PhoneScreen, TvScreen } from "./Screens";
import { brushedTexture, speckleTextureDark, asusLidTexture, asusChinTexture } from "./materials";

const SCREEN_DARK = "#101018";

const BRUSHED = brushedTexture();
const DECK = speckleTextureDark();

interface HoverableProps {
  device?: DeviceId;
  label: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  floorOffset?: number;
  showRing?: boolean;
  glowZ?: number;
  children: React.ReactNode;
}

function Hoverable({ device, label, position, rotation, floorOffset = 0, showRing = true, glowZ = 0.7, children }: HoverableProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const targetScale = useRef(1);
  const glowRef = useRef<THREE.PointLight>(null);
  const glowTarget = useRef(0);
  const ringMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const openDevice = useWorkspace((s) => s.openDevice);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

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
      rotation={rotation}
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
      <Hoverable device="laptop" label="LAPTOP — PRIMARY HUB · CODE & PROJECTS" position={[0, 0.8273, -7.4]} floorOffset={-0.8273}>
        <group position={[0, 0.018, 0]} scale={0.6}>
          <LaptopModel />
          <group position={[0, 0.03, -0.52]} rotation={[-0.35, 0, 0]}>
            <group position={[0, 0.55, 0.013]}>
              <Html transform position={[0, 0, 0.002]} distanceFactor={1.2} zIndexRange={[40, 0]} occlude>
                <LaptopScreen />
              </Html>
            </group>
          </group>
        </group>
      </Hoverable>

      <Hoverable device="tablet" label="TABLET — EXPERIENCE DASHBOARD" position={[0.75, 0.8273, -7.3]} floorOffset={-0.8273}>
        <group position={[0, 0.06, 0]} scale={0.6}>
          <TabletModel />
          <group rotation={[-0.24, -Math.PI / 4, 0]}>
            <group position={[0, 0.33, 0.024]}>
              <Html transform position={[0, 0, 0.001]} distanceFactor={1.2} zIndexRange={[40, 0]} occlude>
                <TabletScreen />
              </Html>
            </group>
          </group>
        </group>
      </Hoverable>

      <Hoverable device="phone" label="PHONE — CONTACT" position={[-0.75, 0.8273, -7.35]} floorOffset={-0.8273}>
        <group scale={0.55}>
          <PhoneModel />
          <group rotation={[-0.22, Math.PI / 4, 0]}>
            <group position={[0, 0.33, 0.015]}>
              <Html transform position={[0, 0, 0.001]} distanceFactor={1.1} zIndexRange={[40, 0]} occlude>
                <PhoneScreen active={activeDevice === "phone"} />
              </Html>
            </group>
          </group>
        </group>
      </Hoverable>

      <TvWall />
    </group>
  );
}

function TvWall() {
  const tvFullscreen = useWorkspace((s) => s.tvFullscreen);
  const setTvFullscreen = useWorkspace((s) => s.setTvFullscreen);

  const handleTvClick = () => {
    if (!tvFullscreen) {
      setTvFullscreen(true);
    }
  };

  return (
    <group>
      <Hoverable
        device="tv"
        label={tvFullscreen ? "EXIT FULLSCREEN" : "TV — SHOWCASE"}
        position={[4.8, 1.9, -4.5]}
        rotation={[0, -Math.PI / 2, 0]}
        showRing={false}
        glowZ={0.7}
      >
        <TvModel onClick={handleTvClick} />
        {!tvFullscreen && (
          <Html transform position={[0, 0, 0.064]} distanceFactor={2} zIndexRange={[40, 0]} occlude>
            <TvScreen />
          </Html>
        )}
      </Hoverable>
    </group>
  );
}

function TvModel({ onClick }: { onClick?: () => void }) {
  return (
    <group onClick={onClick}>
      {/* Massive flat screen display */}
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[2.5, 1.45, 0.06]} />
        <meshStandardMaterial color="#08080c" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Thin crisp gold frame */}
      <mesh position={[0, 0, 0.051]}>
        <boxGeometry args={[2.52, 1.47, 0.01]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[2.46, 1.41, 0.01]} />
        <meshStandardMaterial
          color={SCREEN_DARK}
          emissive="#0d0d18"
          emissiveIntensity={0.18}
          roughness={0.45}
        />
      </mesh>

      {/* Cabinet and props below */}
      <group position={[0, -1.325, 0.32]}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 1.05, 0.5]} />
          <meshStandardMaterial map={DECK} color="#0a0a0a" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Gold accents on cabinet */}
        <mesh position={[0, 0.526, 0.26]}>
           <boxGeometry args={[1.72, 0.005, 0.52]} />
           <meshStandardMaterial color="#ffd700" />
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
      <pointLight position={[0, 0.45, 1.2]} intensity={1.2} distance={4.5} decay={2} color="#ffb347" />
      <pointLight position={[0, 1.9, 1.2]} intensity={0.6} distance={5} decay={2} color="#7dd3fc" />
    </group>
  );
}

function LaptopModel() {
  const keyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#16161c", roughness: 0.45, metalness: 0.35 }),
    []
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3c4048", roughness: 0.4, metalness: 0.55 }),
    []
  );
  const lidTex = asusLidTexture();
  const chinTex = asusChinTexture();

  const keyRows: number[] = [-0.4, -0.315, -0.23, -0.145];
  const bottomKeys: number[] = [-0.66, -0.55, -0.44, -0.33, -0.22, 0.26, 0.37, 0.48, 0.59, 0.7];

  return (
    <group>
      {/* Base chassis — silver aluminum */}
      <mesh castShadow receiveShadow position={[0, -0.015, 0]}>
        <boxGeometry args={[1.7, 0.03, 1.05]} />
        <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* ErgoLift hinge barrels */}
      {[-0.79, 0.79].map((x) => (
        <mesh key={x} position={[x, 0.0, -0.51]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.05, 12]} />
          <meshStandardMaterial map={BRUSHED} color="#ffffff" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      {/* Keyboard deck */}
      <mesh castShadow position={[0, 0.005, -0.15]}>
        <boxGeometry args={[1.55, 0.015, 0.62]} />
        <meshStandardMaterial map={DECK} color="#ffffff" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.005, 0.28]}>
        <boxGeometry args={[1.05, 0.012, 0.02]} />
        <meshStandardMaterial map={DECK} color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Scissor keys — 4 rows + spacebar row */}
      {keyRows.map((z, r) =>
        Array.from({ length: 12 }).map((_, k) => {
          const x = -0.66 + k * 0.11;
          const accent = (r === 0 && k === 0) || (r === 2 && k >= 9) || (r === 3 && k >= 10);
          return (
            <mesh key={`${r}-${k}`} position={[x, 0.0185, z]} material={accent ? accentMat : keyMat}>
              <boxGeometry args={[0.098, 0.012, 0.032]} />
            </mesh>
          );
        })
      )}
      <mesh position={[0.02, 0.0185, -0.06]} material={keyMat}>
        <boxGeometry args={[0.5, 0.012, 0.035]} />
      </mesh>
      {bottomKeys.map((x, i) => (
        <mesh key={`b${i}`} position={[x, 0.0185, -0.06]} material={keyMat}>
          <boxGeometry args={[0.098, 0.012, 0.032]} />
        </mesh>
      ))}
      {/* Touchpad */}
      <mesh position={[0, 0.016, 0.1]}>
        <boxGeometry args={[0.42, 0.007, 0.24]} />
        <meshStandardMaterial color="#1b1b22" roughness={0.35} metalness={0.5} />
      </mesh>

      {/* 16:10 display lid */}
      <group position={[0, 0.03, -0.52]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[1.7, 1.1, 0.024]} />
          <meshStandardMaterial color="#23252b" roughness={0.3} metalness={0.65} />
        </mesh>
        <mesh position={[0, 0.55, 0.013]}>
          <boxGeometry args={[1.62, 1.02, 0.008]} />
          <meshStandardMaterial
            color={SCREEN_DARK}
            emissive="#0e0d18"
            emissiveIntensity={0.16}
            roughness={0.45}
          />
        </mesh>
        {/* Bottom chin branding — visible from the desk view */}
        <mesh position={[0, 0.02, 0.0145]}>
          <planeGeometry args={[0.95, 0.05]} />
          <meshStandardMaterial map={chinTex} transparent roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Camera bump */}
        <mesh position={[0, 1.095, 0.011]}>
          <boxGeometry args={[0.3, 0.012, 0.008]} />
          <meshStandardMaterial color="#141418" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.097, 0.0155]}>
          <sphereGeometry args={[0.007, 8, 8]} />
          <meshStandardMaterial color="#0a0a0e" roughness={0.3} />
        </mesh>
        {/* ASUS logo on the lid back */}
        <mesh position={[0, 0.62, -0.014]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.42, 0.89]} />
          <meshStandardMaterial map={lidTex} roughness={0.25} metalness={0.7} />
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
          emissiveIntensity={0.15}
          roughness={0.45}
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
          emissiveIntensity={0.15}
          roughness={0.45}
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
