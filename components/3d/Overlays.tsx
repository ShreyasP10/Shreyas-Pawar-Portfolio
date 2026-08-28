"use client";

import { useEffect } from "react";
import { useUIStore } from "./store";
import { SEQUENCE } from "./nav";
import { TvScreen } from "./Screens";

const VIEW_LABELS: Record<string, string> = {
  door: "DOOR",
  entry: "DESK",
  wall: "WALL",
  overview: "OVERVIEW",
  laptop: "LAPTOP",
  tablet: "TABLET",
  phone: "PHONE",
  tv: "TV",
};

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-[#ffd700]/40"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-[#c9c6d0]">{label}</span>
      <span
        className={`relative h-4 w-8 rounded-full transition-colors ${
          checked ? "bg-[#ffd700]" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-black transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function LoadingScreen() {
  const loading = useUIStore((s) => s.loading);

  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-700 ${
        loading ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ffd700]/30 bg-[#ffd700]/5">
        <span className="animate-pulse text-xl font-black text-[#ffd700]">SP</span>
      </div>
      <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="animate-loader h-full w-1/2 rounded-full bg-[#ffd700]" />
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-[0.35em] text-[#8f8c99]">
        LOADING WORKSPACE…
      </div>
    </div>
  );
}

export function LandingOverlay() {
  const target = useUIStore((s) => s.target);
  const loading = useUIStore((s) => s.loading);
  const go = useUIStore((s) => s.go);
  const openDoor = useUIStore((s) => s.openDoor);

  const visible = (target === "door" || target === "entry") && !loading;
  const atDoor = target === "door";

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[55] flex flex-col items-center justify-end pb-[14vh] transition-all duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="px-6 text-center">
        <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-white/60">
          {atDoor ? "SHREYAS PAWAR" : "WELCOME IN"}
        </p>
        <h2 className="mb-6 text-2xl font-black tracking-tighter text-white sm:text-3xl">
          {atDoor ? "Step inside the workspace" : "Take a look around"}
        </h2>
        {atDoor ? (
          <button
            onClick={() => {
              openDoor();
              go("entry");
            }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#ffd700] px-7 py-3 font-mono text-[11px] font-bold tracking-[0.25em] text-black transition-all hover:bg-[#ffdf33] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
          >
            ENTER <span>→</span>
          </button>
        ) : (
          <button
            onClick={() => go("overview")}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-mono text-[11px] font-bold tracking-[0.25em] text-black transition-all hover:bg-zinc-100"
          >
            EXPLORE <span>→</span>
          </button>
        )}
        <p className="mt-4 font-mono text-[9px] tracking-[0.2em] text-white/40">Scroll • Click • Drag</p>
      </div>
    </div>
  );
}

export function HUD() {
  const target = useUIStore((s) => s.target);
  const loading = useUIStore((s) => s.loading);
  const freeCam = useUIStore((s) => s.freeCam);

  if (loading) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[50] flex items-center justify-between px-4 py-3 sm:px-5">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-white px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-black">
          {VIEW_LABELS[target] ?? target.toUpperCase()}
        </span>
        {freeCam && (
          <span className="hidden sm:inline-flex rounded-full bg-[#ffd700] px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.2em] text-black">
            FREE CAM
          </span>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-2 text-[9px] tracking-[0.2em] text-white/40">
        <span>SP</span>
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span>{freeCam ? "DRAG TO LOOK • F TO EXIT" : "F • FREE LOOK"}</span>
      </div>
    </div>
  );
}

export function HelpBar() {
  const activeDevice = useUIStore((s) => s.activeDevice);
  const loading = useUIStore((s) => s.loading);

  if (loading) return null;

  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-[50] flex -translate-x-1/2 items-center gap-2">
      <span className="hidden sm:inline-flex rounded-full bg-black/60 px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-white/60 backdrop-blur">
        {activeDevice ? "ESC to close" : "Scroll • Click devices • Drag"}
      </span>
      <span className="sm:hidden rounded-full bg-black/60 px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-white/60 backdrop-blur">
        {activeDevice ? "Tap ESC" : "Swipe • Tap"}
      </span>
    </div>
  );
}

export function QuickNav() {
  const target = useUIStore((s) => s.target);
  const loading = useUIStore((s) => s.loading);
  const go = useUIStore((s) => s.go);
  const openDevice = useUIStore((s) => s.openDevice);

  const activeDevice = useUIStore((s) => s.activeDevice);

  if (loading || activeDevice !== null) return null;

  const stations: { id: "door" | "entry" | "overview" | "laptop" | "tablet" | "phone" | "tv"; label: string }[] = [
    { id: "door", label: "DOOR" },
    { id: "entry", label: "ROOM" },
    { id: "overview", label: "OVERVIEW" },
    { id: "laptop", label: "LAPTOP" },
    { id: "tablet", label: "TABLET" },
    { id: "phone", label: "PHONE" },
    { id: "tv", label: "TV" },
  ];

  // Simplified mobile-only nav - desktop uses Sidebar
  return (
    <div className="fixed bottom-3 left-1/2 z-[50] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/80 p-1 backdrop-blur-xl sm:hidden">
      {stations.slice(2).map((s) => {
        const isActive = target === s.id;
        return (
          <button
            key={s.id}
            onClick={() => {
              if (s.id === "door" || s.id === "entry" || s.id === "overview") {
                go(s.id);
              } else {
                openDevice(s.id);
              }
            }}
            className={`rounded-full px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] transition-all ${
              isActive ? "bg-white text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export function ScrollRail() {
  const target = useUIStore((s) => s.target);
  const loading = useUIStore((s) => s.loading);
  const index = SEQUENCE.indexOf(target);

  if (loading) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-[50] hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
      {SEQUENCE.map((id, i) => (
        <div
          key={id}
          className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
            i === index
              ? "h-5 w-1.5 bg-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.8)]"
              : i < index
                ? "bg-[#ffd700]/40"
                : "bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}

export function SettingsModal() {
  const open = useUIStore((s) => s.settingsOpen);
  const soundOn = useUIStore((s) => s.soundOn);
  const particlesOn = useUIStore((s) => s.particlesOn);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const setSound = useUIStore((s) => s.setSound);
  const setParticles = useUIStore((s) => s.setParticles);
  const setReducedMotion = useUIStore((s) => s.setReducedMotion);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReducedMotion]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setSettingsOpen(false)}
    >
      <div
        className="w-72 rounded-2xl border border-white/10 bg-[#101015]/95 p-4 shadow-[0_0_60px_rgba(255,215,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#ffd700]">SETTINGS</span>
          <button
            onClick={() => setSettingsOpen(false)}
            className="text-[#8f8c99] hover:text-white"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          <Toggle label="SOUND" checked={soundOn} onChange={setSound} />
          <Toggle label="GOLD DUST" checked={particlesOn} onChange={setParticles} />
          <Toggle label="REDUCED MOTION" checked={reducedMotion} onChange={setReducedMotion} />
        </div>
        <p className="mt-3 text-center font-mono text-[8px] leading-relaxed tracking-wide text-[#5f5c69]">
          CAMERA DRIFT, DUST & AMBIENT TONES
          <br />
          ARE TUNED FOR 60FPS
        </p>
      </div>
    </div>
  );
}

export function TvFullscreenOverlay() {
  const tvFullscreen = useUIStore((s) => s.tvFullscreen);
  const setTvFullscreen = useUIStore((s) => s.setTvFullscreen);

  if (!tvFullscreen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={() => setTvFullscreen(false)}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#7dd3fc]">PRESS ESC OR CLICK TO EXIT</span>
        <button
          onClick={() => setTvFullscreen(false)}
          className="rounded-full bg-white/10 p-2 text-[#ffd700] transition-colors hover:bg-white/20"
          aria-label="Exit fullscreen"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div onClick={(e) => e.stopPropagation()} style={{ transform: "scale(1.8)" }} className="shadow-2xl">
        <TvScreen fullscreen />
      </div>
    </div>
  );
}
