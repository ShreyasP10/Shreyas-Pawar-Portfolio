"use client";

import type { SkillGroup } from "@/lib/types";
import { useFetch } from "@/lib/useFetch";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { techStack } from "@/lib/data";
import { CodeIcon } from "../icons";

export function Skills() {
  const {
    data: about,
    loading,
    error,
  } = useFetch<{ skillGroups: SkillGroup[] }>("/api/about");

  if (error) {
    return (
      <section id="skills" className="scroll-mt-24 px-4 sm:px-6">
        <p className="text-accent-dim">Failed to load skills.</p>
      </section>
    );
  }

  const groups = about?.skillGroups ?? [];

  return (
    <section
      id="skills"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="skills"
          title="Skills"
          description="Grouped by category so recruiters can scan fast — languages, frameworks, data science and cloud/mobile."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {(loading ? [] : groups).map((group, index) => (
            <Reveal key={group.category} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-panel p-6 transition-colors hover:border-accent/40">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 text-accent">
                    <CodeIcon className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="font-bold text-white">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-white/10 bg-panel p-6">
            <h3 className="mb-4 font-mono text-sm font-semibold text-accent">
              daily_drivers
            </h3>
            <div className="overflow-hidden">
              <div className="marquee-track flex w-max">
                {[...techStack, ...techStack].map((tool, index) => (
                  <span
                    key={`${tool}-${index}`}
                    className="whitespace-nowrap pr-3"
                  >
                    <span className="rounded-lg border-2 border-accent/40 px-3 py-1 font-mono text-xs text-accent">
                      {tool}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
