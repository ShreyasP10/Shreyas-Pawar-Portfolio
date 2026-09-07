"use client";

import { useLayoutEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Motion values for coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Snappy follow - high stiffness, low mass = minimal lag
  const springConfig = { damping: 22, stiffness: 900, mass: 0.12, restDelta: 0.001 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useLayoutEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTouch(true);
      return;
    }

    let raf = 0;
    let lastX = -100;
    let lastY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX - 16;
      lastY = e.clientY - 16;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        cursorX.set(lastX);
        cursorY.set(lastY);
      });
      setIsVisible(true);
      const target = e.target as HTMLElement;
      const isClickable = !!target.closest("a, button, [role='button'], input, textarea, select, .neo-raised, .neo-pressed");
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          body, a, button, input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 rounded-full border border-accent mix-blend-difference will-change-transform"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isPointer ? "rgba(255, 215, 0, 0.12)" : "rgba(255, 215, 0, 0)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 18, mass: 0.15 }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          animate={{ scale: isPointer ? 0 : 1 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        />
      </motion.div>
    </>
  );
}
