"use client";

import Link from "next/link";
import { useUIStore } from "./store";

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
  const tabletTab = useUIStore((s) => s.tabletTab);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const go = useUIStore((s) => s.go);
  const openDevice = useUIStore((s) => s.openDevice);

  const items: MenuItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: "camera",
      active: target === "overview" || target === "wall",
      onClick: () => go("overview"),
    },
    {
      id: "projects",
      label: "Projects",
      icon: "code",
      active: activeDevice === "laptop" || activeDevice === "tablet",
      onClick: () => openDevice("laptop", "home"),
    },
    {
      id: "experience",
      label: "Experience",
      icon: "briefcase",
      active: tabletTab === "journey" && activeDevice === "tablet",
      onClick: () => openDevice("tablet", "projects"),
    },
    {
      id: "showcase",
      label: "Showcase",
      icon: "tv",
      active: activeDevice === "tv",
      onClick: () => openDevice("tv", "hackathons"),
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
    <div className="fixed left-3 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-2 sm:flex">
      <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/60 p-1.5 backdrop-blur-xl">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black"
          aria-label="Home"
          title="Portfolio"
        >
          <span className="text-[11px] font-black">SP</span>
        </Link>

        <div className="my-1 h-px bg-white/10" />

        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              title={item.label}
              aria-label={item.label}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2 ${
                item.active
                  ? "border-[#ffd700] bg-[#ffd700] text-black"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon name={item.icon} />
              <span className="hidden lg:inline font-mono text-[10px] font-bold tracking-[0.15em]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="my-1 h-px bg-white/10" />

        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Settings"
          title="Settings"
          className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-colors sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2 ${
            settingsOpen
              ? "border-white/20 bg-white text-black"
              : "border-white/10 bg-white/5 text-white/40 hover:text-white"
          }`}
        >
          <Icon name="settings" />
          <span className="hidden lg:inline font-mono text-[10px] tracking-[0.15em]">SETTINGS</span>
        </button>
      </div>

      <Link
        href="/"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/40 backdrop-blur transition-colors hover:text-white"
        aria-label="Back"
        title="Back to portfolio"
      >
        <Icon name="back" />
      </Link>
    </div>
  );
}
