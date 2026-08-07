"use client";

import { create } from "zustand";
import { playTone } from "./sound";

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

export type LaptopTab =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "achievements"
  | "education"
  | "open-source"
  | "blog"
  | "contact";

export type TabletTab =
  | "experience"
  | "education"
  | "certifications"
  | "journey"
  | "research";

export type TvTab =
  | "showcase"
  | "projects"
  | "experience"
  | "skills"
  | "open-source"
  | "certs"
  | "contact";

interface WorkspaceState {
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
  go: (target: NavTarget) => void;
  openDoor: () => void;
  navigateTab: (device: DeviceId, tab: LaptopTab | TabletTab | TvTab) => void;
  openDevice: (device: DeviceId, tab?: LaptopTab | TabletTab | TvTab) => void;
  closePanels: () => void;
  setTvFullscreen: (value: boolean) => void;
  setFreeCam: (value: boolean) => void;
  setSound: (value: boolean) => void;
  setParticles: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setSettingsOpen: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  noteInteraction: () => void;
}

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  target: "door",
  activeDevice: null,
  laptopTab: "home",
  tabletTab: "experience",
  tvTab: "projects",
  tvFullscreen: false,
  freeCam: false,
  soundOn: true,
  particlesOn: true,
  reducedMotion: false,
  settingsOpen: false,
  loading: true,
  lastInteraction: Date.now(),
  doorOpen: false,

  go: (target) => {
    if (get().soundOn) playTone(520, 0.04);
    set({ target, activeDevice: null, settingsOpen: false, lastInteraction: Date.now(), freeCam: false });
  },

  openDoor: () => {
    if (get().soundOn) playTone(420, 0.3);
    set({ doorOpen: true });
  },

  navigateTab: (device, tab) => {
    if (get().soundOn) playTone(600, 0.035);
    set((state) => ({
      lastInteraction: Date.now(),
      laptopTab: device === "laptop" ? (tab as LaptopTab) : state.laptopTab,
      tabletTab: device === "tablet" ? (tab as TabletTab) : state.tabletTab,
      tvTab: device === "tv" ? (tab as TvTab) : state.tvTab,
    }));
  },

  openDevice: (device, tab) => {
    if (get().soundOn) playTone(680, 0.05);
    set((state) => ({
      target: device,
      activeDevice: device,
      settingsOpen: false,
      lastInteraction: Date.now(),
      freeCam: false,
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
}));
