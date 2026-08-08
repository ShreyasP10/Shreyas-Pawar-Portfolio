"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { profile, skillGroups } from "@/lib/data";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
  message?: string;
}

export class WebGLBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    this.setState({ message });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08080c] px-4 py-10 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 500px at 50% 20%, rgba(255,215,0,0.07), transparent 60%), radial-gradient(800px 500px at 80% 80%, rgba(61,140,255,0.06), transparent 60%)",
          }}
        />
        <div className="relative w-full max-w-3xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffd700] text-[20px] font-black text-black">
              SP
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Shreyas{" "}
              <span className="bg-gradient-to-r from-[#ffd700] to-[#ffaa00] bg-clip-text text-transparent">
                Pawar
              </span>
            </h1>
            <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-[#7dd3fc]">
              {profile.subheading.toUpperCase()}
            </p>
            <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-[#a8a5b0]">
              {profile.bio}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 font-mono text-[9px] tracking-[0.25em] text-[#ffd700]">
                LAPTOP · SKILLS
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillGroups.flatMap((g) => g.skills).slice(0, 12).map((s) => (
                  <span
                    key={s}
                    className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#c9c6d0]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 font-mono text-[9px] tracking-[0.25em] text-[#ffd700]">
                TABLET · JOURNEY
              </div>
              <div className="space-y-2 text-[12px] leading-snug text-[#a8a5b0]">
                <div>
                  <span className="font-bold text-white">Diploma in IT</span>
                  <span className="ml-1.5 font-mono text-[10px] text-[#ffd700]/80">2022–2025</span>
                </div>
                <div>
                  <span className="font-bold text-white">Flutter & Dart Internship</span>
                  <span className="ml-1.5 font-mono text-[10px] text-[#ffd700]/80">Jun–Jul 2025</span>
                </div>
                <div>
                  <span className="font-bold text-white">B.Tech Computer Engg.</span>
                  <span className="ml-1.5 font-mono text-[10px] text-[#ffd700]/80">2025–Present</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 font-mono text-[9px] tracking-[0.25em] text-[#ffd700]">
                TV · ACHIEVEMENTS
              </div>
              <div className="space-y-2 text-[12px] leading-snug text-[#a8a5b0]">
                <div>
                  <span className="font-bold text-white">Kepler-404</span>
                  <span className="ml-1.5 font-mono text-[10px] text-[#7dd3fc]">ISRO SAC · 2026</span>
                </div>
                <div>
                  <span className="font-bold text-white">Camptel AI</span>
                  <span className="ml-1.5 font-mono text-[10px] text-[#7dd3fc]">Google Cloud · 2026</span>
                </div>
                <div>
                  <span className="font-bold text-white">AI for Learning</span>
                  <span className="ml-1.5 font-mono text-[10px] text-[#7dd3fc]">AWS AI for Bharat · 2026</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 font-mono text-[9px] tracking-[0.25em] text-[#ffd700]">
                PHONE · CONTACT
              </div>
              <div className="space-y-1.5 text-[12px] text-[#a8a5b0]">
                <div className="truncate">{profile.email}</div>
                <div className="truncate">{profile.phone}</div>
                <div className="text-[#8f8c99]">{profile.place}</div>
              </div>
              <div className="mt-3 flex gap-1.5">
                {[
                  { label: "LINKEDIN", url: profile.socialLinks.linkedin },
                  { label: "GITHUB", url: profile.socialLinks.github },
                  { label: "X", url: profile.socialLinks.twitter },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold tracking-[0.1em] text-white transition-colors hover:border-[#ffd700]/50 hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="/resume/Shreyas%20Pawar%20Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#ffd700] px-5 py-2 font-mono text-[11px] font-bold tracking-[0.15em] text-black transition-transform hover:scale-105"
            >
              DOWNLOAD RESUME ↓
            </a>
            <Link
              href="/"
              className="rounded-full border border-[#7dd3fc]/60 px-5 py-2 font-mono text-[11px] font-bold tracking-[0.15em] text-[#7dd3fc] transition-colors hover:bg-[#7dd3fc] hover:text-black"
            >
              ← BACK TO PORTFOLIO
            </Link>
          </div>

          <p className="mt-6 text-center font-mono text-[9px] tracking-[0.15em] text-[#5f5c69]">
            WEBGL / GPU NOT AVAILABLE — SHOWING 2D FALLBACK VIEW
            {this.state.message ? ` · ${this.state.message}` : ""}
          </p>
        </div>
      </div>
    );
  }
}
