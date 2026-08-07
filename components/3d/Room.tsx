"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useWorkspace } from "./store";
import { certifications } from "@/lib/data";
import {
  woodTextureRepeat,
  brushedTexture,
  fabricTexture,
  speckleTexture,
  plasterTextureRepeat,
  floorTextureRepeat,
  cityNightTexture,
} from "./materials";

type RoomTextures = Record<string, THREE.Texture | null>;

export function Room() {
  const target = useWorkspace((s) => s.target);

  const tex = useMemo(
    () => ({
      floor: floorTextureRepeat([5, 4]),
      wall: plasterTextureRepeat([4, 2]),
      desk: woodTextureRepeat([3, 1.5]),
      leg: woodTextureRepeat([1, 2]),
      mat: speckleTexture("#1b1410", "#241b12", "#0f0a07"),
      matTop: speckleTexture("#201812", "#2a2118", "#120d09"),
      lampShade: brushedTexture(),
      shelfWood: woodTextureRepeat([1, 2]),
      rubber: speckleTexture("#101014", "#1c1c24", "#07070a"),
      paper: speckleTexture("#14141a", "#1d1d26", "#0a0a0e"),
      cover: speckleTexture("#3a2f08", "#4a3d0f", "#241c05"),
      pegboard: speckleTexture("#16161c", "#20202a", "#0c0c11"),
      pot: speckleTexture("#1d2a24", "#2a3b33", "#0f1713"),
      trim: speckleTexture("#101014", "#18181e", "#08080b"),
      doorWood: woodTextureRepeat([1, 2.5]),
      carpet: speckleTexture("#1a2028", "#232b36", "#0e1218"),
    }),
    []
  );

  return (
    <group>
      <mesh position={[0, 0, -4.5]} receiveShadow>
        <boxGeometry args={[10, 0.1, 9]} />
        <meshStandardMaterial map={tex.floor} color="#ffffff" roughness={0.85} />
      </mesh>

      <mesh position={[0, 3, -9.05]}>
        <boxGeometry args={[10, 6, 0.1]} />
        <meshStandardMaterial map={tex.wall} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3, 0.05]}>
        <boxGeometry args={[10, 6, 0.1]} />
        <meshStandardMaterial map={tex.wall} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[-5.05, 3, -6.5875]}>
        <boxGeometry args={[0.1, 6, 4.825]} />
        <meshStandardMaterial map={tex.wall} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[-5.05, 3, -1.5125]}>
        <boxGeometry args={[0.1, 6, 3.025]} />
        <meshStandardMaterial map={tex.wall} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[5.05, 3, -4.5]}>
        <boxGeometry args={[0.1, 6, 9]} />
        <meshStandardMaterial map={tex.wall} color="#ffffff" roughness={0.95} />
      </mesh>

      <mesh position={[0, 6.05, -4.5]}>
        <boxGeometry args={[10.2, 0.1, 9.2]} />
        <meshStandardMaterial color="#0d0d11" roughness={0.92} />
      </mesh>
      {[
        [0, 5.95, -8.95, [10.2, 0.02, 0.03]],
        [0, 5.95, 0.08, [10.2, 0.02, 0.03]],
        [-4.95, 5.95, -4.5, [0.03, 0.02, 9.2]],
        [4.95, 5.95, -4.5, [0.03, 0.02, 9.2]],
      ].map((p, i) => (
        <mesh key={i} position={[p[0] as number, p[1] as number, p[2] as number]}>
          <boxGeometry args={p[3] as [number, number, number]} />
          <meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={2.0} roughness={0.4} />
        </mesh>
      ))}

      {[
        [0, 0.095, -8.94, [10, 0.09, 0.06]],
        [0, 0.095, 0.06, [10, 0.09, 0.06]],
        [4.94, 0.095, -4.5, [0.06, 0.09, 9]],
        [-4.94, 0.095, -4.5, [0.06, 0.09, 9]],
      ].map((p, i) => (
        <mesh key={i} position={[p[0] as number, p[1] as number, p[2] as number]}>
          <boxGeometry args={p[3] as [number, number, number]} />
          <meshStandardMaterial map={tex.trim} color="#ffffff" roughness={0.8} />
        </mesh>
      ))}
      {[
        [0, 0.16, -8.94, [10, 0.012, 0.015]],
        [0, 0.16, 0.06, [10, 0.012, 0.015]],
        [4.94, 0.16, -4.5, [0.015, 0.012, 9]],
        [-4.94, 0.16, -4.5, [0.015, 0.012, 9]],
      ].map((p, i) => (
        <mesh key={i} position={[p[0] as number, p[1] as number, p[2] as number]}>
          <boxGeometry args={p[3] as [number, number, number]} />
          <meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={1.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Ceiling fan - minimal modern */}
      <CeilingFan />

      {/* Ceiling spotlights for accent lighting */}
      <CeilingSpotlights />

      <mesh position={[-6.0, 0, -3.6]} receiveShadow>
        <boxGeometry args={[2, 0.1, 3]} />
        <meshStandardMaterial map={tex.floor} color="#ffffff" roughness={0.85} />
      </mesh>

      <WallName target={target} />

      <Window />

      <Pegboard tex={tex} />

      <Bookshelf tex={tex} />

      <StickyNotes />

      <Door tex={tex} />

      <CertsWall />

      <mesh position={[0, 0.065, -6.8]} receiveShadow>
        <boxGeometry args={[5.8, 0.03, 3.2]} />
        <meshStandardMaterial map={tex.mat} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.08, -6.9]}>
        <boxGeometry args={[5.1, 0.005, 2.6]} />
        <meshStandardMaterial map={tex.matTop} color="#ffffff" roughness={1} />
      </mesh>

      <group position={[0, 0.78, -7.6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5.4, 0.09, 2]} />
          <meshStandardMaterial
            map={tex.desk}
            bumpMap={tex.desk}
            bumpScale={0.02}
            color="#ffffff"
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
        {[[-2.35, -0.72, -0.8], [2.35, -0.72, -0.8], [-2.35, -0.72, 0.8], [2.35, -0.72, 0.8]].map(
          (pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} castShadow>
              <boxGeometry args={[0.12, 0.72, 0.12]} />
              <meshStandardMaterial map={tex.leg} color="#ffffff" roughness={0.6} />
            </mesh>
          )
        )}
        <mesh position={[0, -0.12, -0.15]}>
          <boxGeometry args={[0.4, 0.015, 0.3]} />
          <meshStandardMaterial map={tex.trim} color="#ffffff" roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      <mesh position={[0, 0.835, -8.57]}>
        <boxGeometry args={[5.2, 0.02, 0.02]} />
        <meshStandardMaterial
          color="#ffb347"
          emissive="#ffb347"
          emissiveIntensity={2.6}
          roughness={0.3}
        />
      </mesh>
      <pointLight position={[0, 1.15, -8.4]} intensity={1.4} distance={6} decay={2} color="#ffb347" />

      <MonitorLightBar />

      <Chair />

      <FloorLamp tex={tex} />

      <Keyboard />

      <group position={[0.95, 0.89, -6.85]}>
        <mesh castShadow scale={[1, 0.65, 0.85]}>
          <sphereGeometry args={[0.085, 20, 20]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.045, 0.03]}>
          <boxGeometry args={[0.05, 0.02, 0.09]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.5} />
        </mesh>
        <BreathingDot />
      </group>

      <group position={[2.35, 0.88, -8.0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.075, 0.06, 0.1, 20]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.078, 0.078, 0.018, 20]} />
          <meshStandardMaterial map={tex.mat} color="#ffffff" roughness={0.9} />
        </mesh>
        <Html transform position={[0, 0.09, 0.062]} distanceFactor={12} zIndexRange={[15, 0]}>
          <div
            className="whitespace-nowrap font-mono font-bold tracking-[0.2em] text-white/90"
            style={{ fontSize: "8px" }}
          >
            CODE·BUILD·REPEAT
          </div>
        </Html>
      </group>

      <MugSteam />

      <group position={[-2.3, 0.833, -7.95]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.012, 0.3]} />
          <meshStandardMaterial map={tex.paper} color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[0.16, 0.015, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.28, 0.012, 0.018]} />
          <meshStandardMaterial map={tex.cover} color="#ffffff" roughness={0.5} />
        </mesh>
      </group>

      <group position={[-1.1, 0.905, -7.1]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.14, 20]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.02, 20]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      <group position={[2.05, 0.8725, -6.8]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.025, 0.05]} />
          <meshStandardMaterial color="#e8e6e2" roughness={0.35} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.018, 0]}>
          <sphereGeometry args={[0.012, 10, 10]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} />
        </mesh>
      </group>

      <group position={[1.55, 0.8725, -8.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.09, 0.02, 0.05]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.4} metalness={0.6} />
        </mesh>
        {[[0.02, 0.013, 0], [0.03, 0.013, 0.018], [0.02, 0.013, -0.018]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <boxGeometry args={[0.014, 0.008, 0.008]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.3} />
          </mesh>
        ))}
      </group>

      <group position={[4.5, 0, -8.1]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.28, 1, 14]} />
          <meshStandardMaterial map={tex.pot} color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.18, 0]} castShadow>
          <sphereGeometry args={[0.55, 20, 20]} />
          <meshStandardMaterial color="#24382e" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#2d4a3a" roughness={0.8} />
        </mesh>
      </group>

      <mesh position={[-4.0, 0.06, -2.0]} receiveShadow>
        <boxGeometry args={[2.2, 0.02, 1.6]} />
        <meshStandardMaterial map={tex.carpet} color="#ffffff" roughness={1} />
      </mesh>

      <group position={[-4.1, 0, -2.2]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.4, 14]} />
          <meshStandardMaterial map={tex.pot} color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#2d4a3a" roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.75, 0.05]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#24382e" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

