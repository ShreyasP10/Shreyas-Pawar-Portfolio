import {
  GitHubIcon,
  InstagramIcon,
  LeetCodeIcon,
  LinkedInIcon,
} from "./icons";

export function Footer() {
  const socials = [
    { label: "GitHub", href: "https://github.com/ShreyasP10", Icon: GitHubIcon },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/shreyaspawar10/",
      Icon: LinkedInIcon,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/shreyas_p10",
      Icon: InstagramIcon,
    },
    {
      label: "LeetCode",
      href: "https://leetcode.com/u/ShreyasP10",
      Icon: LeetCodeIcon,
    },
  ];

  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <p className="font-mono text-sm font-bold text-accent">
          ShreyasPawar<span className="text-white">.Dev</span>
        </p>

        <div className="flex items-center gap-3">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_0_16px_rgba(255,215,0,0.25)]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Shreyas Pawar · Built with Next.js · Updated Sep 2026
        </p>
      </div>
    </footer>
  );
}
