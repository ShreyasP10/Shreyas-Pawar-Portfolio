"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  profile,
  projects,
  skillGroups,
  hackathons,
  experience,
  certifications,
  milestones,
} from "@/lib/data";
import { useUIStore, type LaptopTab, type TabletTab, type TvTab } from "./store";

export type ExtendedLaptopTab = LaptopTab | "terminal";

const LAPTOP_TABS: { id: ExtendedLaptopTab; label: string; icon: string }[] = [
  { id: "home", label: "HERO.TSX", icon: "⚛" },
  { id: "terminal", label: "TERMINAL", icon: "$" },
  { id: "skills", label: "SKILLS.JSON", icon: "✦" },
  { id: "certifications", label: "CERTS.MD", icon: "★" },
];

const TABLET_TABS: { id: TabletTab; label: string }[] = [
  { id: "projects", label: "PROJECTS" },
  { id: "journey", label: "TIMELINE" },
];

function Panel({ children, title, badge }: { children: React.ReactNode; title: string; badge?: string }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[5px] border border-[#ffd700]/30 bg-[#0a0a0f] shadow-[0_0_24px_rgba(255,215,0,0.1)]">
      {/* Top Window Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#121218] px-2.5 py-1">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f56]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
          <span className="ml-1 font-mono text-[6.5px] font-bold tracking-[0.18em] text-[#ffd700]">{title}</span>
        </div>
        {badge && (
          <span className="rounded bg-[#ffd700]/15 px-1.5 py-0.5 font-mono text-[5px] font-bold tracking-[0.15em] text-[#ffd700]">
            {badge}
          </span>
        )}
      </div>
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto p-2">{children}</div>
    </div>
  );
}

export function LaptopScreen() {
  const tab = useUIStore((s) => s.laptopTab) as ExtendedLaptopTab;
  const [selectedTab, setSelectedTab] = useState<ExtendedLaptopTab | null>(null);
  const [time, setTime] = useState("");
  const prevTabRef = useRef(tab);

  useLayoutEffect(() => {
    if (prevTabRef.current !== tab) {
      setSelectedTab(null);
      prevTabRef.current = tab;
    }
  }, [tab]);

  const activeTab = selectedTab ?? tab ?? "home";

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: 340, height: 216 }} className="select-none text-white">
      <Panel title="DEV·ENV // SHREYAS PAWAR" badge="v2.4 ONLINE">
        <div className="flex h-full flex-col gap-1.5">
          {/* Status Bar */}
          <div className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[5.5px] text-[#8f8c99]">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#4ade80]">
                <span className="h-1 w-1 animate-pulse rounded-full bg-[#4ade80]" />
                READY
              </span>
              <span>NODE v20.12</span>
              <span>BRANCH: <span className="text-[#7dd3fc]">main</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span>CPU <span className="text-[#ffd700]">12%</span></span>
              <span>RAM <span className="text-[#ffd700]">3.8GB</span></span>
              <span className="font-bold text-white">{time}</span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 gap-1.5">
            {/* Sidebar Tabs */}
            <div className="flex w-[82px] shrink-0 flex-col gap-1 rounded border border-white/10 bg-black/40 p-1">
              <span className="px-1 font-mono text-[5px] tracking-[0.2em] text-[#7dd3fc]/80">EXPLORER</span>
              {LAPTOP_TABS.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTab(t.id);
                      if (t.id !== "terminal") {
                        useUIStore.getState().navigateTab("laptop", t.id as LaptopTab);
                      }
                    }}
                    className={`flex items-center gap-1 rounded px-1.5 py-1 text-left font-mono text-[6px] tracking-wide transition-all ${
                      isActive
                        ? "bg-[#ffd700] font-bold text-black shadow-sm"
                        : "text-[#a8a5b0] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Code / Content Area */}
            <div className="min-w-0 flex-1 rounded border border-white/10 bg-black/60 p-2">
              <LaptopContent tab={activeTab} />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function LaptopContent({ tab }: { tab: ExtendedLaptopTab }) {
  switch (tab) {
    case "home":
      return (
        <div className="space-y-1 font-mono text-[7px] leading-relaxed">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[5.5px] text-[#8f8c99]">
            <span className="text-[#ffd700]">src/core/shreyas.tsx</span>
            <span>TypeScript React</span>
          </div>
          <div className="pt-1 text-[#d4d4d4]">
            <div>
              <span className="text-[#c586c0]">import</span>{" "}
              <span className="text-[#9cdcfe]">SoftwareEngineer</span>{" "}
              <span className="text-[#c586c0]">from</span>{" "}
              <span className="text-[#ce9178]">&apos;@pawar/core&apos;</span>;
            </div>
            <div className="mt-1">
              <span className="text-[#569cd6]">export const</span>{" "}
              <span className="text-[#4fc1ff]">ShreyasPawar</span>:{" "}
              <span className="text-[#4ec9b0]">Developer</span> = {"{"}
            </div>
            <div className="pl-3">
              <span className="text-[#9cdcfe]">name:</span>{" "}
              <span className="text-[#ce9178]">&quot;{profile.name}&quot;</span>,
            </div>
            <div className="pl-3">
              <span className="text-[#9cdcfe]">role:</span>{" "}
              <span className="text-[#ce9178]">&quot;{profile.subheading}&quot;</span>,
            </div>
            <div className="pl-3">
              <span className="text-[#9cdcfe]">location:</span>{" "}
              <span className="text-[#ce9178]">&quot;{profile.place}&quot;</span>,
            </div>
            <div className="pl-3">
              <span className="text-[#9cdcfe]">status:</span>{" "}
              <span className="text-[#4ade80]">&quot;Open to Opportunities&quot;</span>,
            </div>
            <div>{"};"}</div>
          </div>

          <div className="mt-2 flex gap-1.5 pt-1">
            <button
              onClick={() => useUIStore.getState().openDevice("tablet", "projects")}
              className="rounded bg-[#ffd700] px-2 py-0.5 font-mono text-[6px] font-bold text-black transition-transform hover:scale-105"
            >
              EXPLORE PROJECTS →
            </button>
            <button
              onClick={() => useUIStore.getState().openDevice("phone")}
              className="rounded border border-[#7dd3fc]/50 px-2 py-0.5 font-mono text-[6px] font-bold text-[#7dd3fc] hover:bg-[#7dd3fc]/15"
            >
              CONNECT ☎
            </button>
          </div>
        </div>
      );

    case "terminal":
      return (
        <div className="space-y-1.5 font-mono text-[6.5px]">
          <div className="flex items-center gap-1 border-b border-white/10 pb-1 text-[5.5px] text-[#7dd3fc]">
            <span>bash — 80x24</span>
          </div>
          <div className="space-y-1 text-[#a8a5b0]">
            <div>
              <span className="text-[#4ade80]">shreyas@workstation</span>:<span className="text-[#7dd3fc]">~</span>$ whoami
            </div>
            <div className="pl-2 text-white">
              Shreyas Pawar — Full Stack & Cloud Developer
            </div>
            <div>
              <span className="text-[#4ade80]">shreyas@workstation</span>:<span className="text-[#7dd3fc]">~</span>$ npx run-tests
            </div>
            <div className="pl-2 text-[#4ade80]">
              ✔ All 24 core test suites passed (100% code coverage)
            </div>
            <div>
              <span className="text-[#4ade80]">shreyas@workstation</span>:<span className="text-[#7dd3fc]">~</span>$ ready_for_hire --now
            </div>
            <div className="pl-2 font-bold text-[#ffd700]">
              [OK] Available for high-impact Engineering Roles!
            </div>
          </div>
        </div>
      );

    case "skills":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] font-bold tracking-[0.2em] text-[#ffd700]">TECHNICAL CAPABILITIES</div>
          <div className="grid grid-cols-2 gap-1">
            {skillGroups.map((g) => (
              <div key={g.category} className="rounded border border-white/10 bg-white/5 p-1">
                <div className="font-mono text-[5.5px] font-bold text-[#7dd3fc]">
                  {g.category.toUpperCase()}
                </div>
                <div className="mt-0.5 flex flex-wrap gap-0.5">
                  {g.skills.map((s) => (
                    <span key={s} className="rounded bg-white/10 px-1 py-px font-mono text-[5px] text-[#e0e0e0]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "certifications":
      return (
        <div className="space-y-1">
          <div className="font-mono text-[6.5px] font-bold tracking-[0.2em] text-[#ffd700]">VERIFIED CREDENTIALS</div>
          <div className="space-y-1">
            {certifications.map((c) => (
              <div key={c.id} className="rounded border border-white/10 bg-white/5 p-1">
                <div className="text-[7px] font-bold text-white">{c.title}</div>
                <div className="flex items-center justify-between font-mono text-[5.5px]">
                  <span className="text-[#ffd700]">{c.issuer}</span>
                  <span className="text-[#8f8c99]">{c.issued}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
  }
}

export function TabletScreen() {
  const tab = useUIStore((s) => s.tabletTab);

  return (
    <div style={{ width: 112, height: 172 }} className="select-none text-white">
      <Panel title="PROJECT DECK" badge="TOUCH">
        <div className="flex h-full flex-col gap-1">
          {/* Tab Selector */}
          <div className="flex shrink-0 rounded border border-white/10 bg-white/5 p-0.5">
            {TABLET_TABS.map((item) => {
              const isActive = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => useUIStore.getState().navigateTab("tablet", item.id)}
                  className={`flex-1 rounded py-0.5 text-center font-mono text-[5px] font-bold tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#ffd700] text-black"
                      : "text-[#8f8c99] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1">
            <TabletContent tab={tab} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function TabletContent({ tab }: { tab: TabletTab }) {
  switch (tab) {
    case "projects":
      return (
        <div className="space-y-1">
          {projects.filter((p) => p.highlight).map((p) => (
            <div key={p.id} className="rounded border border-[#ffd700]/30 bg-white/5 p-1 transition-colors hover:border-[#ffd700]">
              <div className="flex items-baseline justify-between">
                <span className="text-[6.5px] font-bold leading-tight text-white">{p.title}</span>
                <span className="font-mono text-[5px] text-[#ffd700]">{p.year}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[5px] leading-tight text-[#a8a5b0]">{p.description}</p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded bg-[#ffd700]/15 px-1 py-px font-mono text-[4px] text-[#ffd700]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case "journey":
      return (
        <div className="space-y-1">
          {milestones.map((m) => (
            <div key={m.id} className="rounded border border-white/10 bg-white/5 p-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[6.5px] font-bold text-white">{m.title}</span>
                <span className="font-mono text-[5px] text-[#7dd3fc]">{m.period}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[5px] leading-tight text-[#a8a5b0]">{m.description}</p>
            </div>
          ))}
        </div>
      );
  }
}

function QrGlyph() {
  const modules = useMemo(() => {
    try {
      return QRCode.create(profile.socialLinks.github, { errorCorrectionLevel: "M" });
    } catch {
      return null;
    }
  }, []);
  if (!modules) return null;
  const size = modules.modules.size;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-6 w-6 shrink-0 rounded-[2px] bg-white p-[1px]" aria-hidden="true">
      {Array.from(modules.modules.data, (on, i) =>
        on ? (
          <rect
            key={i}
            x={i % size}
            y={Math.floor(i / size)}
            width={1}
            height={1}
            fill="#0a0a0a"
          />
        ) : null
      )}
    </svg>
  );
}

export function PhoneScreen({ active }: { active?: boolean }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!active) {
    return (
      <div style={{ width: 64, height: 130 }} className="select-none">
        <div className="flex h-full w-full flex-col items-center justify-between rounded-[8px] border border-white/15 bg-[#08080c] p-2 text-white shadow-lg">
          {/* Dynamic Island */}
          <div className="flex h-2 w-12 items-center justify-center rounded-full bg-black">
            <span className="h-1 w-1 rounded-full bg-white/40" />
          </div>

          <div className="text-center">
            <div className="font-mono text-[9px] font-bold tabular-nums text-white">{time}</div>
            <div className="mt-0.5 font-mono text-[4px] tracking-wider text-[#ffd700]">SHREYAS PAWAR</div>
            <div className="font-mono text-[3.5px] text-[#7dd3fc]/80">SOFTWARE ENGINEER</div>
          </div>

          {/* Quick Notification Pill */}
          <div className="flex w-full items-center gap-1 rounded bg-[#ffd700]/15 px-1 py-0.5">
            <span className="h-1 w-1 animate-ping rounded-full bg-[#ffd700]" />
            <span className="truncate font-mono text-[3.5px] text-[#ffd700]">Tap to open contact card</span>
          </div>
        </div>
      </div>
    );
  }

  const socials = [
    { label: "IN", url: profile.socialLinks.linkedin, bg: "#0a66c2" },
    { label: "GH", url: profile.socialLinks.github, bg: "#24292e" },
    { label: "X", url: profile.socialLinks.twitter, bg: "#000000" },
    { label: "WA", url: profile.socialLinks.whatsapp, bg: "#25d366" },
  ];

  return (
    <div style={{ width: 64, height: 130 }} className="select-none">
      <Panel title="CONTACT">
        <div className="flex h-full flex-col justify-between text-[4.5px]">
          <div className="text-center">
            <div className="mx-auto flex h-4 w-4 items-center justify-center rounded-full bg-[#ffd700] text-[6px] font-black text-black">
              SP
            </div>
            <div className="mt-1 text-[6.5px] font-black text-white">Let&apos;s Connect</div>
            <div className="font-mono text-[4px] text-[#ffd700]">{profile.email}</div>
          </div>

          {/* Social Quick Launch */}
          <div className="grid grid-cols-4 gap-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex items-center justify-center rounded border border-white/10 py-1 font-mono text-[4.5px] font-bold text-white transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: s.bg }}
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Download Resume Button */}
          <a
            href="/resume/Shreyas%20Pawar%20Resume.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="block rounded bg-[#ffd700] py-1 text-center font-mono text-[4.5px] font-bold tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
          >
            RESUME PDF ↓
          </a>

          {/* GitHub QR Code */}
          <div className="flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1">
            <QrGlyph />
            <div className="min-w-0 flex-1 font-mono text-[3.5px]">
              <div className="font-bold text-[#ffd700]">SCAN FOR GITHUB</div>
              <div className="truncate text-[#8f8c99]">github.com/ShreyasP10</div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

const TV_TABS: { id: TvTab; label: string }[] = [
  { id: "hackathons", label: "HACKATHONS" },
  { id: "achievements", label: "AWARDS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "open-source", label: "OPEN SOURCE" },
  { id: "certs", label: "CREDENTIALS" },
];

export function TvScreen({ fullscreen }: { fullscreen?: boolean }) {
  if (fullscreen) {
    return (
      <div style={{ width: 1280, height: 720 }} className="overflow-hidden">
        <div style={{ width: 480, height: 270, transform: "scale(2.6667)", transformOrigin: "top left" }}>
          <TvPanel />
        </div>
      </div>
    );
  }
  return <TvPanel />;
}

function TvPanel() {
  const tvTab = useUIStore((s) => s.tvTab);

  return (
    <div style={{ width: 500, height: 280 }} className="select-none text-white">
      <Panel title="4K OLED SHOWCASE // SHREYAS PAWAR" badge="HDR LIVE">
        <div className="flex h-full flex-col gap-2">
          {/* Header Navigation */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 pb-1.5">
            <div className="flex gap-1">
              {TV_TABS.map((item) => {
                const isActive = tvTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => useUIStore.getState().navigateTab("tv", item.id)}
                    className={`rounded px-2 py-0.5 font-mono text-[6.5px] font-bold tracking-wider transition-colors ${
                      isActive
                        ? "bg-[#ffd700] text-black shadow-md"
                        : "text-[#8f8c99] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-[6px] font-bold text-[#7dd3fc]">
              ★ LIVE SHOWCASE
            </span>
          </div>

          <div className="min-h-0 flex-1">
            <TvContent tab={tvTab} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function TvContent({ tab }: { tab: TvTab }) {
  switch (tab) {
    case "hackathons":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {hackathons.map((h) => (
            <a
              key={h.id}
              href={h.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group block rounded border border-white/10 bg-white/5 p-2 transition-all hover:border-[#ffd700] hover:bg-white/10"
            >
              <div className="flex items-baseline justify-between">
                <span className="truncate text-[8.5px] font-bold text-white group-hover:text-[#ffd700]">{h.title}</span>
                <span className="shrink-0 font-mono text-[6px] text-[#7dd3fc]">{h.event}</span>
              </div>
              <div className="mt-0.5 font-mono text-[6px] font-bold text-[#ffd700]">★ {h.outcome}</div>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {h.tags.slice(0, 4).map((t) => (
                  <span key={t} className="rounded bg-[#ffd700]/15 px-1 py-px font-mono text-[5.5px] text-[#ffd700]">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      );

    case "achievements":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {milestones
            .filter((m) => m.type === "competition" || m.type === "hackathon")
            .map((m) => (
              <div key={m.id} className="rounded border border-[#ffd700]/30 bg-white/5 p-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[8.5px] font-bold text-white">{m.title}</span>
                  <span className="font-mono text-[6px] text-[#7dd3fc]">{m.period}</span>
                </div>
                <div className="mt-0.5 font-mono text-[6px] font-bold text-[#ffd700]">★ {m.place}</div>
                <p className="mt-1 line-clamp-3 text-[6.5px] text-[#a8a5b0]">{m.description}</p>
              </div>
            ))}
        </div>
      );

    case "experience":
      return (
        <div className="space-y-1.5">
          {experience.map((e) => (
            <div key={e.id} className="rounded border border-white/10 bg-white/5 p-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[9px] font-bold text-white">{e.role} · <span className="text-[#ffd700]">{e.company}</span></span>
                <span className="font-mono text-[6.5px] text-[#7dd3fc]">{e.startDate} → {e.endDate}</span>
              </div>
              <p className="mt-1 text-[7px] text-[#a8a5b0]">{e.description}</p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {e.skills.slice(0, 6).map((s) => (
                  <span key={s} className="rounded bg-white/10 px-1.5 py-px font-mono text-[5.5px] text-white">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case "open-source":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {projects
            .filter((p) => p.githubUrl)
            .map((p) => (
              <a
                key={p.id}
                href={p.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="group block rounded border border-white/10 bg-white/5 p-2 transition-all hover:border-[#7dd3fc] hover:bg-white/10"
              >
                <div className="flex items-baseline justify-between">
                  <span className="truncate font-mono text-[8px] font-bold text-[#7dd3fc] group-hover:text-white">
                    {p.title}
                  </span>
                  <span className="font-mono text-[6px] text-[#8f8c99]">{p.year}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[6.5px] text-[#a8a5b0]">{p.description}</p>
              </a>
            ))}
        </div>
      );

    case "certs":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {certifications.map((c) => (
            <div key={c.id} className="rounded border border-[#ffd700]/30 bg-white/5 p-2">
              <div className="font-mono text-[5.5px] font-bold tracking-widest text-[#ffd700]">CREDENTIAL</div>
              <div className="mt-0.5 text-[8px] font-bold text-white">{c.title}</div>
              <div className="mt-0.5 font-mono text-[6.5px] text-[#7dd3fc]">{c.issuer} · {c.issued}</div>
              <div className="mt-0.5 truncate font-mono text-[5px] text-[#8f8c99]">{c.credentialId}</div>
            </div>
          ))}
        </div>
      );
  }
}