function Chair() {
  const chairRef = useRef<THREE.Group>(null);
  const lastInteraction = useWorkspace((s) => s.lastInteraction);

  useFrame((state) => {
    if (!chairRef.current) return;
    const idle = state.clock.elapsedTime - lastInteraction / 1000;
    if (idle > 20) {
      chairRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    } else {
      chairRef.current.rotation.y = 0;
    }
  });

  const tex = useMemo(
    () => ({
      fabric: fabricTexture("#1c1c22"),
      metal: brushedTexture(),
      caster: speckleTexture("#1c1c22", "#26262e", "#101014"),
    }),
    []
  );

  return (
    <group ref={chairRef} position={[-0.9, 0, -6.2]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.05, 16]} />
        <meshStandardMaterial map={tex.metal} color="#ffffff" roughness={0.45} metalness={0.55} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.28, 0.045, Math.sin(angle) * 0.28]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial map={tex.caster} color="#ffffff" roughness={0.4} metalness={0.6} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.31, 0]}>
        <cylinderGeometry args={[0.03, 0.035, 0.42, 12]} />
        <meshStandardMaterial map={tex.metal} color="#ffffff" roughness={0.45} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.46, 0.05, 0.46]} />
        <meshStandardMaterial map={tex.fabric} color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.82, 0.24]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.44, 0.55, 0.05]} />
        <meshStandardMaterial map={tex.fabric} color="#ffffff" roughness={0.9} />
      </mesh>
      {[-0.25, 0.25].map((x) => (
        <group key={x} position={[x, 0.32, 0.02]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.04, 0.32, 0.04]} />
            <meshStandardMaterial map={tex.metal} color="#ffffff" roughness={0.45} metalness={0.55} />
          </mesh>
          <mesh position={[0, 0.23, 0.02]}>
            <boxGeometry args={[0.05, 0.03, 0.3]} />
            <meshStandardMaterial map={tex.fabric} color="#ffffff" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WallName({ target }: { target: string }) {
  return (
    <group position={[0, 3.1, -8.95]}>
      <mesh>
        <boxGeometry args={[6.4, 2.0, 0.06]} />
        <meshStandardMaterial color="#141018" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, -0.035]}>
        <boxGeometry args={[6.56, 2.16, 0.03]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.9}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
      <Html center position={[0, 0, 0.12]} distanceFactor={5.45} zIndexRange={[30, 0]}>
        <div
          className="pointer-events-none select-none"
          style={{
            width: 720,
            height: 240,
            opacity: target === "wall" ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        >
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className="font-black tracking-[0.3em] text-[#ffd700]"
              style={{ fontSize: 48, lineHeight: 1.05, textShadow: "0 0 32px rgba(255,215,0,0.45)" }}
            >
              SHREYAS
            </div>
            <div
              className="font-black tracking-[0.3em] text-[#ffd700]"
              style={{ fontSize: 48, lineHeight: 1.05, textShadow: "0 0 32px rgba(255,215,0,0.45)" }}
            >
              PAWAR
            </div>
            <div
              className="mt-2 whitespace-nowrap font-mono tracking-[0.22em] text-[#7dd3fc]"
              style={{ fontSize: 10.5, textShadow: "0 0 18px rgba(125,211,252,0.65)" }}
            >
              SOFTWARE ENGINEER · AI DEVELOPER · FULL STACK DEVELOPER · INNOVATOR
            </div>
            <p
              className="mx-auto mt-2 leading-relaxed text-[#c9c6d0]"
              style={{ fontSize: 10.5, width: 560, lineHeight: 1.5 }}
            >
              Building intelligent software that solves real-world problems using AI, Cloud and
              Modern Web Technologies.
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {["PROBLEM SOLVER", "TECH ENTHUSIAST", "LIFELONG LEARNER", "OPEN SOURCE"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#ffd700]/40 bg-[#ffd700]/10 px-2.5 py-0.5 font-mono text-[#ffd700]"
                  style={{ fontSize: 8.5, letterSpacing: "0.12em" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function FloorLamp({ tex }: { tex: RoomTextures }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime;
    if (reducedMotion) {
      lightRef.current.intensity = 1.1;
      return;
    }
    const flicker = 1 + 0.035 * Math.sin(t * 41.7) + 0.05 * Math.sin(t * 23.3 + 2.1);
    lightRef.current.intensity = 1.1 * flicker;
  });

  return (
    <group position={[-3.7, 0, -2.6]}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 1.5, 12]} />
        <meshStandardMaterial map={tex.lampShade} color="#ffffff" roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 0.05, 24]} />
        <meshStandardMaterial map={tex.lampShade} color="#ffffff" roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.58, 0]} rotation={[0.15, 0, 0]}>
        <coneGeometry args={[0.24, 0.32, 16, 1, true]} />
        <meshStandardMaterial
          map={tex.lampShade}
          color="#ffffff"
          roughness={0.5}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color="#ffd9a0"
          emissive="#ffd9a0"
          emissiveIntensity={2.2}
          roughness={0.3}
        />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.35, 0]} intensity={1.1} distance={4} decay={2} color="#ffd9a0" />
    </group>
  );
}

