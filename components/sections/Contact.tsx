"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { profile } from "@/lib/data";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
} from "../icons";

type Status = { type: "idle" | "loading" | "success" | "error"; text: string };

const inputClasses =
  "neo-inset w-full rounded-xl border border-white/5 bg-ink px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-accent";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle", text: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (honeypot) {
      // Silent discard for bots
      setStatus({ type: "success", text: "Message sent! I will get back to you soon." });
      return;
    }

    setStatus({ type: "loading", text: "Sending..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, honeypot }),
      });
      const body = (await res.json()) as {
        success: boolean;
        error?: string;
        mailto?: string;
      };

      if (res.ok && body.success) {
        if (body.mailto) {
          window.location.href = body.mailto;
        }
        setStatus({
          type: "success",
          text: body.mailto
            ? "Opening your email app with the message ready — just hit send."
            : "Message sent! I will get back to you soon.",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus({
          type: "error",
          text: body.error ?? "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({ type: "error", text: "Network error. Please try again." });
    }
  }

  const directLinks = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      Icon: MailIcon,
    },
    {
      label: "GitHub",
      value: "ShreyasP10",
      href: profile.socialLinks.github,
      Icon: GitHubIcon,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/shreyaspawar10",
      href: profile.socialLinks.linkedin,
      Icon: LinkedInIcon,
    },
  ];

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="contact_me"
          title="Let's Build Something Together"
          description="Have a project, an internship opportunity, or just want to talk tech? My inbox is always open."
        />

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-ink font-mono text-xl font-bold text-accent">
                  SP
                </span>
                <div>
                  <p className="font-bold text-white">{profile.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted">
                    <MapPinIcon className="h-3.5 w-3.5" />
                    {profile.place}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {directLinks.map(({ label, value, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:-translate-y-0.5 hover:border-accent/60"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/40 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-white transition-colors group-hover:text-accent">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <p className="mt-auto text-sm text-muted">
              Open to internships, hackathons & freelance projects
            </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            >
              {/* Anti-spam Honeypot Field */}
              <input
                type="text"
                name="website_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                  Name
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputClasses}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClasses}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                Message
                <textarea
                  required
                  minLength={10}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project or opportunity..."
                  className={`${inputClasses} resize-y`}
                />
              </label>

              <button
                type="submit"
                disabled={status.type === "loading"}
                className="neo-raised cursor-pointer rounded-xl bg-panel px-6 py-3 text-sm font-bold text-accent transition-all active:neo-pressed hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {status.type === "loading" ? "Sending..." : "Send Message"}
              </button>

              {status.type === "success" && (
                <p className="text-sm font-semibold text-accent">
                  {status.text}
                </p>
              )}
              {status.type === "error" && (
                <p className="text-sm font-semibold text-red-400">
                  {status.text}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
