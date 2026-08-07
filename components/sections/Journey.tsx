"use client";

import { milestones } from "@/lib/data";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { AwardIcon, BookOpenIcon, BriefcaseIcon, RocketIcon } from "../icons";

const typeMeta = {
  education: { Icon: BookOpenIcon, label: "Education" },
  competition: { Icon: AwardIcon, label: "Competition" },
  internship: { Icon: BriefcaseIcon, label: "Internship" },
  hackathon: { Icon: RocketIcon, label: "Hackathon" },
} as const;

export function Journey() {
  return (
    <section
      id="journey"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="timeline"
          title="My Journey"
          description="From a first-year diploma student to shipping prototypes at national hackathons — every step in one timeline."
        />

        <ol className="relative flex flex-col gap-8 border-l-2 border-white/10 pl-8">
          {milestones.map((milestone, index) => {
            const { Icon, label } = typeMeta[milestone.type];
            return (
              <Reveal key={milestone.id} delay={index * 0.1}>
                <li className="group relative">
                  <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent bg-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>

                  <div className="rounded-2xl border border-white/10 bg-panel p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/50 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 text-accent">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="font-bold text-white">{milestone.title}</h3>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted">
                        {label}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-accent-dim">
                      {milestone.place}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted">
                      {milestone.period}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {milestone.description}
                    </p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