function CeilingFan() {
  const fanRef = useRef<THREE.Group>(null);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  useFrame((state) => {
    if (!fanRef.current) return;
    if (reducedMotion) return;
    fanRef.current.rotation.y += state.clock.getDelta() * 0.8;
  });

  const bladeMat = <meshStandardMaterial color="#1a1a1e" roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />;

  return (
    <group ref={fanRef} position={[0, 5.85, -4.5]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.08, 16]} />
        <meshStandardMaterial color="#141418" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.04, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.2, 8]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.4} metalness={0.8} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -0.14, 0]} rotation={[0, (i * Math.PI) / 2, 0]}>
          <boxGeometry args={[1.2, 0.015, 0.22]} />
          {bladeMat}
        </mesh>
      ))}
      <pointLight position={[0, -0.25, 0]} intensity={0.3} distance={6} decay={2} color="#ffd9a0" />
    </group>
  );
}

function CeilingSpotlights() {
  const positions = [
    [-2.5, 5.95, -7.5],
    [2.5, 5.95, -7.5],
    [-2.5, 5.95, -1.5],
    [2.5, 5.95, -1.5],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <spotLight
            angle={0.35}
            penumbra={0.5}
            intensity={1.8}
            distance={8}
            decay={2}
            color="#fff8e7"
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
            <meshStandardMaterial color="#0d0d11" roughness={0.6} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MonitorLightBar() {
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  return (
    <group position={[0, 1.35, -8.57]}>
      <mesh>
        <boxGeometry args={[1.8, 0.025, 0.03]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={reducedMotion ? 0.8 : 1.2}
          roughness={0.3}
        />
      </mesh>
      <rectAreaLight
        position={[0, 0.12, -0.05]}
        color="#ffd700"
        intensity={reducedMotion ? 4 : 6}
        width={1.8}
        height={0.15}
        lookAt={[0, 0.5, -1.5]}
      />
    </group>
  );
}

function MugSteam() {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const phase = i * 1.7;
      const life = (t * 0.28 + phase) % 1;
      m.position.set(
        Math.sin(t * 0.9 + phase * 2.1) * 0.028,
        0.04 + life * 0.44,
        Math.sin(t * 0.7 + phase) * 0.02
      );
      m.scale.setScalar(0.02 + life * 0.035);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - life) * 0.35;
    });
  });

  return (
    <group position={[2.35, 0.97, -8.0]}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshBasicMaterial color="#cfe7f5" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

const DOOR_OPEN_ANGLE = 1.9;
const DOOR_Z_HINGE = -4.175;
const DOOR_Z_EDGE = -3.025;
const DOOR_Y_TOP = 2.25;

function Door({ tex }: { tex: RoomTextures }) {
  const doorOpen = useWorkspace((s) => s.doorOpen);
  const hingeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!hingeRef.current) return;
    hingeRef.current.rotation.y = THREE.MathUtils.damp(
      hingeRef.current.rotation.y,
      doorOpen ? DOOR_OPEN_ANGLE : 0,
      2.2,
      delta
    );
  });

  const jambMat = <meshStandardMaterial map={tex.doorWood} color="#ffffff" roughness={0.55} />;

  return (
    <group>
      <mesh position={[-5.02, 1.125, DOOR_Z_HINGE]} castShadow>
        <boxGeometry args={[0.14, DOOR_Y_TOP + 0.06, 0.09]} />
        {jambMat}
      </mesh>
      <mesh position={[-5.02, 1.125, DOOR_Z_EDGE]} castShadow>
        <boxGeometry args={[0.14, DOOR_Y_TOP + 0.06, 0.09]} />
        {jambMat}
      </mesh>
      <mesh position={[-5.02, DOOR_Y_TOP + 0.03, -3.6]} castShadow>
        <boxGeometry args={[0.14, 0.09, 1.23]} />
        {jambMat}
      </mesh>

      <group ref={hingeRef} position={[-5.0, 0, DOOR_Z_HINGE]}>
        <mesh castShadow position={[0, 1.125, 0.575]}>
          <boxGeometry args={[0.06, DOOR_Y_TOP, 1.15]} />
          <meshStandardMaterial map={tex.doorWood} color="#ffffff" roughness={0.55} />
        </mesh>
        <mesh position={[0.02, 1.35, 1.08]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.14, 10]} />
          <meshStandardMaterial color="#141414" roughness={0.35} metalness={0.8} />
        </mesh>
      </group>

      <Html position={[-5.02, 1.6, -3.6]} distanceFactor={1.6} zIndexRange={[15, 0]}>
        <div
          className="flex flex-col items-center justify-center rounded-md border border-[#ffd700]/50 bg-black/85 shadow-[0_0_30px_rgba(255,215,0,0.25)] backdrop-blur"
          style={{ width: 200, height: 64 }}
        >
          <div className="font-black tracking-[0.28em] text-[#ffd700]" style={{ fontSize: 17 }}>
            SHREYAS PAWAR
          </div>
          <div className="mt-1 font-mono tracking-[0.4em] text-[#7dd3fc]" style={{ fontSize: 8 }}>
            SOFTWARE STUDIO
          </div>
        </div>
      </Html>
    </group>
  );
}

