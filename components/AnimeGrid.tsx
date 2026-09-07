"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function AnimeGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = 20;
  const rows = 12;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll(".grid-cell");

    // Initial stagger in - GPU friendly
    animate(cells, {
      opacity: [0, 0.14],
      scale: [0, 1],
      delay: stagger(12, { grid: [cols, rows], from: "center" }),
      duration: 500,
      ease: "outCubic",
    });

    let raf = 0;
    let lastX = -1;
    let lastY = -1;

    const onPointerMove = (e: PointerEvent) => {
      lastX = ((e.clientX - grid.getBoundingClientRect().left) / grid.clientWidth) * cols;
      lastY = ((e.clientY - grid.getBoundingClientRect().top) / grid.clientHeight) * rows;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = lastX;
        const y = lastY;
        const idx = Math.floor(y) * cols + Math.floor(x);
        (animate as unknown as (a: unknown, b: unknown) => unknown)(cells, {
          scale: (el: Element, i: number) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const dist = Math.hypot(col - x, row - y);
            return dist < 4 ? 1.5 - dist * 0.14 : 1;
          },
          opacity: (el: Element, i: number) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const dist = Math.hypot(col - x, row - y);
            return dist < 4 ? 0.85 - dist * 0.12 : 0.14;
          },
          duration: 320,
          ease: "outCubic",
          delay: stagger(14, { grid: [cols, rows], from: idx }),
        });
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      animate(cells, {
        scale: 1,
        opacity: 0.14,
        duration: 600,
        ease: "outCubic",
        delay: stagger(12, { grid: [cols, rows], from: "center" }),
      });
    };

    grid.addEventListener("pointermove", onPointerMove, { passive: true });
    grid.addEventListener("pointerleave", onLeave, { passive: true });

    // Subtle auto pulse - lighter
    const pulse = animate(cells, {
      scale: [1, 1.06, 1],
      opacity: [0.14, 0.18, 0.14],
      delay: stagger(40, { grid: [cols, rows], from: "center" }),
      duration: 2200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    return () => {
      cancelAnimationFrame(raf);
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
      className="pointer-events-auto absolute inset-0 grid opacity-30 will-change-transform"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "8px",
        padding: "16px",
        transform: "translateZ(0)",
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div
          key={i}
          className="grid-cell h-2 w-2 justify-self-center self-center rounded-[2px] bg-white/20 will-change-transform"
          style={{ opacity: 0, transform: "translateZ(0)" }}
        />
      ))}
    </div>
  );
}
