"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  profile,
  projects,
  skillGroups,
  hackathons,
  experience,
  education,
  certifications,
  milestones,
  techStack,
} from "@/lib/data";
import { useWorkspace, type LaptopTab, type TabletTab, type TvTab } from "./store";

const LAPTOP_TABS: { id: LaptopTab; label: string }[] = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "achievements", label: "ACHIEVEMENTS" },
  { id: "education", label: "EDUCATION" },
  { id: "open-source", label: "OPEN SOURCE" },
  { id: "blog", label: "BLOG" },
  { id: "contact", label: "CONTACT" },
];

const TABLET_TABS: { id: TabletTab; label: string }[] = [
  { id: "experience", label: "WORK" },
  { id: "education", label: "EDU" },
  { id: "certifications", label: "CERTS" },
  { id: "journey", label: "JOURNEY" },
  { id: "research", label: "R&D" },
];

const BLOG_POSTS: { title: string; excerpt: string }[] = [
  { title: "Building Camptel AI", excerpt: "From a hackathon idea to a working AI prototype — the full build log." },
  { title: "Google Cloud Notes", excerpt: "Cloud functions, pub/sub and the billing gotchas I hit along the way." },
  { title: "Firebase Tips", excerpt: "Realtime rules, security gotchas and offline-first patterns." },
  { title: "Next.js Tricks", excerpt: "App router patterns, streaming and edge rendering notes." },
  { title: "Three.js Guide", excerpt: "The math behind this very workspace — cameras, rays and springs." },
  { title: "React Performance", excerpt: "Re-renders, memoization and why it usually doesn't matter." },
  { title: "System Design", excerpt: "Scaling small services: queues, caching and idempotency." },
  { title: "Docker", excerpt: "Multi-stage builds and slim images that actually deploy." },
  { title: "Kubernetes", excerpt: "Deployments, probes and the first time a pod crashed at 3 AM." },
  { title: "AI Notes", excerpt: "Prompts, fine-tuning and evaluating small LLM pipelines." },
  { title: "Clean Code", excerpt: "Naming, boundaries and refactoring without breaking things." },
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
  const navigateTab = useWorkspace((s) => s.navigateTab);

  switch (tab) {
    case "home":
      return (
        <div className="space-y-1.5">
          <div className="text-[12px] font-black leading-tight text-white">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-[#ffd700] to-[#ffaa00] bg-clip-text text-transparent">
              Shreyas Pawar
            </span>
          </div>
          <div className="font-mono text-[6.5px] leading-snug tracking-[0.15em] text-[#7dd3fc]">
            {profile.subheading}
          </div>
          <p className="line-clamp-3 text-[7px] leading-snug text-[#a8a5b0]">{profile.bio}</p>
          <IsometricMark />
          <div className="flex gap-1 pt-0.5">
            <button
              onClick={() => navigateTab("laptop", "projects")}
              className="rounded-full bg-[#ffd700] px-2 py-0.5 font-mono text-[6px] font-bold tracking-[0.15em] text-black hover:brightness-110"
            >
              VIEW PROJECTS →
            </button>
            <button
              onClick={() => navigateTab("laptop", "contact")}
              className="rounded-full border border-[#7dd3fc]/60 px-2 py-0.5 font-mono text-[6px] font-bold tracking-[0.15em] text-[#7dd3fc] hover:bg-[#7dd3fc] hover:text-black"
            >
              GET IN TOUCH
            </button>
          </div>
          <div className="flex flex-wrap gap-0.5">
            {techStack.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded border border-white/10 bg-white/5 px-1 py-px font-mono text-[5.5px] text-[#c9c6d0]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      );
    case "about":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">ABOUT ME</div>
          <p className="text-[7px] leading-snug text-[#a8a5b0]">{profile.bio}</p>
          <div className="rounded border border-white/10 bg-white/5 p-1.5">
            <div className="font-mono text-[6px] tracking-[0.2em] text-[#ffd700]/80">BASE</div>
            <div className="mt-0.5 font-mono text-[6.5px] text-[#8f8c99]">{profile.place}</div>
          </div>
          <div className="font-mono text-[5.5px] leading-relaxed tracking-wide text-[#8f8c99]">
            AI · CLOUD · FULL STACK — building software that ships.
          </div>
        </div>
      );
    case "experience":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">EXPERIENCE</div>
          {experience.map((e) => (
            <div key={e.id} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[7.5px] font-bold text-white">{e.role}</span>
                <span className="shrink-0 font-mono text-[5.5px] text-[#8f8c99]">
                  {e.startDate} → {e.endDate}
                </span>
              </div>
              <div className="font-mono text-[6px] text-[#ffd700]/80">
                {e.company} · {e.type}
              </div>
              <p className="mt-0.5 line-clamp-2 text-[6.5px] leading-snug text-[#a8a5b0]">{e.description}</p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {e.skills.slice(0, 4).map((s) => (
                  <span key={s} className="rounded bg-[#ffd700]/10 px-1 py-px font-mono text-[5.5px] text-[#ffd700]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "projects":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">PROJECTS</div>
          {projects.map((p) => (
            <div key={p.id} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[7.5px] font-bold text-white">{p.title}</span>
                <span className="font-mono text-[5.5px] text-[#8f8c99]">{p.year}</span>
              </div>
              <div className="mt-0.5 line-clamp-2 text-[6.5px] leading-snug text-[#a8a5b0]">
                {p.description}
              </div>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {p.tags.slice(0, 4).map((t) => (
                  <span key={t} className="rounded bg-[#ffd700]/15 px-1 py-px font-mono text-[5.5px] text-[#ffd700]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
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
    case "achievements":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">ACHIEVEMENTS</div>
          {hackathons.map((h) => (
            <div key={h.id} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[7.5px] font-bold text-white">{h.title}</span>
                <span className="font-mono text-[5.5px] text-[#8f8c99]">{h.year}</span>
              </div>
              <div className="font-mono text-[6px] text-[#ffd700]/80">{h.event}</div>
              <div className="mt-0.5 text-[6.5px] leading-snug text-[#a8a5b0]">{h.outcome}</div>
            </div>
          ))}
        </div>
      );
    case "education":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">EDUCATION</div>
          {education.map((e) => (
            <div key={e.id} className="rounded border border-white/10 bg-white/5 p-1.5">
              <span className="text-[7.5px] font-bold text-white">{e.degree}</span>
              <div className="font-mono text-[6px] text-[#ffd700]/80">{e.institution}</div>
              <div className="font-mono text-[5.5px] text-[#8f8c99]">{e.period}</div>
            </div>
          ))}
        </div>
      );
    case "open-source":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">OPEN SOURCE</div>
          <div className="rounded border border-[#ffd700]/40 bg-[#ffd700]/10 p-1.5">
            <div className="text-[7.5px] font-bold text-white">github.com/ShreyasP10</div>
            <div className="mt-0.5 text-[6.5px] text-[#a8a5b0]">
              Code, experiments and prototypes for everything in this workspace.
            </div>
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block rounded bg-[#ffd700] px-1.5 py-0.5 font-mono text-[6px] font-bold text-black"
            >
              VISIT GITHUB
            </a>
          </div>
          {projects.map((p) =>
            p.githubUrl ? (
              <div key={p.id} className="rounded border border-white/10 bg-white/5 p-1.5">
                <span className="text-[7px] font-bold text-white">{p.title}</span>{" "}
                <a href={p.githubUrl} target="_blank" rel="noreferrer" className="font-mono text-[6px] text-[#ffd700]">
                  ↗ repo
                </a>
              </div>
            ) : null
          )}
        </div>
      );
    case "blog":
      return (
        <div className="space-y-1">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">BLOG</div>
          {BLOG_POSTS.map((b) => (
            <div key={b.title} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="text-[7px] font-bold text-white">{b.title}</div>
              <div className="mt-0.5 line-clamp-2 text-[6px] leading-snug text-[#a8a5b0]">{b.excerpt}</div>
            </div>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="space-y-1.5">
          <div className="font-mono text-[6.5px] tracking-[0.25em] text-[#ffd700]">CONTACT</div>
          <div className="rounded border border-white/10 bg-white/5 p-1.5 text-[6.5px] text-[#a8a5b0]">
            <div className="truncate">{profile.email}</div>
            <div>{profile.phone}</div>
            <div className="mt-0.5 text-[#8f8c99]">{profile.place}</div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {(
              [
                { label: "LINKEDIN", url: profile.socialLinks.linkedin },
                { label: "GITHUB", url: profile.socialLinks.github },
                { label: "X / TWITTER", url: profile.socialLinks.twitter },
                { label: "WHATSAPP", url: profile.socialLinks.whatsapp },
              ] as { label: string; url: string }[]
            ).map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-white/10 bg-white/5 py-1 text-center font-mono text-[5.5px] tracking-[0.1em] text-white transition-colors hover:border-[#ffd700]/50 hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 p-1.5">
            <QrGlyph />
            <div className="flex-1">
              <div className="font-mono text-[5.5px] tracking-[0.25em] text-[#ffd700]">SCAN FOR MY GITHUB</div>
              <div className="mt-0.5 truncate font-mono text-[5px] leading-snug tracking-[0.15em] text-[#5f5c69]">
                {profile.socialLinks.github.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </div>
            </div>
          </div>
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
    case "experience":
      return (
        <div className="space-y-1">
          <div className="font-mono text-[5.5px] tracking-[0.25em] text-[#ffd700]">EXPERIENCE</div>
          {experience.map((e) => (
            <div key={e.id} className="rounded border border-white/10 bg-white/5 p-1">
              <div className="text-[6.5px] font-bold leading-tight text-white">{e.role}</div>
              <div className="font-mono text-[5.5px] text-[#ffd700]/80">
                {e.company} · {e.type}
              </div>
              <div className="font-mono text-[5px] text-[#8f8c99]">
                {e.startDate} → {e.endDate}
              </div>
            </div>
          ))}
        </div>
      );
    case "education":
      return (
        <div className="space-y-1">
          <div className="font-mono text-[5.5px] tracking-[0.25em] text-[#ffd700]">EDUCATION</div>
          {education.map((e) => (
            <div key={e.id} className="rounded border border-white/10 bg-white/5 p-1">
              <div className="text-[6.5px] font-bold leading-tight text-white">{e.degree}</div>
              <div className="font-mono text-[5.5px] text-[#a8a5b0]">{e.institution}</div>
              <div className="font-mono text-[5px] text-[#8f8c99]">{e.period}</div>
            </div>
          ))}
        </div>
      );
    case "certifications":
      return (
        <div className="space-y-1">
          <div className="font-mono text-[5.5px] tracking-[0.25em] text-[#ffd700]">CERTIFICATIONS</div>
          {certifications.map((c) => (
            <div key={c.id} className="rounded border border-white/10 bg-white/5 p-1">
              <div className="text-[6px] font-bold leading-tight text-white">{c.title}</div>
              <div className="font-mono text-[5.5px] text-[#ffd700]/80">{c.issuer}</div>
              <div className="font-mono text-[5px] text-[#8f8c99]">{c.issued}</div>
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
    case "research":
      return (
        <div className="space-y-1">
          <div className="font-mono text-[5.5px] tracking-[0.25em] text-[#ffd700]">R&D</div>
          {projects.slice(0, 3).map((p) => (
            <div key={p.id} className="rounded border border-white/10 bg-white/5 p-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[6.5px] font-bold leading-tight text-white">{p.title}</span>
                <span className="font-mono text-[5px] text-[#ffd700]/80">{p.year}</span>
              </div>
              <div className="line-clamp-2 text-[5.5px] leading-snug text-[#a8a5b0]">{p.description}</div>
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
  const openDevice = useWorkspace((s) => s.openDevice);
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
          <div className="text-center text-[6.5px] font-black leading-tight text-white">Contact Me</div>
          <div className="mt-0.5 text-center font-mono text-[3.5px] leading-snug text-[#7dd3fc]">
            Let&apos;s build something together
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
          <button
            onClick={() => openDevice("laptop", "contact")}
            className="mt-1 rounded bg-[#ffd700] py-0.5 text-center font-mono text-[4.5px] font-bold tracking-[0.12em] text-black hover:brightness-110"
          >
            OPEN LAPTOP →
          </button>
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
  { id: "showcase", label: "SHOWCASE" },
  { id: "projects", label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "skills", label: "SKILLS" },
  { id: "open-source", label: "OPEN SOURCE" },
  { id: "certs", label: "CERTS" },
  { id: "contact", label: "CONTACT" },
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
    case "showcase":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {projects
            .filter((p) => p.highlight)
            .slice(0, 4)
            .map((p) => (
              <div key={p.id} className="rounded border border-[#ffd700]/40 bg-gradient-to-br from-[#ffd700]/10 to-white/5 p-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[9px] font-black text-white">{p.title}</span>
                  <span className="shrink-0 font-mono text-[6px] text-[#ffd700]/80">{p.year}</span>
                </div>
                <div className="mt-0.5 font-mono text-[6px] tracking-[0.15em] text-[#7dd3fc]">
                  ★ {p.highlight}
                </div>
                <p className="mt-1 line-clamp-2 text-[7px] leading-snug text-[#a8a5b0]">{p.description}</p>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded bg-[#7dd3fc]/15 px-1 py-px font-mono text-[6px] text-[#7dd3fc]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      );
    case "projects":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {projects.map((p) => (
            <div
              key={p.id}
              className={`rounded border bg-white/5 p-2 ${
                p.highlight ? "border-[#ffd700]/40" : "border-white/10"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[9px] font-black text-white">{p.title}</span>
                <span className="shrink-0 font-mono text-[6px] text-[#ffd700]/80">{p.year}</span>
              </div>
              {p.highlight && (
                <div className="mt-0.5 font-mono text-[6px] tracking-[0.15em] text-[#7dd3fc]">
                  ★ {p.highlight}
                </div>
              )}
              <p className="mt-1 line-clamp-2 text-[7px] leading-snug text-[#a8a5b0]">{p.description}</p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {p.tags.slice(0, 4).map((t) => (
                  <span key={t} className="rounded bg-[#7dd3fc]/15 px-1 py-px font-mono text-[6px] text-[#7dd3fc]">
                    {t}
                  </span>
                ))}
              </div>
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
    case "skills":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {skillGroups.map((g) => (
            <div key={g.category} className="rounded border border-white/10 bg-white/5 p-1.5">
              <div className="font-mono text-[7px] tracking-[0.15em] text-[#ffd700]/80">
                {g.category.toUpperCase()}
              </div>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {g.skills.map((s) => (
                  <span key={s} className="rounded bg-white/8 px-1 py-px text-[7px] text-[#c9c6d0]">
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
    case "contact":
      return (
        <div className="flex items-stretch gap-2">
          <div className="flex flex-1 flex-col items-center justify-center rounded border border-[#ffd700]/30 bg-[#ffd700]/5 p-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd700] font-black text-black" style={{ fontSize: "11px" }}>
              SP
            </div>
            <div className="mt-1 text-[11px] font-black text-white">Contact Me</div>
            <div className="mt-0.5 font-mono text-[6.5px] tracking-[0.2em] text-[#7dd3fc]">
              LET&apos;S BUILD TOGETHER
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1">
            <div className="rounded border border-white/10 bg-white/5 p-1.5 text-[7.5px] text-[#a8a5b0]">
              <div className="truncate">{profile.email}</div>
              <div>{profile.phone}</div>
              <div className="mt-0.5 text-[#8f8c99]">{profile.place}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(
                [
                  { label: "LINKEDIN", url: profile.socialLinks.linkedin },
                  { label: "GITHUB", url: profile.socialLinks.github },
                  { label: "X / TWITTER", url: profile.socialLinks.twitter },
                  { label: "WHATSAPP", url: profile.socialLinks.whatsapp },
                ] as { label: string; url: string }[]
              ).map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-white/10 bg-white/5 py-1 text-center font-mono text-[6px] tracking-[0.1em] text-white transition-colors hover:border-[#ffd700]/50 hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      );
  }
}