function Pegboard({ tex }: { tex: RoomTextures }) {
  return (
    <group position={[-4.95, 3.0, -6.4]}>
      <mesh>
        <boxGeometry args={[0.05, 1.4, 1.7]} />
        <meshStandardMaterial map={tex.pegboard} color="#ffffff" roughness={0.9} />
      </mesh>
      {[-0.6, 0, 0.6].map((z) => (
        <group key={z}>
          <mesh position={[0.03, 0.55, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 10]} />
            <meshStandardMaterial map={tex.trim} color="#ffffff" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.03, -0.55, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 10]} />
            <meshStandardMaterial map={tex.trim} color="#ffffff" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      <group position={[0.04, 0.42, -0.6]}>
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.028, 12, 28]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.7} />
        </mesh>
        <mesh position={[-0.2, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.14, 14]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.8} />
        </mesh>
        <mesh position={[0.2, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.14, 14]} />
          <meshStandardMaterial map={tex.rubber} color="#ffffff" roughness={0.8} />
        </mesh>
      </group>

      <PlantSway tex={tex} />
    </group>
  );
}

function PlantSway({ tex }: { tex: RoomTextures }) {
  const ref = useRef<THREE.Group>(null);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.55) * 0.045;
    ref.current.rotation.x = Math.cos(t * 0.4 + 1.2) * 0.03;
  });

  return (
    <group ref={ref} position={[0.05, 0.02, 0.62]}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.06, 0.045, 0.09, 12]} />
        <meshStandardMaterial map={tex.pot} color="#ffffff" roughness={0.8} />
      </mesh>
      {[[-0.06, 0.13, 0], [0.05, 0.17, 0], [0.02, 0.11, 0.02], [-0.02, 0.16, -0.02]].map(
        (pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#2d4a3a" roughness={0.8} />
          </mesh>
        )
      )}
    </group>
  );
}

