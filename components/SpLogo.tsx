"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function SpLogo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const letters = el.querySelectorAll(".sp-letter");
    // V4 logo style: stagger from center, inOutQuint, loop alternate
    const anim = (animate as unknown as (a: unknown, b: unknown) => { pause: () => void })(letters, {
      y: [-4, 4],
      rotate: [-3, 3],
      scale: [1, 1.08],
      duration: 900,
      delay: stagger(80, { from: "center" }),
      ease: "inOutQuint",
      loop: true,
      alternate: true,
    } as unknown as Record<string, unknown>);

    const grid = el.querySelectorAll(".sp-dot");
    const gridAnim = (animate as unknown as (a: unknown, b: unknown) => { pause: () => void })(grid, {
      scale: [1, 1.3, 1],
      opacity: [0.25, 0.6, 0.25],
      duration: 1100,
      delay: stagger(70, { from: "center", grid: [3, 3] }),
      ease: "inOutQuint",
      loop: true,
      alternate: true,
    } as unknown as Record<string, unknown>);

    return () => {
      try {
        (anim as unknown as { pause: () => void })?.pause();
        (gridAnim as unknown as { pause: () => void })?.pause();
      } catch {}
    };
  }, []);

  const box = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-16 w-16" : "h-9 w-9";
  const text = size === "sm" ? "text-[10px]" : size === "lg" ? "text-xl" : "text-[11px]";

  return (
    <div ref={ref} className={`relative flex items-center justify-center ${className}`}>
      {/* mini grid like anime.js logo - 3x3 dots behind */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 opacity-30">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="sp-dot h-1 w-1 place-self-center rounded-[1px] bg-[#ffd700]/40" />
        ))}
      </div>
      <div className={`relative flex ${box} items-center justify-center rounded-xl bg-[#ffd700] text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]`}>
        <span className={`sp-letter inline-block font-black tracking-tight ${text}`}>S</span>
        <span className={`sp-letter inline-block font-black tracking-tight ${text}`}>P</span>
      </div>
    </div>
  );
}
