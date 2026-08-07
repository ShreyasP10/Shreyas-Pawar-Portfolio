"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { useFetch } from "@/lib/useFetch";
import { roles, stats } from "@/lib/data";
import { CountUp } from "./CountUp";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

export function Hero() {
  const { data: profile } = useFetch<Profile>("/api/profile");
  const { data: githubStats } = useFetch<{ followers: number }>(
    "/api/github-stats"
  );
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((index) => (index + 1) % roles.length);
      }, 200);
    } else {
      timeout = setTimeout(
        () => {
          setText(word.slice(0, text.length + (deleting ? -1 : 1)));
        },
        deleting ? 35 : 80
      );
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 30% 20%, rgba(255,215,0,0.07), transparent 70%), radial-gradient(ellipse 50% 40% at 75% 60%, rgba(255,215,0,0.04), transparent 70%)",
        }}
      />

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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Shreyas Pawar
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 flex min-h-10 items-center gap-3"
        >
          <span className="font-mono text-lg text-accent sm:text-2xl">
            &gt;_
          </span>
          <span className="h-8 overflow-hidden font-mono text-lg font-semibold text-accent sm:h-9 sm:text-2xl">
            {text}
            <span className="caret-blink" aria-hidden="true">
              |
            </span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Data Science &amp; DSA. I build ML and mobile solutions for real-world
          use cases — from encrypted chat platforms and satellite-imagery AI
          prototypes to campus intelligence systems and crop disease detection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="rounded-xl border-2 border-accent bg-accent px-5 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,215,0,0.25)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-xl border-2 border-accent px-5 py-2.5 text-sm font-bold text-accent transition-all hover:-translate-y-0.5 hover:bg-accent/10"
          >
            Get in Touch
          </a>
          <div className="flex items-center gap-2">
            {[
              {
                key: "github",
                label: "GitHub",
                Icon: GitHubIcon,
              },
              {
                key: "linkedin",
                label: "LinkedIn",
                Icon: LinkedInIcon,
              },
            ].map(({ key, label, Icon }) => (
              <a
                key={key}
                href={profile?.socialLinks?.[key as "github" | "linkedin"]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
            <a
              href={`mailto:${profile?.email ?? ""}`}
              aria-label="Email"
              title="Email"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <MailIcon className="h-4.5 w-4.5" />
            </a>
          </div>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-bold text-accent">
                <CountUp
                  value={
                    stat.label === "GitHub Followers"
                      ? githubStats?.followers ?? stat.value
                      : stat.value
                  }
                  suffix={stat.suffix}
                />
              </dd>
              <dd className="mt-1 text-xs text-muted sm:text-sm">
                {stat.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
