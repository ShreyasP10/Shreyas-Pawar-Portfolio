"use client";

import { projects } from "@/lib/data";
import { useFetch } from "@/lib/useFetch";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { ExternalLinkIcon, GitHubIcon } from "../icons";

export function OpenSource() {
  const { data: githubStats } = useFetch<{ followers: number }>(
    "/api/github-stats"
  );

  const repos = projects.slice(0, 4);

  return (
    <section
      id="open-source"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="open_source"
          title="Open Source"
          description="Code-first development. Everything I build is public — explore the repositories, open issues, or contribute."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal>
            <a
              href="https://github.com/ShreyasP10"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between rounded-2xl border-2 border-accent/50 bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,215,0,0.15)]"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-ink font-mono text-lg font-bold text-accent">
                  SP
                </span>
                <div>
                  <p className="font-bold text-white transition-colors group-hover:text-accent">
                    ShreyasP10
                  </p>
                  <p className="font-mono text-xs text-muted">
                    github.com/ShreyasP10
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">
                {githubStats?.followers ?? 19} followers and growing — ML,
                mobile and full-stack projects with real-world use cases.
              </p>

              <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent">
                <GitHubIcon className="h-4 w-4" />
                Visit GitHub
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </p>
            </a>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            {repos.map((repo, index) => (
              <Reveal key={repo.id} delay={index * 0.06}>
                <a
                  href={repo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <GitHubIcon className="h-4 w-4 text-accent" />
                    <h3 className="truncate font-mono text-sm font-bold text-white transition-colors group-hover:text-accent">
                      {repo.title}
                    </h3>
                  </div>
                  <p className="mb-3 line-clamp-3 flex-1 text-xs leading-relaxed text-muted">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      {repo.tags[0]}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {repo.year}
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
