"use client";

import type { Hackathon } from "@/lib/types";
import { useFetch } from "@/lib/useFetch";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { TiltCard } from "../TiltCard";
import { AwardIcon, ExternalLinkIcon } from "../icons";

export function Hackathons() {
  const {
    data: hackathons,
    loading,
    error,
  } = useFetch<Hackathon[]>("/api/hackathons");

  if (error) {
    return (
      <section id="hackathons" className="scroll-mt-24 px-4 sm:px-6">
        <p className="text-accent-dim">Failed to load hackathons.</p>
      </section>
    );
  }

  return (
    <section
      id="hackathons"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="hackathon_achievements"
          title="Hackathon Achievements"
          description="Shipped end-to-end prototypes against tight deadlines — ISRO SAC, Google Cloud Gen AI Academy and AWS AI for Bharat, plus a state-level project competition."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {(loading ? [null, null, null, null] : (hackathons ?? [])).map(
            (item, index) => (
              <Reveal key={item?.id ?? index} delay={index * 0.08}>
                {item ? (
                  <div className="h-full [perspective:1000px]">
                    <TiltCard>
                      <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-panel p-6 transition-colors duration-300 hover:border-accent/60">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 text-accent">
                            <AwardIcon className="h-4.5 w-4.5" />
                          </span>
                          <div>
                            <h3 className="font-bold text-white transition-colors group-hover:text-accent">
                              {item.title}
                            </h3>
                            <p className="font-mono text-[11px] text-muted">
                              {item.event}
                            </p>
                          </div>
                          <span className="ml-auto shrink-0 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted">
                            {item.year}
                          </span>
                        </div>

                        <p className="flex-1 text-sm leading-relaxed text-muted">
                          {item.outcome}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.githubUrl && (
                            <a
                              href={item.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-accent"
                            >
                              <ExternalLinkIcon className="h-3.5 w-3.5" />
                              Details
                            </a>
                          )}
                        </div>
                      </article>
                    </TiltCard>
                  </div>
                ) : (
                  <div className="h-52 animate-pulse rounded-2xl border border-white/10 bg-panel" />
                )}
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}
