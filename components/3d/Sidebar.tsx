"use client";

import Link from "next/link";
import { useUIStore } from "./store";
import { profile } from "@/lib/data";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

function Icon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <path d="M3 11.5 12 4l9 7.5M5 10v10h14V10" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" />
        </svg>
      );
    case "briefcase":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <rect x="3" y="7" width="18" height="12" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 13 9 5 9-5" />
        </svg>
      );
    case "trophy":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 5H4v1a4 4 0 0 0 4 4M16 5h4v1a4 4 0 0 1-4 4M12 13v4M8 20h8M9 21h6" />
        </svg>
      );
    case "grad":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <path d="m2 9 10-5 10 5-10 5L2 9Z" />
          <path d="M6 11v4c0 1.5 2.5 3 6 3s6-1.5 6-3v-4M22 9v5" />
        </svg>
      );
    case "git":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="9" r="2.5" />
          <path d="M6 8.5v7M8.5 6h5a4.5 4.5 0 0 1 4.5 4.5" />
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <rect x="7" y="3" width="10" height="18" rx="2.5" />
          <path d="M11 18h2" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16M4 12h16" />
        </svg>
      );
    case "tv":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M8 2.5 12 6l4-3.5M8 19v2.5M16 19v2.5" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </svg>
      );
    case "back":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" {...common}>
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      );
    default:
      return null;
  }
}

export function Sidebar() {
  const target = useUIStore((s) => s.target);
  const activeDevice = useUIStore((s) => s.activeDevice);
  const laptopTab = useUIStore((s) => s.laptopTab);
  const tabletTab = useUIStore((s) => s.tabletTab);
  const tvTab = useUIStore((s) => s.tvTab);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const go = useUIStore((s) => s.go);
  const openDevice = useUIStore((s) => s.openDevice);

  const items: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: "home",
      active: target === "wall",
      onClick: () => go("wall"),
    },
    {
      id: "hero",
      label: "Hero",
      icon: "user",
      active: activeDevice === "laptop" && laptopTab === "home",
      onClick: () => openDevice("laptop", "home"),
    },
    {
      id: "laptop-skills",
      label: "Skills",
      icon: "layers",
      active: activeDevice === "laptop" && laptopTab === "skills",
      onClick: () => openDevice("laptop", "skills"),
    },
    {
      id: "featured",
      label: "Projects",
      icon: "code",
      active: activeDevice === "tablet" && tabletTab === "projects",
      onClick: () => openDevice("tablet", "projects"),
    },
    {
      id: "hackathons",
      label: "Hackathons",
      icon: "trophy",
      active: activeDevice === "tv" && tvTab === "hackathons",
      onClick: () => openDevice("tv", "hackathons"),
    },
    {
      id: "experience",
      label: "Experience",
      icon: "briefcase",
      active: activeDevice === "tv" && tvTab === "experience",
      onClick: () => openDevice("tv", "experience"),
    },
    {
      id: "contact",
      label: "Contact",
      icon: "contact",
      active: activeDevice === "phone",
      onClick: () => openDevice("phone"),
    },
  ];

  return (
    <div className="fixed left-4 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-2">
      <div className="thin-scroll flex max-h-[calc(100vh-3rem)] flex-col gap-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-2 shadow-[0_0_40px_rgba(255,215,0,0.06)] backdrop-blur-xl">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center self-center rounded-xl bg-[#ffd700] text-black transition-transform hover:scale-105"
          aria-label="Shreyas Pawar — home"
          title="SP"
        >
          <span className="text-[11px] font-black tracking-tight">SP</span>
        </Link>

        <button
          onClick={() => go("overview")}
          title="Room view"
          aria-label="Room view"
          className={`flex h-8 w-full items-center gap-2.5 self-start rounded-lg border px-2.5 font-mono text-[10px] tracking-[0.15em] transition-colors ${
            target === "overview"
              ? "border-[#ffd700] bg-[#ffd700]/15 text-[#ffd700]"
              : "border-transparent text-[#8f8c99] hover:border-white/15 hover:bg-white/5 hover:text-[#ffd700]"
          }`}
        >
          <Icon name="camera" />
          <span className="hidden md:inline">ROOM VIEW</span>
        </button>

        <div className="my-1 h-px self-stretch bg-white/10" />

        <nav className="flex flex-col gap-0.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              title={item.label}
              aria-label={item.label}
              className={`flex h-8 w-full items-center gap-2.5 rounded-lg border px-2.5 font-mono text-[10px] tracking-[0.15em] transition-all ${
                item.active
                  ? "border-[#7dd3fc]/70 bg-[#7dd3fc]/10 text-[#7dd3fc] shadow-[0_0_18px_rgba(125,211,252,0.45),inset_0_0_10px_rgba(125,211,252,0.15)]"
                  : "border-transparent text-[#8f8c99] hover:border-white/15 hover:bg-white/5 hover:text-[#ffd700]"
              }`}
            >
              <Icon name={item.icon} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="my-1 h-px self-stretch bg-white/10" />

        <div className="flex items-center justify-center gap-1 self-center">
          <a
            href={profile.socialLinks.github}
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            aria-label="GitHub"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8f8c99] transition-colors hover:bg-white/5 hover:text-[#ffd700]"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>
          <a
            href={profile.socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8f8c99] transition-colors hover:bg-white/5 hover:text-[#ffd700]"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z" />
            </svg>
          </a>
          <a
            href={`mailto:${profile.email}`}
            title="Email"
            aria-label="Email"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8f8c99] transition-colors hover:bg-white/5 hover:text-[#ffd700]"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>

        <div className="my-1 h-px self-stretch bg-white/10" />

        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Settings"
          title="Settings"
          className={`flex h-8 w-full items-center justify-center gap-2 rounded-lg border font-mono text-[10px] tracking-[0.15em] transition-colors ${
            settingsOpen
              ? "border-[#ffd700] bg-[#ffd700]/15 text-[#ffd700]"
              : "border-transparent text-[#8f8c99] hover:border-white/15 hover:bg-white/5 hover:text-[#ffd700]"
          }`}
        >
          <Icon name="settings" />
          <span className="hidden md:inline">SETTINGS</span>
        </button>
      </div>

      <Link
        href="/"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-[#8f8c99] backdrop-blur-xl transition-colors hover:border-[#ffd700]/40 hover:text-[#ffd700]"
        aria-label="Back to portfolio"
        title="Back to portfolio"
      >
        <Icon name="back" />
      </Link>
    </div>
  );
}
