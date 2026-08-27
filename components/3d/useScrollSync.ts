"use client";

import { useEffect, useRef } from "react";
import { useWorkspace, type NavTarget } from "./store";

const SECTION_TO_TARGET: Record<string, NavTarget> = {
  hero: "door",
  about: "entry",
  projects: "laptop",
  experience: "tv",
  skills: "tablet",
  journey: "phone",
  openSource: "overview",
  contact: "wall",
};

export function useScrollSync() {
  const go = useWorkspace((s) => s.go);
  const target = useWorkspace((s) => s.target);
  const isMoving = useWorkspace((s) => s.isMoving);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const currentTargetRef = useRef(target);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    currentTargetRef.current = target;
  }, [target]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isSyncingRef.current || isMoving) return;

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const sectionId = entry.target.id;
            const syncTarget = SECTION_TO_TARGET[sectionId];
            if (syncTarget && syncTarget !== currentTargetRef.current) {
              isSyncingRef.current = true;
              go(syncTarget);
              setTimeout(() => {
                isSyncingRef.current = false;
              }, 800);
            }
            break;
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.4, 0.6, 0.75, 1],
      }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [go, isMoving]);

  return null;
}