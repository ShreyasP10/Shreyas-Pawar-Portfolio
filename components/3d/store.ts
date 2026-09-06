"use client";

import { create } from "zustand";
import { playTone, playPositionalTone, DEVICE_SOUND_POS } from "./sound";

export type NavTarget =
  | "door"
  | "entry"
  | "wall"
  | "laptop"
  | "tablet"
  | "phone"
  | "tv"
  | "overview";

export type DeviceId = "laptop" | "tablet" | "phone" | "tv";

export type LaptopTab = "home" | "skills" | "certifications";

export type TabletTab = "projects" | "journey";

export type TvTab = "hackathons" | "achievements" | "experience" | "open-source" | "certs";

interface CameraState {
  targetCameraPosition: [number, number, number];
  targetLookAt: [number, number, number];
  setTargetPosition: (pos: [number, number, number]) => void;
  setTargetLookAt: (look: [number, number, number]) => void;
}

export const POS: Record<NavTarget, [number, number, number]> = {
  door: [3.6, 1.45, 2.4],
  entry: [1.6, 1.35, -0.6],
  wall: [0, 2.6, -2.2],
  overview: [0, 3.4, 1.0],
  laptop: [0, 1.55, -5.2],
  tablet: [0.95, 1.45, -5.0],
  phone: [-0.95, 1.35, -5.2],
  tv: [1.4, 1.95, -0.8],
};

export const LOOK: Record<NavTarget, [number, number, number]> = {
  door: [3.6, 1.45, 0.4],
  entry: [0, 1.05, -5.8],
  wall: [0, 1.85, -8.9],
  overview: [0, 0.9, -4.2],
  laptop: [0, 1.05, -6.95],
  tablet: [0.95, 1.02, -6.9],
  phone: [-0.95, 1.0, -6.95],
  tv: [4.85, 1.85, -4.5],
};

export const useCameraStore = create<CameraState>((set) => ({
  targetCameraPosition: POS.door,
  targetLookAt: LOOK.door,
  setTargetPosition: (pos) => set({ targetCameraPosition: pos }),
  setTargetLookAt: (look) => set({ targetLookAt: look }),
}));

interface UIState {
  target: NavTarget;
  activeDevice: DeviceId | null;
  laptopTab: LaptopTab;
  tabletTab: TabletTab;
  tvTab: TvTab;
  tvFullscreen: boolean;
  freeCam: boolean;
  soundOn: boolean;
  particlesOn: boolean;
  reducedMotion: boolean;
  settingsOpen: boolean;
  loading: boolean;
  lastInteraction: number;
  doorOpen: boolean;
  isMoving: boolean;
  targetCameraPosition: [number, number, number];
  targetLookAt: [number, number, number];
  go: (target: NavTarget) => void;
  openDoor: () => void;
  closeDoor: () => void;
  navigateTab: (device: DeviceId, tab: LaptopTab | TabletTab | TvTab) => void;
  openDevice: (device: DeviceId, tab?: LaptopTab | TabletTab | TvTab) => void;
  closePanels: () => void;
  setTvFullscreen: (value: boolean) => void;
  setFreeCam: (value: boolean) => void;
  toggleFreeCam: () => void;
  setSound: (value: boolean) => void;
  setParticles: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setSettingsOpen: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  noteInteraction: () => void;
  setIsMoving: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  target: "door",
  activeDevice: null,
  laptopTab: "home",
  tabletTab: "projects",
  tvTab: "hackathons",
  tvFullscreen: false,
  freeCam: false,
  soundOn: true,
  particlesOn: true,
  reducedMotion: false,
  settingsOpen: false,
  loading: true,
  lastInteraction: 0,
  doorOpen: false,
  isMoving: false,
  targetCameraPosition: POS.door,
  targetLookAt: LOOK.door,

  go: (target) => {
    if (get().isMoving && !get().reducedMotion) return;
    if (get().soundOn) playTone(520, 0.04);
    set({
      target,
      activeDevice: null,
      tvFullscreen: false,
      settingsOpen: false,
      lastInteraction: Date.now(),
      freeCam: false,
      isMoving: true,
      targetCameraPosition: POS[target],
      targetLookAt: LOOK[target],
    });
  },

  openDoor: () => {
    if (get().soundOn) playTone(420, 0.3);
    set({ doorOpen: true });
  },

  closeDoor: () => {
    if (get().soundOn) playTone(300, 0.22);
    set({ doorOpen: false });
  },

  navigateTab: (device, tab) => {
    if (get().soundOn) playPositionalTone(600, 0.035, 0.025, DEVICE_SOUND_POS[device]);
    set((state) => ({
      lastInteraction: Date.now(),
      laptopTab: device === "laptop" ? (tab as LaptopTab) : state.laptopTab,
      tabletTab: device === "tablet" ? (tab as TabletTab) : state.tabletTab,
      tvTab: device === "tv" ? (tab as TvTab) : state.tvTab,
    }));
  },

  openDevice: (device, tab) => {
    if (get().isMoving && !get().reducedMotion) return;
    if (get().soundOn) playPositionalTone(680, 0.05, 0.035, DEVICE_SOUND_POS[device]);
    const target = device as NavTarget;
    set((state) => ({
      target,
      activeDevice: device,
      settingsOpen: false,
      lastInteraction: Date.now(),
      freeCam: false,
      targetCameraPosition: POS[target] || state.targetCameraPosition,
      targetLookAt: LOOK[target] || state.targetLookAt,
      laptopTab: device === "laptop" && tab ? (tab as LaptopTab) : state.laptopTab,
      tabletTab: device === "tablet" && tab ? (tab as TabletTab) : state.tabletTab,
      tvTab: device === "tv" && tab ? (tab as TvTab) : state.tvTab,
    }));
  },

  closePanels: () => {
    if (get().soundOn) playTone(420, 0.03);
    set({ activeDevice: null, settingsOpen: false, lastInteraction: Date.now(), tvFullscreen: false });
  },

  setTvFullscreen: (value) => {
    if (get().soundOn) playTone(520, 0.04);
    set({ tvFullscreen: value, lastInteraction: Date.now() });
  },

  setFreeCam: (value) => set({ freeCam: value }),
  toggleFreeCam: () => set((state) => ({ freeCam: !state.freeCam })),

  setSound: (value) => {
    if (value) playTone(880, 0.04);
    set({ soundOn: value });
  },

  setParticles: (value) => set({ particlesOn: value }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setSettingsOpen: (value) => {
    if (value && get().soundOn) playTone(640, 0.04);
    set({ settingsOpen: value, lastInteraction: Date.now() });
  },
  setLoading: (value) => set({ loading: value }),
  noteInteraction: () => set({ lastInteraction: Date.now() }),
  setIsMoving: (value) => set({ isMoving: value }),
}));