"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { animate, stagger } from "animejs";
import { useFetch } from "@/lib/useFetch";
import { stats, profile } from "@/lib/data";
import { CountUp } from "./CountUp";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { AnimeGrid } from "./AnimeGrid";

export function Hero() {
  const { data: githubStats } = useFetch<{ followers: number }>(
    "/api/github-stats"
  );
  const { data: leetcodeStats } = useFetch<{ ranking: number; solved: number }>(
    "/api/leetcode-stats"
  );

  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!nameRef.current) return;
    const letters = nameRef.current.querySelectorAll(".hero-letter span");
    // Ensure letters are visible even if anime fails - fallback after 1.2s
    const fallback = setTimeout(() => {
      letters.forEach((el) => {
        (el as HTMLElement).style.transform = "translateY(0%)";
        (el as HTMLElement).style.opacity = "1";
      });
    }, 1200);
    (animate as unknown as (a: unknown, b: unknown) => { then?: unknown })(letters, {
      y: ["110%", "0%"],
      opacity: [0, 1],
      duration: 700,
      delay: stagger(28, { from: "first" }),
      ease: "outExpo",
    });
    const sub = document.querySelectorAll(".hero-sub");
    (animate as unknown as (a: unknown, b: unknown) => unknown)(sub, {
      y: [16, 0],
      opacity: [0, 1],
      duration: 600,
      delay: stagger(60, { from: "first" }),
      ease: "outCubic",
    });
    return () => clearTimeout(fallback);
  }, []);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityParallax = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <AnimeGrid />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 30% 20%, rgba(255,215,0,0.07), transparent 70%), radial-gradient(ellipse 50% 40% at 75% 60%, rgba(255,215,0,0.04), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/60" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 font-mono text-sm font-semibold text-accent"
        >
          {"<"} Hello, I&apos;m {">"}
        </motion.p>

        <motion.h1
          ref={nameRef}
          style={{ y: yParallax, opacity: opacityParallax }}
          className="flex flex-wrap max-w-5xl text-6xl font-black leading-[0.95] tracking-tighter text-white sm:text-8xl lg:text-9xl overflow-hidden py-2"
        >
          {profile.name.split("").map((char, index) => (
            <span key={index} className={`hero-letter inline-block overflow-hidden ${char === " " ? "w-[0.3em]" : ""}`}>
              <span className="inline-block" style={{ display: "inline-block", transform: "translateY(110%)" }}>
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="hero-sub mt-5 max-w-3xl font-mono text-lg font-semibold leading-snug text-accent sm:text-2xl"
        >
          {profile.subheading}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="hero-sub mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Data Science {"&"} DSA. I build ML and mobile solutions for real-world
          use cases — from encrypted chat platforms and satellite-imagery AI
          prototypes to campus intelligence systems and crop disease detection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            className="neo-raised rounded-xl bg-panel px-6 py-3 text-sm font-bold text-accent transition-all active:neo-pressed hover:-translate-y-0.5"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="neo-inset rounded-xl bg-panel px-6 py-3 text-sm font-bold text-muted transition-all hover:text-white"
          >
            Get in Touch
          </a>

          <div className="flex items-center gap-2">
            {[
              {
                key: "github" as const,
                label: "GitHub",
                Icon: GitHubIcon,
              },
              {
                key: "linkedin" as const,
                label: "LinkedIn",
                Icon: LinkedInIcon,
              },
            ].map(({ key, label, Icon }) => (
              <a
                key={key}
                href={profile.socialLinks[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="neo-raised flex h-11 w-11 items-center justify-center rounded-xl bg-panel text-muted transition-all active:neo-pressed hover:-translate-y-0.5 hover:text-accent"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              title="Email"
              className="neo-raised flex h-11 w-11 items-center justify-center rounded-xl bg-panel text-muted transition-all active:neo-pressed hover:-translate-y-0.5 hover:text-accent"
            >
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dd className="text-3xl font-bold text-accent">
                <CountUp
                  value={
                    stat.label === "GitHub Followers"
                      ? githubStats?.followers ?? stat.value
                      : stat.label === "LeetCode Solved"
                      ? leetcodeStats?.solved ?? stat.value
                      : stat.value
                  }
                  suffix={stat.suffix}
                />
              </dd>
              <dt className="mb-1 text-xs text-muted sm:text-sm">
                {stat.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
