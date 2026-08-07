"use client";

import type { ExperienceItem } from "@/lib/types";
import { useFetch } from "@/lib/useFetch";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { BriefcaseIcon } from "../icons";

export function Experience() {
  const {
    data: experience,
    loading,
    error,
  } = useFetch<ExperienceItem[]>("/api/experience");

  if (error) {
    return (
      <section id="experience" className="scroll-mt-24 px-4 sm:px-6">
        <p className="text-accent-dim">Failed to load experience.</p>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="professional_experience"
          title="Experience"
          description="Every role is a story — what I did, what I learned, and the technologies behind it."
        />

        <ol className="relative flex flex-col gap-8 border-l-2 border-white/10 pl-8">
          {(loading ? [null] : (experience ?? [])).map((item, index) => (
            <Reveal key={item?.id ?? index} delay={index * 0.1}>
              {item ? (
                <li className="group relative">
                  <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent bg-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>

                  <div className="rounded-2xl border border-white/10 bg-panel p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/50 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 text-accent">
                        <BriefcaseIcon className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="font-bold text-white">{item.role}</h3>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted">
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-accent-dim">
                      {item.company}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted">
                      {item.startDate} – {item.endDate}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li className="h-40 animate-pulse rounded-2xl border border-white/10 bg-panel" />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
