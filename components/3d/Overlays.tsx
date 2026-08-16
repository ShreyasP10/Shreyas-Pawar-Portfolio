"use client";

import { useEffect } from "react";
import { useWorkspace } from "./store";
import { SEQUENCE } from "./nav";
import { TvScreen } from "./Screens";

const VIEW_LABELS: Record<string, string> = {
  door: "DOOR — ENTRY POINT",
  entry: "ROOM ENTRY — THE DESK",
  wall: "WALL — LANDING",
  overview: "OVERVIEW — THE WORKSPACE",
  laptop: "LAPTOP — PRIMARY HUB",
  tablet: "TABLET — EXPERIENCE DASHBOARD",
  phone: "PHONE — CONTACT",
  tv: "TV — SHOWCASE",
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
  const loading = useWorkspace((s) => s.loading);

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
  const target = useWorkspace((s) => s.target);
  const loading = useWorkspace((s) => s.loading);
  const go = useWorkspace((s) => s.go);
  const openDoor = useWorkspace((s) => s.openDoor);
  const soundOn = useWorkspace((s) => s.soundOn);

  const visible = (target === "door" || target === "entry") && !loading;
  const atDoor = target === "door";

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[55] flex flex-col items-center justify-end pb-[16vh] transition-all duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="px-6 text-center">
        <div
          className="mb-5 font-mono tracking-[0.45em] text-[#7dd3fc]"
          style={{ fontSize: "11px", textShadow: "0 0 18px rgba(125,211,252,0.7)" }}
        >
          {atDoor ? "SHREYAS PAWAR — SOFTWARE STUDIO" : "YOU'VE ENTERED THE WORKSPACE — TAKE A SEAT"}
        </div>
        {atDoor ? (
          <button
            onClick={() => {
              openDoor();
              go("entry");
            }}
            className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-[#ffd700] bg-[#ffd700]/10 px-8 py-3 font-mono text-[12px] tracking-[0.3em] text-[#ffd700] transition-all hover:bg-[#ffd700] hover:text-black hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]"
          >
            OPEN THE DOOR
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        ) : (
          <button
            onClick={() => go("wall")}
            className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-[#ffd700] bg-[#ffd700]/10 px-8 py-3 font-mono text-[12px] tracking-[0.3em] text-[#ffd700] transition-all hover:bg-[#ffd700] hover:text-black hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]"
          >
            VIEW INTRODUCTION
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        )}
        <div className="mt-4 font-mono text-[9px] tracking-[0.3em] text-[#5f5c69]">
          {atDoor
            ? "THE DOOR OPENS AUTOMATICALLY — OR SCROLL TO EXPLORE"
            : soundOn
              ? "SOUND ON — CLICK DEVICES TO EXPLORE"
              : "CLICK DEVICES TO EXPLORE"}
        </div>
      </div>
    </div>
  );
}

export function HUD() {
  const target = useWorkspace((s) => s.target);
  const loading = useWorkspace((s) => s.loading);
  const freeCam = useWorkspace((s) => s.freeCam);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-[50] flex items-center justify-between px-5 py-4 transition-opacity duration-700 ${
        loading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 font-mono text-[9px] tracking-[0.3em] text-[#ffd700] backdrop-blur-xl">
        {VIEW_LABELS[target] ?? target.toUpperCase()}
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 font-mono text-[9px] tracking-[0.25em] text-[#8f8c99] backdrop-blur-xl">
          SP·3D
        </div>
        {freeCam && (
          <div className="rounded-full border border-[#ffd700]/40 bg-[#ffd700]/10 px-3 py-1.5 font-mono text-[8px] tracking-[0.2em] text-[#ffd700] backdrop-blur-xl">
            FREE LOOK (F)
          </div>
        )}
      </div>
    </div>
  );
}

export function HelpBar() {
  const activeDevice = useWorkspace((s) => s.activeDevice);
  const loading = useWorkspace((s) => s.loading);

  if (loading) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-5 z-[50] hidden items-center gap-3 xl:flex">
      <div className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#8f8c99] backdrop-blur-xl">
        SCROLL TO EXPLORE · ← → DEVICES · DRAG TO LOOK · F: FREE LOOK
      </div>
      {activeDevice && (
        <div className="rounded-full border border-[#ffd700]/40 bg-black/40 px-4 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#ffd700] backdrop-blur-xl">
          ESC TO CLOSE
        </div>
      )}
    </div>
  );
}

export function QuickNav() {
  const target = useWorkspace((s) => s.target);
  const loading = useWorkspace((s) => s.loading);
  const go = useWorkspace((s) => s.go);
  const openDevice = useWorkspace((s) => s.openDevice);

  const activeDevice = useWorkspace((s) => s.activeDevice);

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

  return (
    <div className="fixed bottom-4 left-1/2 z-[50] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/70 p-1 shadow-2xl backdrop-blur-xl">
      {stations.map((s) => {
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
            className={`rounded-full px-2.5 py-1 font-mono text-[8.5px] font-bold tracking-[0.14em] transition-all ${
              isActive
                ? "bg-[#ffd700] text-black shadow-[0_0_12px_rgba(255,215,0,0.6)]"
                : "text-[#a8a5b0] hover:bg-white/10 hover:text-white"
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
  const target = useWorkspace((s) => s.target);
  const loading = useWorkspace((s) => s.loading);
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
  const open = useWorkspace((s) => s.settingsOpen);
  const soundOn = useWorkspace((s) => s.soundOn);
  const particlesOn = useWorkspace((s) => s.particlesOn);
  const reducedMotion = useWorkspace((s) => s.reducedMotion);
  const setSound = useWorkspace((s) => s.setSound);
  const setParticles = useWorkspace((s) => s.setParticles);
  const setReducedMotion = useWorkspace((s) => s.setReducedMotion);
  const setSettingsOpen = useWorkspace((s) => s.setSettingsOpen);

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
  const tvFullscreen = useWorkspace((s) => s.tvFullscreen);
  const setTvFullscreen = useWorkspace((s) => s.setTvFullscreen);

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
