"use client";

import { useEffect } from "react";
import { animate, onScroll, stagger } from "animejs";

export function AnimeRevealProvider() {
  useEffect(() => {
    // Animate sections like animejs.com scroll demos
    // Targets [data-anime] if present, otherwise all main sections
    let els = document.querySelectorAll<HTMLElement>("[data-anime]");
    if (!els.length) {
      els = document.querySelectorAll<HTMLElement>("main section[id]");
    }
    if (!els.length) return;

    // Use anime's onScroll helper if available, fallback to IntersectionObserver
    try {
      if (typeof onScroll === "function") {
        els.forEach((el) => {
          const type = el.dataset.anime || "fade";
          if (type === "stagger") {
            const children = el.querySelectorAll<HTMLElement>("[data-anime-child]");
            if (children.length) {
              animate(children, {
                y: [24, 0],
                opacity: [0, 1],
                duration: 600,
                delay: stagger(60),
                ease: "outCubic",
                autoplay: onScroll({
                  container: el,
                  enter: "bottom top",
                  leave: "top bottom",
                }) as unknown as boolean,
              });
            }
          } else {
            animate(el, {
              y: [16, 0],
              opacity: [0, 1],
              duration: 700,
              ease: "outCubic",
              autoplay: onScroll({
                container: el,
                enter: "bottom top+= -80",
                leave: "top bottom",
              }) as unknown as boolean,
            });
          }
        });
        return;
      }
    } catch {}

    // Fallback IntersectionObserver
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const type = el.dataset.anime;
            if (type === "stagger") {
              const children = el.querySelectorAll<HTMLElement>("[data-anime-child]");
              animate(children, {
                y: [16, 0],
                opacity: [0, 1],
                duration: 500,
                delay: stagger(50),
                ease: "outCubic",
              });
            } else {
              animate(el, {
                y: [16, 0],
                opacity: [0, 1],
                duration: 600,
                ease: "outCubic",
              });
            }
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