function Bookshelf({ tex }: { tex: RoomTextures }) {
  return (
    <group position={[-4.8, 0, -8.0]}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.42, 2.3, 1.05]} />
        <meshStandardMaterial map={tex.doorWood} color="#ffffff" roughness={0.6} />
      </mesh>
      {[0.55, 1.1, 1.65].map((y) => (
        <mesh key={y} position={[0.01, y, 0]}>
          <boxGeometry args={[0.4, 0.04, 1.0]} />
          <meshStandardMaterial map={tex.shelfWood} color="#ffffff" roughness={0.6} />
        </mesh>
      ))}
      {[
        { y: 0.62, z: -0.3, c: "#3b2a18" },
        { y: 0.62, z: -0.12, c: "#2c4a3a" },
        { y: 0.62, z: 0.06, c: "#4a2c2c" },
        { y: 0.64, z: 0.24, c: "#2f2f4a" },
        { y: 1.17, z: -0.34, c: "#3f3a52" },
        { y: 1.17, z: -0.16, c: "#5a3a22" },
        { y: 1.17, z: 0.02, c: "#2f5a52" },
        { y: 1.19, z: 0.2, c: "#6a2c3a" },
        { y: 1.72, z: -0.3, c: "#274a66" },
        { y: 1.72, z: -0.12, c: "#4a4a2c" },
      ].map((b, i) => (
        <mesh key={i} position={[0.02, b.y, b.z]} castShadow>
          <boxGeometry args={[0.36, 0.16 + (i % 3) * 0.05, 0.1]} />
          <meshStandardMaterial color={b.c} roughness={0.85} />
        </mesh>
      ))}
      <group position={[-0.02, 0.62, 0.42]}>
        <mesh>
          <boxGeometry args={[0.22, 0.06, 0.14]} />
          <meshStandardMaterial color="#141414" roughness={0.45} metalness={0.7} />
        </mesh>
        <mesh position={[0.02, 0.035, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.14]} />
          <meshStandardMaterial color="#0f7a4d" roughness={0.5} />
        </mesh>
      </group>
      <group position={[-0.02, 1.72, 0.42]}>
        <mesh>
          <boxGeometry args={[0.14, 0.07, 0.24]} />
          <meshStandardMaterial color="#101014" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.12, 0.015, 0.22]} />
          <meshStandardMaterial color="#3a8cff" emissive="#3a8cff" emissiveIntensity={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* Arduino on middle shelf */}
      <group position={[-0.18, 1.17, 0.35]}>
        <mesh>
          <boxGeometry args={[0.09, 0.018, 0.065]} />
          <meshStandardMaterial color="#00979d" roughness={0.6} />
        </mesh>
        <mesh position={[-0.02, 0.012, 0.015]}>
          <boxGeometry args={[0.025, 0.01, 0.03]} />
          <meshStandardMaterial color="#141414" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0.02, 0.012, -0.015]}>
          <boxGeometry args={[0.025, 0.01, 0.03]} />
          <meshStandardMaterial color="#141414" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.008, 8]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Raspberry Pi on middle shelf */}
      <group position={[0.15, 1.17, 0.35]}>
        <mesh>
          <boxGeometry args={[0.085, 0.015, 0.056]} />
          <meshStandardMaterial color="#0f7a4d" roughness={0.6} />
        </mesh>
        <mesh position={[-0.025, 0.01, 0]}>
          <boxGeometry args={[0.02, 0.008, 0.015]} />
          <meshStandardMaterial color="#141414" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0.025, 0.01, 0]}>
          <boxGeometry args={[0.015, 0.008, 0.015]} />
          <meshStandardMaterial color="#141414" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* GPU box on top shelf */}
      <group position={[-0.02, 2.1, -0.1]}>
        <mesh>
          <boxGeometry args={[0.18, 0.08, 0.22]} />
          <meshStandardMaterial color="#101014" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.16, 0.015, 0.2]} />
          <meshStandardMaterial color="#3a8cff" emissive="#3a8cff" emissiveIntensity={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[-0.06, 0.06, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 12]} />
          <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0.06, 0.06, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 12]} />
          <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.7} />
        </mesh>
      </group>

      <group position={[0.08, 2.4, 0.28]}>
        <mesh>
          <boxGeometry args={[0.09, 0.2, 0.09]} />
          <meshStandardMaterial color="#e0b642" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={1.4}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Hackathon trophy on top shelf */}
      <group position={[-0.18, 2.4, 0.2]}>
        <mesh>
          <coneGeometry args={[0.04, 0.18, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
          <meshStandardMaterial color="#141414" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* Award plaque on top shelf */}
      <group position={[0.18, 2.4, 0.2]}>
        <mesh>
          <boxGeometry args={[0.08, 0.12, 0.01]} />
          <meshStandardMaterial color="#141414" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.006]}>
          <boxGeometry args={[0.06, 0.09, 0.005]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0.09, 2.4, -0.42]}>
        <mesh>
          <boxGeometry args={[0.05, 0.17, 0.17]} />
          <meshStandardMaterial color="#14100c" roughness={0.7} />
        </mesh>
        <Html center position={[0.045, 0, 0]} distanceFactor={6} zIndexRange={[15, 0]}>
          <div
            className="pointer-events-none select-none whitespace-nowrap font-mono"
            style={{ fontSize: "13px", color: "#ffb347", textShadow: "0 0 14px rgba(255,179,71,0.9)" }}
          >
            10:30 PM
          </div>
        </Html>
      </group>
    </group>
  );
}

