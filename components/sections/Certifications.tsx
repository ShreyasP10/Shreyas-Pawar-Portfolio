"use client";

import { useFetch } from "@/lib/useFetch";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { AwardIcon } from "../icons";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  issued: string;
}

export function Certifications() {
  const {
    data: about,
    loading,
    error,
  } = useFetch<{ certifications: Certification[] }>("/api/about");

  if (error) {
    return (
      <section id="certifications" className="scroll-mt-24 px-4 sm:px-6">
        <p className="text-accent-dim">Failed to load certifications.</p>
      </section>
    );
  }

  const certifications = about?.certifications ?? [];

  return (
    <section
      id="certifications"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="certifications"
          title="Certifications"
          description="Continuous learning — validated by industry programs and structured courses."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {(loading ? [] : certifications).map((cert, index) => (
            <Reveal key={cert.id} delay={index * 0.08}>
              <article className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/40 text-accent">
                  <AwardIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white transition-colors group-hover:text-accent">
                    {cert.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-accent-dim">
                    Issued {cert.issued}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
