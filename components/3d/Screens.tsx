"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  profile,
  projects,
  skillGroups,
  hackathons,
  experience,
  certifications,
  milestones,
  techStack,
} from "@/lib/data";
import { useWorkspace, type LaptopTab, type TabletTab, type TvTab } from "./store";

const LAPTOP_TABS: { id: LaptopTab; label: string }[] = [
  { id: "home", label: "HERO" },
  { id: "skills", label: "SKILLS" },
  { id: "certifications", label: "CERTS" },
];

const TABLET_TABS: { id: TabletTab; label: string }[] = [
  { id: "projects", label: "FEATURED" },
  { id: "journey", label: "JOURNEY" },
];

function Dock({ items }: { items: { id: string; label: string }[] }) {
  const active = useWorkspace((s) =>
    items.some((i) => i.id === s.laptopTab || i.id === s.tabletTab)
      ? items.find((i) => i.id === s.laptopTab || i.id === s.tabletTab)?.id
      : null
  );
  const activeDevice = useWorkspace((s) => s.activeDevice);

  return (
    <div className="flex flex-col gap-px">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => useWorkspace.getState().navigateTab(activeDevice ?? "laptop", item.id as LaptopTab)}
            className={`rounded px-1.5 py-0.5 text-left font-mono text-[5.5px] leading-tight tracking-[0.14em] transition-colors ${
              isActive
                ? "bg-[#ffd700] text-black"
                : "text-[#8f8c99] hover:bg-white/10 hover:text-[#ffd700]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function Panel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="animate-panel-pop flex h-full w-full flex-col overflow-hidden rounded-[4px] border border-[#ffd700]/25 bg-[#0c0c10] shadow-[0_0_18px_rgba(255,215,0,0.08)]">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-2 py-1">
        <span className="font-mono text-[6px] tracking-[0.22em] text-[#ffd700]">{title}</span>
        <span className="flex gap-1">
          <span className="h-1 w-1 rounded-full bg-[#ffd700]/70" />
          <span className="h-1 w-1 rounded-full bg-white/20" />
        </span>
      </div>
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-1.5 py-1.5">{children}</div>
    </div>
  );
}

function IsometricMark() {
  return (
    <svg viewBox="0 0 96 40" className="w-full opacity-90" aria-hidden="true">
      <g fill="none" strokeLinejoin="round">
        <path d="M8 12l8-4.6 8 4.6v9.2l-8 4.6-8-4.6z" fill="rgba(255,215,0,0.14)" stroke="#ffd700" strokeWidth="1.2" />
        <path d="M16 7.4V16.6M8 12l8 4.6M16 16.6l8-4.6" stroke="#ffd700" strokeWidth="0.9" opacity="0.7" />
        <path d="M40 22l8-4.6 8 4.6v9.2l-8 4.6-8-4.6z" fill="rgba(125,211,252,0.12)" stroke="#7dd3fc" strokeWidth="1.2" />
        <path d="M48 17.4V26.6M40 22l8 4.6M48 26.6l8-4.6" stroke="#7dd3fc" strokeWidth="0.9" opacity="0.7" />
        <path d="M72 2l8-4.6 8 4.6v9.2l-8 4.6-8-4.6z" fill="rgba(255,215,0,0.1)" stroke="#ffd700" strokeWidth="1.2" opacity="0.8" />
        <path d="M80 -2.6V6.6M72 2l8 4.6M80 6.6l8-4.6" stroke="#ffd700" strokeWidth="0.9" opacity="0.6" />
      </g>
    </svg>
  );
}

export function LaptopScreen() {
  const tab = useWorkspace((s) => s.laptopTab);

  return (
    <div style={{ width: 324, height: 204 }} className="select-none">
      <Panel title="SHREYAS PAWAR — WORKSPACE">
        <div className="flex h-full gap-1.5">
          <div className="w-[74px] shrink-0 overflow-y-auto rounded border border-white/10 bg-white/5 p-1">
            <Dock items={LAPTOP_TABS} />
          </div>
          <div className="min-w-0 flex-1">
            <LaptopContent tab={tab} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function LaptopContent({ tab }: { tab: LaptopTab }) {
  switch (tab) {
    case "home":
      return (
        <div className="space-y-1.5 font-mono text-[7px]">
          <div className="flex items-center gap-1 border-b border-white/5 pb-1 text-[5px] text-[#5f5c69]">
            <span className="rounded-t bg-white/5 px-1.5 py-0.5 text-[#ffd700]">shreyas.tsx</span>
            <span className="px-1.5 py-0.5">about.md</span>
            <span className="px-1.5 py-0.5">projects.json</span>
          </div>
          <div className="pt-1 leading-snug">
            <div className="flex gap-1.5">
              <span className="text-[#c586c0]">import</span>
              <span className="text-[#9cdcfe]">Developer</span>
              <span className="text-[#c586c0]">from</span>
              <span className="text-[#ce9178]">&apos;@core/shreyas&apos;</span>
            </div>
            <div className="mt-1">
              <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">Portfolio</span> = () {"=>"} (
            </div>
            <div className="pl-3">
              {"<"}<span className="text-[#569cd6]">Section</span>
            </div>
            <div className="pl-6 text-[#9cdcfe]">
              title=<span className="text-[#ce9178]">&quot;Shreyas Pawar&quot;</span>
            </div>
            <div className="pl-6 text-[#9cdcfe]">
              role=<span className="text-[#ce9178]">&quot;Software Engineer&quot;</span>
            </div>
            <div className="pl-3">{">"}</div>
            <div className="pl-6 text-[#d4d4d4]">
              Building intelligent software that solves real-world problems.
            </div>
            <div className="pl-3">
              {"</"}<span className="text-[#569cd6]">Section</span>{">"}
            </div>
            <div>);</div>
          </div>

          <div className="mt-2 flex gap-1.5 pt-1">
            <button
              onClick={() => useWorkspace.getState().navigateTab("laptop", "skills")}
              className="rounded-sm bg-[#ffd700] px-2 py-0.5 font-mono text-[6px] font-bold text-black hover:brightness-110"
            >
              RUN --SKILLS
            </button>
            <button
              onClick={() => useWorkspace.getState().openDevice("phone")}
              className="rounded-sm border border-[#7dd3fc]/40 px-2 py-0.5 font-mono text-[6px] font-bold text-[#7dd3fc] hover:bg-[#7dd3fc]/10"
            >
              CONTACT.INVOKE()
            </button>
          </div>
        </div>
      );
    case "skills":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">SKILLS</div>
          {skillGroups.map((g) => (
            <div key={g.category} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="font-mono text-[6px] tracking-[0.15em] text-[#ffd700]/80">
                {g.category.toUpperCase()}
              </div>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {g.skills.map((s) => (
                  <span key={s} className="rounded bg-white/8 px-1 py-px text-[6px] text-[#c9c6d0]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "certifications":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">CERTIFICATIONS</div>
          {certifications.map((c) => (
            <div key={c.id} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="text-[7.5px] font-bold text-white">{c.title}</div>
              <div className="font-mono text-[6px] text-[#ffd700]/80">{c.issuer}</div>
              <div className="font-mono text-[5.5px] text-[#8f8c99]">{c.issued}</div>
            </div>
          ))}
        </div>
      );
  }
}

export function TabletScreen() {
  const tab = useWorkspace((s) => s.tabletTab);

  return (
    <div style={{ width: 104, height: 164 }} className="select-none">
      <Panel title="DASHBOARD">
        <div className="flex h-full flex-col gap-1">
          <div className="shrink-0 rounded border border-white/10 bg-white/5 p-0.5">
            <DockRow items={TABLET_TABS} />
          </div>
          <div className="min-h-0 flex-1">
            <TabletContent tab={tab} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function DockRow({ items }: { items: { id: string; label: string }[] }) {
  const active = useWorkspace((s) =>
    items.some((i) => i.id === s.laptopTab || i.id === s.tabletTab)
      ? items.find((i) => i.id === s.laptopTab || i.id === s.tabletTab)?.id
      : null
  );
  const activeDevice = useWorkspace((s) => s.activeDevice);

  return (
    <div className="flex gap-px">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => useWorkspace.getState().navigateTab(activeDevice ?? "tablet", item.id as TabletTab)}
            className={`min-w-0 flex-1 rounded px-0.5 py-0.5 text-center font-mono text-[4.5px] tracking-[0.05em] transition-colors ${
              isActive
                ? "bg-[#ffd700] text-black"
                : "text-[#8f8c99] hover:bg-white/10 hover:text-[#ffd700]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function TabletContent({ tab }: { tab: TabletTab }) {
  switch (tab) {
    case "projects":
      return (
        <div className="space-y-1">
          <div className="font-mono text-[5.5px] tracking-[0.25em] text-[#ffd700]">FEATURED PROJECTS</div>
          {projects.filter((p) => p.highlight).slice(0, 3).map((p) => (
            <div key={p.id} className="rounded border border-[#ffd700]/30 bg-white/5 p-1">
              <div className="text-[6.5px] font-bold leading-tight text-white">{p.title}</div>
              <div className="font-mono text-[5px] text-[#ffd700]/80">{p.year}</div>
              <div className="mt-0.5 line-clamp-2 text-[5px] leading-snug text-[#a8a5b0]">{p.description}</div>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded bg-[#ffd700]/10 px-1 py-px font-mono text-[4px] text-[#ffd700]">
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
          <div className="font-mono text-[5.5px] tracking-[0.25em] text-[#ffd700]">JOURNEY</div>
          {milestones.map((m) => (
            <div key={m.id} className="rounded border border-white/10 bg-white/5 p-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[6.5px] font-bold leading-tight text-white">{m.title}</span>
                <span className="font-mono text-[5px] text-[#ffd700]/80">{m.period}</span>
              </div>
              <div className="line-clamp-2 text-[5.5px] leading-snug text-[#a8a5b0]">{m.description}</div>
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
  const [notification, setNotification] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!active) {
      const timer = setTimeout(() => setNotification(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const clock = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  if (!active) {
    return (
      <div style={{ width: 60, height: 124 }} className="select-none">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-[3px] border border-white/10 bg-[#08080c]">
          <div className="mb-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ffd700]/20 font-black text-[#ffd700]/80" style={{ fontSize: "5px" }}>
            SP
          </div>
          <div className="text-center text-[5.5px] font-medium leading-tight text-white/60">SHREYAS PAWAR</div>
          <div className="mt-0.5 text-center font-mono text-[3.5px] tracking-[0.15em] text-[#7dd3fc]/70">
            SOFTWARE ENGINEER
          </div>
          <div className="mt-1.5 flex items-center gap-0.5 text-[#7dd3fc]/60" style={{ fontSize: "6px" }}>
            <span className="font-mono tabular-nums">{clock}</span>
          </div>
          {notification && (
            <div
              className="mt-1.5 flex w-[88%] animate-slide-down items-center gap-1 rounded border border-[#ff6b6b]/50 bg-[#ff6b6b]/10 px-1 py-0.5"
              style={{ fontSize: "3.5px" }}
            >
              <div className="h-1 w-1 shrink-0 rounded-full bg-[#ff6b6b]" />
              <div className="truncate font-mono text-[#ff6b6b]">NEW GITHUB NOTIFICATION</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const socials = [
    { label: "IN", url: profile.socialLinks.linkedin },
    { label: "GH", url: profile.socialLinks.github },
    { label: "X", url: profile.socialLinks.twitter },
    { label: "WA", url: profile.socialLinks.whatsapp },
  ];

  return (
    <div style={{ width: 60, height: 124 }} className="select-none">
      <Panel title="CONTACT">
        <div className="flex h-full flex-col">
          <div className="mx-auto mb-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffd700] font-black text-black" style={{ fontSize: "5.5px" }}>
            SP
          </div>
          <div className="text-center text-[6.5px] font-black leading-tight text-white">
            Let&apos;s Build Something Together
          </div>
          <div className="mt-0.5 text-center font-mono text-[3.5px] leading-snug text-[#7dd3fc]">
            {profile.subheading}
          </div>
          <div className="mt-1 space-y-0.5 rounded border border-white/10 bg-white/5 p-1 text-[4px] text-[#a8a5b0]">
            <div className="truncate">{profile.email}</div>
            <div className="truncate">{profile.phone}</div>
          </div>
          <div className="mt-1 grid grid-cols-4 gap-0.5">
            {socials.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-white/10 bg-white/5 py-0.5 text-center font-mono text-[3.5px] font-bold text-white transition-colors hover:border-[#ffd700]/50 hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href="/resume/Shreyas%20Pawar%20Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="mt-1 block rounded bg-[#ffd700] py-0.5 text-center font-mono text-[4.5px] font-bold tracking-[0.12em] text-black hover:brightness-110"
          >
            DOWNLOAD RESUME ↓
          </a>
          <div className="mt-1 flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1">
            <QrGlyph />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[3.5px] tracking-[0.2em] text-[#ffd700]">SCAN · GITHUB</div>
              <div className="mt-0.5 truncate font-mono text-[3px] leading-snug text-[#5f5c69]">
                {profile.socialLinks.github.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

const TV_TABS: { id: TvTab; label: string }[] = [
  { id: "hackathons", label: "HACKATHONS" },
  { id: "achievements", label: "ACHIEVEMENTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "open-source", label: "OPEN SOURCE" },
  { id: "certs", label: "CERTS" },
];

function TvDock() {
  const tvTab = useWorkspace((s) => s.tvTab);
  return (
    <div className="flex flex-wrap gap-0.5">
      {TV_TABS.map((item) => (
        <button
          key={item.id}
          onClick={() => useWorkspace.getState().navigateTab("tv", item.id)}
          className={`rounded px-1.5 py-0.5 font-mono text-[6.5px] tracking-[0.15em] transition-colors ${
            tvTab === item.id
              ? "bg-[#ffd700] text-black"
              : "text-[#8f8c99] hover:bg-white/10 hover:text-[#ffd700]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function TvPanel() {
  const tvTab = useWorkspace((s) => s.tvTab);

  return (
    <div style={{ width: 480, height: 270 }} className="select-none">
      <Panel title="SHOWCASE — SHREYAS PAWAR">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <TvDock />
          <span className="shrink-0 font-mono text-[6px] tracking-[0.25em] text-[#7dd3fc]">
            {profile.name.toUpperCase()} · LIVE
          </span>
        </div>
        <TvContent tab={tvTab} />
      </Panel>
    </div>
  );
}

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

function TvContent({ tab }: { tab: TvTab }) {
  switch (tab) {
    case "hackathons":
      return (
        <div className="space-y-1.5">
          {hackathons.map((h) => (
            <a
              key={h.id}
              href={h.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={`block rounded border bg-white/5 p-2 transition-colors hover:border-[#7dd3fc]/50 ${
                h.year === "2026" ? "border-[#ffd700]/40" : "border-white/10"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[9px] font-black text-white">{h.title}</span>
                <span className="shrink-0 font-mono text-[6px] text-[#ffd700]/80">{h.event}</span>
              </div>
              <div className="mt-0.5 font-mono text-[6px] tracking-[0.15em] text-[#7dd3fc]">
                ★ {h.outcome.slice(0, 90)}…
              </div>
              <p className="mt-1 line-clamp-2 text-[7px] leading-snug text-[#a8a5b0]">{h.outcome}</p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {h.tags.slice(0, 4).map((t) => (
                  <span key={t} className="rounded bg-[#7dd3fc]/15 px-1 py-px font-mono text-[6px] text-[#7dd3fc]">
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
              <div key={m.id} className="rounded border border-[#ffd700]/35 bg-white/5 p-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[9px] font-black text-white">{m.title}</span>
                  <span className="shrink-0 font-mono text-[6px] text-[#ffd700]/80">{m.period}</span>
                </div>
                <div className="mt-0.5 font-mono text-[6px] tracking-[0.15em] text-[#7dd3fc]">
                  ★ {m.place}
                </div>
                <p className="mt-1 line-clamp-3 text-[7px] leading-snug text-[#a8a5b0]">{m.description}</p>
              </div>
            ))}
        </div>
      );
    case "experience":
      return (
        <div className="space-y-1.5">
          {experience.map((e) => (
            <div key={e.id} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] font-black text-white">{e.role}</span>
                  <span className="ml-1.5 font-mono text-[7px] text-[#ffd700]/80">{e.company}</span>
                </div>
                <span className="shrink-0 font-mono text-[6px] text-[#8f8c99]">
                  {e.startDate} → {e.endDate}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[7px] leading-snug text-[#a8a5b0]">{e.description}</p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {e.skills.slice(0, 6).map((s) => (
                  <span key={s} className="rounded bg-[#ffd700]/10 px-1 py-px font-mono text-[6px] text-[#ffd700]">
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
        <div className="space-y-1.5">
          <div className="font-mono text-[7px] tracking-[0.25em] text-[#ffd700]">OPEN SOURCE & REPOSITORIES</div>
          {projects
            .filter((p) => p.githubUrl)
            .map((p) => (
              <a
                key={p.id}
                href={p.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded border border-white/10 bg-white/5 p-1.5 transition-colors hover:border-[#7dd3fc]/50"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[8px] font-bold text-[#7dd3fc]">
                    {p.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                  <span className="shrink-0 font-mono text-[6px] text-[#8f8c99]">{p.year}</span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[7px] text-[#a8a5b0]">{p.description}</p>
              </a>
            ))}
        </div>
      );
    case "certs":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {certifications.map((c) => (
            <div key={c.id} className="rounded border border-[#ffd700]/35 bg-white/5 p-2">
              <div className="font-mono text-[6px] tracking-[0.3em] text-[#ffd700]">CERTIFICATE</div>
              <div className="mt-0.5 text-[8.5px] font-black leading-tight text-white">{c.title}</div>
              <div className="mt-0.5 font-mono text-[7px] text-[#7dd3fc]">{c.issuer}</div>
              <div className="mt-0.5 font-mono text-[6px] text-[#8f8c99]">ISSUED {c.issued}</div>
              <div className="mt-0.5 truncate font-mono text-[5.5px] text-[#5f5c69]">{c.credentialId}</div>
            </div>
          ))}
        </div>
      );
  }
}
