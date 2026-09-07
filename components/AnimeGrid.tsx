"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function AnimeGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = 32;
  const rows = 18;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll(".grid-cell");

    // Initial subtle stagger in
    animate(cells, {
      opacity: [0, 0.12],
      scale: [0, 1],
      delay: stagger(8, { grid: [cols, rows], from: "center" }),
      duration: 600,
      ease: "outCubic",
    });

    const onPointerMove = (e: PointerEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * cols;
      const y = ((e.clientY - rect.top) / rect.height) * rows;
      const idx = Math.floor(y) * cols + Math.floor(x);

      (animate as unknown as (a: unknown, b: unknown) => unknown)(cells, {
        scale: (el: Element, i: number) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const dist = Math.hypot(col - x, row - y);
          return dist < 6 ? 1.6 - dist * 0.12 : 1;
        },
        opacity: (el: Element, i: number) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const dist = Math.hypot(col - x, row - y);
          return dist < 6 ? 0.9 - dist * 0.1 : 0.12;
        },
        backgroundColor: (el: Element, i: number) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const dist = Math.hypot(col - x, row - y);
          return dist < 3 ? "#ffd700" : "rgba(255,255,255,0.18)";
        },
        duration: 400,
        ease: "outCubic",
        delay: stagger(20, { grid: [cols, rows], from: idx }),
      });
    };

    const onLeave = () => {
      animate(cells, {
        scale: 1,
        opacity: 0.12,
        backgroundColor: "rgba(255,255,255,0.18)",
        duration: 700,
        ease: "outCubic",
        delay: stagger(10, { grid: [cols, rows], from: "center" }),
      });
    };

    grid.addEventListener("pointermove", onPointerMove);
    grid.addEventListener("pointerleave", onLeave);

    // Auto pulse like animejs.com
    const pulse = animate(cells, {
      scale: [1, 1.08, 1],
      opacity: [0.12, 0.18, 0.12],
      delay: stagger(30, { grid: [cols, rows], from: "center" }),
      duration: 1400,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    return () => {
      grid.removeEventListener("pointermove", onPointerMove);
      grid.removeEventListener("pointerleave", onLeave);
      try {
        (pulse as unknown as { pause: () => void }).pause();
      } catch {}
    };
  }, []);

  return (
    <div
      ref={gridRef}
      aria-hidden
      className="pointer-events-auto absolute inset-0 grid opacity-40"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "6px",
        padding: "12px",
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div
          key={i}
          className="grid-cell h-1.5 w-1.5 justify-self-center self-center rounded-[2px] bg-white/20 sm:h-2 sm:w-2"
          style={{ opacity: 0 }}
        />
      ))}
    </div>
  );
}
