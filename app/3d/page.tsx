"use client";

import { useEffect, useRef } from "react";
import { Experience } from "@/components/3d/Experience";
import { Sidebar } from "@/components/3d/Sidebar";
import {
  HelpBar,
  HUD,
  LandingOverlay,
  LoadingScreen,
  ScrollRail,
  SettingsModal,
  QuickNav,
  TvFullscreenOverlay,
} from "@/components/3d/Overlays";
import { useUIStore, type NavTarget } from "@/components/3d/store";
import { SEQUENCE } from "@/components/3d/nav";

export default function WorkspacePage() {
  const go = useUIStore((s) => s.go);
  const openDevice = useUIStore((s) => s.openDevice);
  const closePanels = useUIStore((s) => s.closePanels);
  const toggleFreeCam = useUIStore((s) => s.toggleFreeCam);
  const target = useUIStore((s) => s.target);
  const loading = useUIStore((s) => s.loading);
  const doorOpen = useUIStore((s) => s.doorOpen);
  const openDoor = useUIStore((s) => s.openDoor);
  const setReducedMotion = useUIStore((s) => s.setReducedMotion);
  const lastNav = useRef(0);

  useEffect(() => {
    if (loading) return;
    if (doorOpen || target !== "door") return;
    const t1 = setTimeout(() => openDoor(), 1600);
    const t2 = setTimeout(() => {
      if (useUIStore.getState().target === "door") go("entry");
    }, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading, doorOpen, target, go, openDoor]);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const navigateTo = (id: NavTarget) => {
      if (id === "overview" || id === "wall" || id === "entry" || id === "door") go(id);
      else openDevice(id);
    };

    const getCurrentIndex = () => SEQUENCE.indexOf(useUIStore.getState().target);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanels();
        return;
      }
      if (e.key === "f" || e.key === "F") {
        toggleFreeCam();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const current = getCurrentIndex();
        if (current === -1) return;
        const step = e.key === "ArrowRight" ? 1 : -1;
        const next = SEQUENCE[(current + step + SEQUENCE.length) % SEQUENCE.length];
        navigateTo(next);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (useUIStore.getState().freeCam) return;
      if (Math.abs(e.deltaY) < 12) return;
      const now = Date.now();
      if (now - lastNav.current < 650) return;
      const current = getCurrentIndex();
      if (current === -1) return;
      const nextIdx = e.deltaY > 0 ? current + 1 : current - 1;
      if (nextIdx < 0 || nextIdx >= SEQUENCE.length) return;
      lastNav.current = now;
      navigateTo(SEQUENCE[nextIdx]);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (useUIStore.getState().freeCam) return;
      const delta = touchStartY - e.touches[0].clientY;
      if (Math.abs(delta) < 40) return;
      const now = Date.now();
      if (now - lastNav.current < 650) return;
      const current = getCurrentIndex();
      if (current === -1) return;
      const nextIdx = delta > 0 ? current + 1 : current - 1;
      if (nextIdx < 0 || nextIdx >= SEQUENCE.length) return;
      lastNav.current = now;
      touchStartY = e.touches[0].clientY;
      navigateTo(SEQUENCE[nextIdx]);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [closePanels, go, openDevice, setReducedMotion, toggleFreeCam]);

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <Experience />
      </div>
      <HUD />
      <Sidebar />
      <ScrollRail />
      <QuickNav />
      <HelpBar />
      <LandingOverlay />
      <SettingsModal />
      <LoadingScreen />
      <TvFullscreenOverlay />
    </div>
  );
}