const NOTE_BLOGS = [
  "Building Camptel AI",
  "Google Cloud Notes",
  "Firebase Tips",
  "Next.js Tricks",
  "Three.js Guide",
  "React Performance",
  "System Design",
  "Docker",
  "Kubernetes",
  "AI Notes",
  "Clean Code",
];

const NOTE_COLORS = [
  "#ffd166",
  "#ff6b6b",
  "#4dd0e1",
  "#a78bfa",
  "#7bed9f",
  "#7dd3fc",
  "#ff9f43",
  "#f8f5d4",
  "#b8e0d2",
  "#fda4ba",
  "#c8e6c9",
];

function StickyNotes() {
  const positions: [number, number][] = [
    [-4.68, 3.32],
    [-5.12, 3.32],
    [-4.68, 2.82],
    [-5.12, 2.82],
    [-4.68, 2.32],
    [-5.12, 2.32],
    [-4.68, 1.82],
    [-5.12, 1.82],
    [-4.68, 1.32],
    [-5.12, 1.32],
    [-4.68, 0.82],
  ];
  return (
    <group>
      {NOTE_BLOGS.map((title, i) => (
        <StickyNote
          key={title}
          title={title}
          color={NOTE_COLORS[i]}
          position={[-4.96, positions[i][1], positions[i][0]]}
          rotation={((i % 3) - 1) * 0.06}
        />
      ))}
    </group>
  );
}

