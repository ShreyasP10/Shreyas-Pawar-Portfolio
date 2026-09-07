"use client";

import { useLayoutEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function AmbientGlow() {
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Snappier follow
  const smoothX = useSpring(mouseX, { damping: 32, stiffness: 420, mass: 0.12 });
  const smoothY = useSpring(mouseY, { damping: 32, stiffness: 420, mass: 0.12 });

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    let raf = 0;
    let lx = window.innerWidth / 2;
    let ly = window.innerHeight / 2;
    const handleMouseMove = (e: MouseEvent) => {
      lx = e.clientX;
      ly = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        mouseX.set(lx);
        mouseY.set(ly);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 opacity-25 will-change-transform"
      style={{
        background: `radial-gradient(520px circle at ${smoothX}px ${smoothY}px, rgba(255,215,0,0.06), transparent 75%)`,
        transform: "translateZ(0)",
      }}
    />
  );
}
