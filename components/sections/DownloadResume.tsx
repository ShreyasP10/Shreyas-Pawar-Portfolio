"use client";

import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function DownloadResume() {
  return (
    <section
      id="resume"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Download Resume"
          description="One page, all the essentials — education, experience, hackathons, projects, certifications and skills."
        />

        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border-2 border-accent/40 bg-panel p-10 text-center sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(255,215,0,0.08), transparent 70%)",
              }}
            />
            <div className="relative">
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                Prefer a PDF? Grab the latest version of my resume — it is
                always in sync with the projects and experience on this site.
              </p>
              <a
                href="/resume/Shreyas%20Pawar%20Resume.pdf"
                download
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[#ffd700] bg-[#ffd700]/10 px-8 py-3 font-mono text-[12px] tracking-[0.3em] text-[#ffd700] transition-all hover:bg-[#ffd700] hover:text-black hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]"
              >
                DOWNLOAD RESUME
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                >
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
                </svg>
              </a>
              <p className="mt-5 font-mono text-[10px] tracking-[0.25em] text-[#5f5c69]">
                PDF · A4 · UPDATED REGULARLY
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
