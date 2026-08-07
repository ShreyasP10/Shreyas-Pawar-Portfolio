"use client";

import type { Project } from "@/lib/types";
import { useFetch } from "@/lib/useFetch";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { TiltCard } from "../TiltCard";
import { ExternalLinkIcon, GitHubIcon } from "../icons";

const placeholderGradients = [
  "from-yellow-500/25 via-yellow-400/10 to-transparent",
  "from-yellow-600/25 via-yellow-500/15 to-transparent",
  "from-amber-400/25 via-yellow-600/10 to-transparent",
];

export function FeaturedProjects() {
  const { data: projects, loading, error } = useFetch<Project[]>("/api/projects");

  if (error) {
    return (
      <section id="projects" className="scroll-mt-24 px-4 sm:px-6">
        <p className="text-accent-dim">Failed to load projects.</p>
      </section>
    );
  }

  return (
    <section id="projects" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="featured_projects"
          title="Featured Projects"
          description="Real-world applications built end-to-end — from encrypted messaging to satellite imagery AI. The emphasis is on outcomes, not just features."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(loading ? [null, null, null] : (projects ?? []).slice(0, 6)).map(
            (project, index) => (
              <Reveal key={project?.id ?? index} delay={index * 0.08}>
                {project ? (
                  <div className="h-full [perspective:1000px]">
                    <TiltCard>
                      <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-panel p-5 transition-colors duration-300 hover:border-accent/60">
                        <div
                          className={`mb-4 flex h-36 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${placeholderGradients[index % placeholderGradients.length]}`}
                        >
                          <span className="font-mono text-sm font-bold text-accent/80">
                            {String(index + 1).padStart(2, "0")} /{" "}
                            {project.title}
                          </span>
                        </div>

                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="font-bold text-white transition-colors group-hover:text-accent">
                            {project.title}
                          </h3>
                          <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted">
                            {project.year}
                          </span>
                        </div>

                        {project.highlight && (
                          <p className="mb-2 font-mono text-xs font-semibold text-accent-dim">
                            ★ {project.highlight}
                          </p>
                        )}

                        <p className="mb-4 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
                          {project.description}
                        </p>

                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-accent"
                          >
                            <GitHubIcon className="h-3.5 w-3.5" />
                            Code
                          </a>
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-accent"
                            >
                              <ExternalLinkIcon className="h-3.5 w-3.5" />
                              Demo
                            </a>
                          )}
                        </div>
                      </article>
                    </TiltCard>
                  </div>
                ) : (
                  <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-panel" />
                )}
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}