function StickyNote({
  title,
  color,
  position,
  rotation,
}: {
  title: string;
  color: string;
  position: [number, number, number];
  rotation: number;
}) {
  const [hovered, setHovered] = useState(false);
  const openDevice = useWorkspace((s) => s.openDevice);

  return (
    <Html position={position} distanceFactor={1.35} zIndexRange={[20, 0]}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          openDevice("laptop", "blog");
        }}
        className="select-none cursor-pointer"
        style={{ width: 92, height: 92, transform: `rotate(${rotation}rad)`, zIndex: hovered ? 40 : 10 }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded-[3px] p-1.5 text-center transition-transform duration-200"
          style={{
            background: color,
            transform: hovered ? "scale(1.14) rotate(0deg)" : "scale(1)",
            boxShadow: hovered
              ? `0 10px 30px rgba(0,0,0,0.55), 0 0 24px ${color}66`
              : "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="font-bold leading-tight text-black/85" style={{ fontSize: 8.5 }}>
            {title}
          </div>
          <div className="mt-1 font-mono tracking-[0.2em] text-black/45" style={{ fontSize: 6 }}>
            BLOG
          </div>
        </div>
        {hovered && (
          <div className="pointer-events-none absolute -left-3 top-full mt-2 w-44 rounded-md border border-[#ffd700]/30 bg-black/90 p-2 backdrop-blur">
            <div className="font-mono text-[8px] tracking-[0.2em] text-[#ffd700]">BLOG POST</div>
            <div className="mt-1 text-[9.5px] font-semibold text-white">{title}</div>
            <div className="mt-1 font-mono text-[7px] leading-relaxed text-[#8f8c99]">
              CLICK TO OPEN ON THE LAPTOP →
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}

function CertsWall() {
  const certs = certifications.slice(0, 2);
  return (
    <group>
      {certs.map((c, i) => (
        <Html
          key={c.id ?? i}
          position={[4.94, 2.35 + i * 0.85, -3.4 - i * 2.4]}
          distanceFactor={1.7}
          zIndexRange={[15, 0]}
        >
          <div className="flex h-[54px] w-[168px] flex-col items-center justify-center rounded-sm border border-[#ffd700]/45 bg-black/75 px-2 shadow-[0_0_24px_rgba(255,215,0,0.12)] backdrop-blur">
            <div className="font-mono tracking-[0.3em] text-[#7dd3fc]" style={{ fontSize: 6.5 }}>
              CERTIFICATE
            </div>
            <div className="mt-0.5 truncate font-bold text-white" style={{ fontSize: 9 }}>
              {c.title}
            </div>
            <div className="truncate font-mono text-[#8f8c99]" style={{ fontSize: 6.5 }}>
              {c.issuer} · {c.issued}
            </div>
          </div>
        </Html>
      ))}
      <mesh position={[4.97, 2.7, -2.5]}>
        <boxGeometry args={[0.02, 3, 0.02]} />
        <meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={1.8} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Window() {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (leftRef.current) leftRef.current.rotation.z = Math.sin(t * 0.35) * 0.02;
    if (rightRef.current) rightRef.current.rotation.z = -Math.sin(t * 0.3 + 1.1) * 0.02;
  });

  const frameMat = <meshStandardMaterial color="#0a0a0e" roughness={0.35} metalness={0.8} />;

  return (
    <group>
      <mesh position={[-4.0, 1.6, -8.98]}>
        <planeGeometry args={[1.2, 2.1]} />
        <meshBasicMaterial map={cityNightTexture()} toneMapped={false} />
      </mesh>
      <mesh position={[-4.0, 1.6, -8.91]}>
        <planeGeometry args={[1.2, 2.1]} />
        <meshStandardMaterial
          color="#9db4d8"
          transparent
          opacity={0.26}
          roughness={0.08}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[-4.63, 1.6, -8.95]}>
        <boxGeometry args={[0.06, 2.16, 0.06]} />
        {frameMat}
      </mesh>
      <mesh position={[-3.37, 1.6, -8.95]}>
        <boxGeometry args={[0.06, 2.16, 0.06]} />
        {frameMat}
      </mesh>
      <mesh position={[-4.0, 2.68, -8.95]}>
        <boxGeometry args={[1.32, 0.06, 0.06]} />
        {frameMat}
      </mesh>
      <mesh position={[-4.0, 0.52, -8.95]}>
        <boxGeometry args={[1.32, 0.06, 0.06]} />
        {frameMat}
      </mesh>
      <mesh position={[-4.0, 1.6, -8.94]}>
        <boxGeometry args={[0.04, 2.0, 0.04]} />
        {frameMat}
      </mesh>
      <mesh position={[-4.0, 0.44, -8.9]}>
        <boxGeometry args={[1.45, 0.05, 0.3]} />
        {frameMat}
      </mesh>

      <mesh ref={leftRef} position={[-4.55, 1.6, -8.88]} castShadow>
        <boxGeometry args={[0.42, 2.15, 0.03]} />
        <meshStandardMaterial map={fabricTexture("#23232b")} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh ref={rightRef} position={[-3.45, 1.6, -8.88]} castShadow>
        <boxGeometry args={[0.42, 2.15, 0.03]} />
        <meshStandardMaterial map={fabricTexture("#23232b")} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[-4.0, 2.74, -8.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 1.5, 10]} />
        <meshStandardMaterial color="#1c1c22" roughness={0.4} metalness={0.7} />
      </mesh>

      <pointLight position={[0, 2.3, -8.35]} intensity={0.45} distance={7} decay={2} color="#8fa8ff" />
    </group>
  );
}

function Keyboard() {
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.elapsedTime;
    if (reducedMotion) {
      glowRef.current.emissiveIntensity = 0.6;
      return;
    }
    glowRef.current.color.setHSL((t * 0.1) % 1, 0.85, 0.55);
    glowRef.current.emissiveIntensity = 0.7 + Math.sin(t * 2.4) * 0.5;
  });

  return (
    <group position={[0, 0.835, -6.85]}>
      <mesh castShadow>
        <boxGeometry args={[0.36, 0.018, 0.12]} />
        <meshStandardMaterial color="#121216" roughness={0.6} />
      </mesh>
      {[-0.03, 0, 0.03].map((z, i) => (
        <mesh key={i} position={[0, 0.016 + i * 0.004, z]}>
          <boxGeometry args={[0.32, 0.012, 0.032]} />
          <meshStandardMaterial color="#1c1c22" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, -0.004, 0]}>
        <boxGeometry args={[0.3, 0.004, 0.1]} />
        <meshStandardMaterial ref={glowRef} color="#7df0ff" emissive="#7df0ff" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function BreathingDot() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);

  useFrame((state) => {
    if (!matRef.current) return;
    const t = state.clock.elapsedTime;
    if (reducedMotion) {
      matRef.current.emissiveIntensity = 1.2;
      return;
    }
    matRef.current.color.setHSL((t * 0.12) % 1, 0.9, 0.55);
    matRef.current.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.7;
  });

  return (
    <mesh position={[0, 0.02, 0.005]}>
      <sphereGeometry args={[0.008, 8, 8]} />
      <meshStandardMaterial ref={matRef} color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.5} />
    </mesh>
  );
}
