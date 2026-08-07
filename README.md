# Shreyas Pawar — Developer Portfolio

Modern portfolio for Shreyas Pawar built with Next.js (App Router), TypeScript, Tailwind CSS and Framer Motion. Dark `#0A0A0A` theme with a gold `#FFD700` accent, organized into scrollable sections: Hero (animated roles + stats) → Featured Projects → Hackathon Achievements → Experience → Skills & Tech Stack → Journey timeline → Open Source → Certifications → FAQ → Contact.

The site also ships a second experience: a **cinematic 3D workspace** (React Three Fiber) where the portfolio is explored through a physical room — see the "3D Workspace" section below.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first theme in `app/globals.css`)
- **Animations:** Framer Motion — scroll reveals, typewriter hero roles, count-up stats, 3D tilt + cursor spotlight on cards, scroll progress bar, FAQ accordion, tech-stack marquee
- **3D:** `three` (pinned `0.182.0`), `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `zustand`
- **Backend:** Next.js Route Handlers (BFF pattern) in `app/api/*`
- **Email:** Resend (optional, via `RESEND_API_KEY`)

## Getting Started

Prerequisites: Node.js 20.9+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The 3D workspace lives at [http://localhost:3000/3d](http://localhost:3000/3d) (also linked from the navbar — "3D Portfolio" button).

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start development server             |
| `npm run build`  | Production build (Turbopack)         |
| `npm run start`  | Serve production build               |
| `npm run lint`   | Run ESLint                           |

## Environment Variables

Create `.env.local` (only needed for live email delivery):

```
RESEND_API_KEY=re_...
CONTACT_EMAIL=shreyas@example.com
```

Without `RESEND_API_KEY`, `POST /api/contact` validates the payload and logs the message server-side — the site works fully without any env vars.

## Updating Content

All site content lives in `lib/data.ts` — profile, bio, education, certifications, skills, projects, experience, hackathons, milestones, stats, tech stack, FAQs and social links. The UI (both the 2D site and the 3D device screens) fetches it through the same data file, so no component changes are needed. To use a photo, set `profile.photoUrl` in `lib/data.ts` (or drop an image in `public/` and reference `/your-image.jpg`).

## API Routes

| Method | Route              | Description                                   |
| ------ | ------------------ | --------------------------------------------- |
| GET    | `/api/profile`     | Hero info (name, email, social links)         |
| GET    | `/api/projects`    | Project list (Featured Projects, Open Source) |
| GET    | `/api/experience`  | Work experience timeline                      |
| GET    | `/api/hackathons`  | Hackathon achievements                        |
| GET    | `/api/about`       | Skills, certifications                        |
| POST   | `/api/contact`     | Contact form → validates → sends email        |

---

# 3D Workspace (`/3d`)

A cinematic room-scale portfolio built with React Three Fiber. The camera starts **outside the room's door** — a dark wooden door with a gold "SHREYAS PAWAR" nameplate. The door swings open and the camera flies through the doorway into the room ("you just walked into the studio"), then moves to the wall showing the SHREYAS PAWAR typography, then explores the portfolio by flying between the physical devices on the desk and the TV showcase. Modeled after the reference concept render (dark room, LED strips, window with night city, pegboard, bookshelf with glowing clock, desk-centered devices).

## Navigation & Controls

| Input                    | Action                                             |
| ------------------------ | -------------------------------------------------- |
| **Scroll down / up**     | Cycle views sequentially: Door → Entry → Wall → Overview → TV → Laptop → Tablet → Phone |
| **Swipe** (touch)        | Same as scroll (≥ 40px swipe, 650 ms cooldown)     |
| **← / → arrow keys**     | Cycle views with wrap-around                       |
| **Esc**                  | Close device screen panels / settings modal        |
| **Click a device**       | Open it and fly the camera to its screen           |
| **Sidebar menu**         | Jump to any view (Home, About Me, Experience, Projects, Skills, Achievements, Education, Open Source, Showcase, Blog, Contact) |
| **Room View** (sidebar)  | Wide overview of the whole room                    |
| **Settings** (sidebar)   | Toggle sound, gold dust particles, reduced motion  |

A gold progress rail on the right edge shows the current position in the view sequence.

## Scene Layout (Y-up, Z-forward, 1 unit ≈ 1 m)

- **Room:** 10 × 9 m, matte walls, dark floor, ceiling + baseboard LED strips (`#FFB347`), exterior door slab outside the west wall.
- **Door (entry point):** west wall, dark wooden door (~1.15 × 2.25 m) with a gold **SHREYAS PAWAR** nameplate. The west wall has a real doorway gap; the leaf swings inward on load, and the camera flies through the opening to the entry view.
- **Window:** north wall — night-city skyline canvas, glass pane, black frame, curtains that sway, and a cool moonlight point light.
- **Desk:** centered at `(0, 0.78, -7.6)`, 5.4 × 2 m walnut, dark desk mat, warm LED strip along the back edge with spill light.
- **Laptop (primary hub):** desk center `(0, 0.835, -7.4)`, screen tilted back ~110°; hosts the main app (home, about, projects, skills, achievements, open source, resume, blog).
- **Keyboard + RGB mouse:** in front of the laptop — keyboard with hue-cycling RGB underglow, mouse with a breathing RGB dot.
- **Tablet (experience dashboard):** right of the laptop `(1.8, 1.0, -7.3)`, **portrait** on a kickstand, rotated **45° toward the laptop**; hosts Work / Education / Timeline / Research / Certifications.
- **Phone (contact):** left of the laptop `(-1.9, 0.81, -7.1)`, portrait on a stand, rotated **45° toward the laptop**; hosts contact card, socials grid (LinkedIn, GitHub, X, Instagram, WhatsApp), a real scannable GitHub QR code and Download CV.
- **TV (showcase):** south wall — a wall-mounted OLED screen with a gold LED bar over a console cabinet (books, framed photo, bear), hosting the live showcase (Projects / Experience / Hackathons / Open Source / Certs).
- **Props:** "CODE·BUILD·REPEAT" mug (steam), notebook + pen, pen cup, earbuds case, USB hub with blue ports, corner plant, window plant, carpet under the floor lamp, and an office chair in front-left of the desk (idle rotation after 20 s of inactivity). The west wall holds a pegboard (headphones + plant), a floor bookshelf (books, Raspberry Pi, GPU box, trophy, glowing "10:30 PM" clock) and 8 colored **sticky notes** (blog preview on hover, click opens the laptop blog). The east wall shows two **certificate plates** under a vertical LED accent.
- **Wall landing board:** gold-framed panel raised mid-wall on the north wall (clearly above the window and desk) with SHREYAS PAWAR typography dead-centered on the board, the four roles (`Software Engineer · AI Developer · Full Stack Developer · Innovator`), the intro line ("Building intelligent software that solves real-world problems using AI, Cloud and Modern Web Technologies.") and tag chips (Problem Solver / Tech Enthusiast / Lifelong Learner / Open Source). Fades out when the camera leaves the wall view.

## Device Screens

The screens are not textures — each device anchors a real React UI through drei's `<Html>` component (anchored exactly at the screen center of the rotated device). Content is driven by `lib/data.ts`. Panels pop in with a 260 ms scale/fade animation when opened.

## Camera Choreography

`components/3d/CameraRig.tsx` moves the camera with a **damped spring** (velocity + damping, `k=11 c=4.4` for position, `k=14 c=4.8` for look-at) — a GSAP-style ease with a subtle cinematic overshoot instead of a plain exponential lerp. Each device view is positioned along that device's screen face-normal, ~3.3–4.2 m away, so the screen is front-and-center (the camera aims exactly at the screen center) while 20–30% of the surrounding room (desk, LED strip, chair, shelf) stays visible. Views scale down on small viewports.

## Ambient Life (idle details)

- **Mug steam:** six soft wisps rise from the "CODE·BUILD·REPEAT" mug with sine drift, looping continuously (disabled with reduced motion).
- **Plant sway:** the pegboard plant gently sways (rotation wobble, ~0.5 Hz).
- **Lamp flicker:** the floor lamp's point light flickers subtly (two-tone sine at 41.7/23.3 Hz, ±5%).
- **Curtain sway:** the window curtains sway gently (rotation wobble, ~0.35 Hz).
- **Keyboard + mouse RGB:** the keyboard underglow and mouse dot hue-cycle and pulse (disabled with reduced motion).
- **Device hover glow:** hovering any device raises a soft cyan point light and an additive floor ring, damped in/out.
- **Sidebar glow:** the active menu item glows cyan (`#7dd3fc` shadow + inset).
- The phone's "Scan for my GitHub" glyph is a **real QR code** (`qrcode` lib) encoding `profile.socialLinks.github`.
- **Sticky notes:** hovering a note on the west wall shows a blog preview; clicking it opens the laptop's blog tab.

## Lighting & Post-Processing

- Ambient + hemisphere light, warm key light with soft shadows (PCFShadowMap), warm and violet point lights, orange LED-strip spill (desk + ceiling + baseboards), emissive lamp, clock, moonlit window and TV accent lights.
- `EffectComposer` with **SSAO** (`enableNormalPass`), **Bloom** (mipmap blur) and **Vignette**.

## Performance & Compatibility Notes

- `three` is pinned to `0.182.0` — `THREE.Clock` is deprecated from r183 and R3F instantiates it internally.
- Shadows use `type: PCFShadowMap` explicitly — `PCFSoftShadowMap` is deprecated and warns per frame.
- `data-scroll-behavior="smooth"` is set on `<html>` to avoid smooth-scroll jank during route transitions.
- `prefers-reduced-motion` disables camera damping, dust and chair idle motion; gold dust can also be toggled in Settings.

## 3D File Map

```
app/3d/page.tsx                Route: scene mount + scroll/arrow/Esc navigation
components/3d/Experience.tsx   Canvas, lights, scene composition, post-processing
components/3d/Room.tsx         Room shell, desk, LED strips, window + curtains, door, bookshelf, sticky notes, certs wall, wall landing board
components/3d/Devices.tsx      Laptop/tablet/phone/TV models, hover + click, screen anchors
components/3d/Screens.tsx      DOM UIs rendered inside each device screen
components/3d/CameraRig.tsx    Cinematic damped camera targets
components/3d/Sidebar.tsx      Glass sidebar: menu, room view, socials, settings
components/3d/Overlays.tsx     Loading screen, landing overlay, HUD, scroll rail, settings modal
components/3d/Dust.tsx         Gold dust particle field (seeded PRNG, additive blending)
components/3d/Lights.tsx       Ambient/key/accent lights with shadows
components/3d/materials.ts     Procedural canvas textures (wood, brushed metal, fabric, speckle, plaster, floor planks)
components/3d/store.ts         Zustand store: target, device tabs, sound/particles/motion settings
components/3d/sound.ts         WebAudio blips for UI interactions
```

## Documentation

The full project documentation suite lives in `docs/`:

| Doc | Covers |
| --- | --- |
| [`00-charter-and-roadmap.md`](docs/00-charter-and-roadmap.md) | Project charter, success metrics, risks, roadmap, change history |
| [`01-requirements.md`](docs/01-requirements.md) | PRD, FRD, NFRD, SRS (stack, compatibility constraints, env vars) |
| [`02-sds-and-architecture.md`](docs/02-sds-and-architecture.md) | System design, 3D scene spec, camera math, navigation, state |
| [`03-erd-and-data-model.md`](docs/03-erd-and-data-model.md) | ERD, type definitions, seed content, DB migration path |
| [`04-api-spec.md`](docs/04-api-spec.md) | Endpoints, contact form behavior, error conventions |
| [`05-trd-and-tdd.md`](docs/05-trd-and-tdd.md) | Test plan: unit, E2E, performance, manual QA checklist |
| [`06-incident-and-postmortem.md`](docs/06-incident-and-postmortem.md) | Incident reports (SSAO, DOF, deprecations, room geometry) + postmortem |
| [`07-developer-guide.md`](docs/07-developer-guide.md) | Local setup, scene editing ground rules, verification loop |
| [`08-maintenance-guide.md`](docs/08-maintenance-guide.md) | Content updates, dependency discipline, rollback, calendar |

## Project Structure

```
app/            Routing, pages, API route handlers
app/api/        Backend endpoints (BFF)
components/     2D site components (Navbar, Hero, Footer, sections)
components/3d/  3D workspace (scene, devices, overlays, store)
lib/data.ts     All portfolio content (single source of truth)
lib/types.ts    Shared TypeScript types
lib/useFetch.ts Lightweight fetch hook (loading/error states)
```

## Deployment

Deploy to Vercel by importing this repository. No build configuration is needed. Contact-form email only requires setting `RESEND_API_KEY` and `CONTACT_EMAIL` in the Vercel project's environment variables.

> The 3D workspace is being developed on the `3d-workspace` branch.
