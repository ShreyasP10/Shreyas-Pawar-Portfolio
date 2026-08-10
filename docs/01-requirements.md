# Requirements Specification (PRD · FRD · NFRD · SRS)

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Last updated:** 2026-08-06

---

## 1. Product Requirements Document (PRD)

### 1.1 Product Overview
Two experiences, one content layer:

| Experience | Route | Purpose |
| --- | --- | --- |
| Standard portfolio | `/` | Fast, SEO-friendly, scroll-based info consumption |
| 3D workspace | `/3d` | Cinematic room-scale exploration; content rendered on device screens |

### 1.2 Personas
- **Recruiter / hiring manager** — quick facts, contact, resume.
- **Technical lead** — projects, open source, skills, certifications.
- **Design/3D enthusiast** — the 3D experience itself is a statement piece.

### 1.3 Feature List
| ID | Feature | Priority |
| --- | --- | --- |
| F-01 | Animated hero (typewriter roles, count-up stats) | P0 |
| F-02 | Sections: projects, hackathons, experience, skills, journey, open source, certifications, FAQ, contact | P0 |
| F-03 | 3D room: desk, chair, LED strips, pegboard, bookshelf, lamp, window, TV showcase, sticky notes | P0 |
| F-04 | 3D devices: laptop (primary hub), portrait tablet, phone | P0 |
| F-05 | Device screens as live React UIs (`drei Html`) fed by `lib/data.ts` | P0 |
| F-06 | Cinematic damped camera with per-view targets | P0 |
| F-07 | Navigation: scroll cycle, swipe, arrow keys, Esc, click devices, sidebar | P0 |
| F-08 | Settings: sound, gold dust particles, reduced motion | P1 |
| F-09 | Idle chair sway after 20 s inactivity | P2 |
| F-10 | Contact form → `/api/contact` (Resend optional) | P0 |

---

## 2. Functional Requirements Document (FRD)

### FR-01 2D site behavior
The hero must animate roles (typewriter) and stats (count-up). Project cards must have 3D tilt on hover and a cursor spotlight. Sections render from `lib/data.ts` via `lib/useFetch.ts` + API layer.

### FR-02 3D view sequence
Scrolling down/up must cycle views sequentially, **without wrapping**:
`door → entry → wall → overview → tv → laptop → tablet → phone` (reverse on scroll up). Arrow keys cycle with wrap-around. Esc closes open device panels/settings.

### FR-02a Door entry
The initial camera view must sit **outside the room's door** on the south wall, SE corner (aligned with the doorway, x 3.2…4.85). The door shows the owner's name (gold "SHREYAS PAWAR" nameplate). ~1.6 s after the loading screen clears the door opens automatically (leaf swings inward, rot.y −1.9 ≈ −109°) and the camera flies **through the doorway** to the entry view. A manual "OPEN THE DOOR" CTA on the door overlay triggers the same sequence. The south wall must have a real doorway gap so the camera path never clips geometry.

### FR-03 Camera choreography
Each device view positions the camera along that device's **screen face-normal**, ~3.3–4.2 m from the screen center, so the screen is front-and-center while 20–30% of the room (desk, LED strip, chair, shelf) remains visible. LOOK targets must equal the exact computed screen center of each device.

### FR-04 Device placement
- Laptop: `(0, 0.835, -6.9)`, lid open ~110°.
- Tablet: `(1.8, 0.995, -6.8)`, **portrait** on kickstand, yaw `-45°` facing the laptop.
- Phone: `(-1.9, 0.81, -6.6)`, portrait on stand, yaw `+45°` facing the laptop.
- Chair: `(-0.9, 0, -6.05)`, in front-left of the desk; gently sways after 20 s idle.

### FR-05 Wall landing board
Back wall panel must show `SHREYAS PAWAR` + the four roles (`Software Engineer · AI Developer · Full Stack Developer · Innovator`) **dead-centered on the board**, one-line intro ("Building intelligent software that solves real-world problems using AI, Cloud and Modern Web Technologies."), and the concept tag chips (Problem Solver / Tech Enthusiast / Lifelong Learner / Open Source); fades out (opacity 0, 700 ms) when the camera leaves the wall view.

### FR-06 Audio
UI interactions must produce short WebAudio blips when `soundOn` (tones: open 680 Hz, nav 520 Hz, tab 600 Hz, close 420 Hz, settings 640 Hz, toggle-on 880 Hz). No audio loops currently — ambient loop is a future enhancement.

### FR-07 Settings
Modal toggles: SOUND, GOLD DUST, REDUCED MOTION (reduced motion also auto-detected via `prefers-reduced-motion`).

### FR-08 Content parity
Both experiences must consume the same `lib/data.ts`; adding a project must update both the 2D section and the laptop screen with no component changes.

---

## 3. Non-Functional Requirements Document (NFRD)

| Category | Requirement |
| --- | --- |
| **Performance** | 2D LCP < 1.5 s (server components). 3D first frame < 2 s. 60 FPS desktop / 30+ FPS mobile. |
| **Responsiveness** | 2D fully responsive; 3D scales camera targets by `min(innerWidth/1400, innerHeight/900)` clamped to `[0.55, 1]`; sidebar collapses to icons < `sm`. |
| **Accessibility** | `prefers-reduced-motion: reduce` → instant camera teleports, no dust, no idle sway, no damping. Esc closes overlays. Keyboard navigation for all controls. |
| **Reliability** | No runtime errors on `postprocessing` v3 SSAO (requires `enableNormalPass`). `three` pinned to `0.182.0` (r183+ removed `THREE.Clock`). |
| **Security** | No secrets in client code. Contact payload validated server-side. |
| **Maintainability** | Single source of truth; typed models in `lib/types.ts`; zero-config deploys. |
| **Compatibility** | Next.js 16.3.0 (Turbopack), React 19.2.8, Node ≥ 20.9. |

---

## 4. Software Requirements Specification (SRS)

### 4.1 Stack
| Layer | Technology | Version |
| --- | --- | --- |
| Framework | Next.js (App Router, Turbopack) | 16.3.0 |
| UI | React / React DOM | 19.2.8 |
| Styling | Tailwind CSS (CSS-first, `app/globals.css`) | ^4 |
| Animation | Framer Motion | ^13 |
| 3D | three (pinned) | 0.182.0 |
| 3D React | @react-three/fiber | ^9.7.0 |
| Helpers | @react-three/drei | ^10.7.8 |
| Post-processing | @react-three/postprocessing | ^3.0.4 |
| State | zustand | ^5.0.14 |
| Types | @types/three | ^0.185.4 |
| Lint | ESLint + eslint-config-next | 9 / 16.3.0 |

### 4.2 Critical compatibility constraints
1. **`three` must stay pinned at `0.182.0`** — R3F internally instantiates `THREE.Clock`, which is deprecated from r183 and logs per-frame warnings/errors. Never run `npm update three`.
2. **Shadows must be `PCFShadowMap`** — the boolean `shadows` Canvas prop selects deprecated `PCFSoftShadowMap`; set `shadows={{ type: THREE.PCFShadowMap }}` explicitly.
3. **SSAO requires `enableNormalPass`** on `EffectComposer` (postprocessing v3).
4. **`data-scroll-behavior="smooth"`** is set on `<html>` (in `app/layout.tsx`) to prevent smooth-scroll jank during route transitions in Next 16.

### 4.3 Environment variables
| Var | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | No | Live email delivery for contact form |
| `CONTACT_EMAIL` | No | Recipient for contact form |

Without `RESEND_API_KEY`, `POST /api/contact` validates payload and logs server-side; the site works fully with no env vars. `.env.local.example` (repo root) documents both vars.

### 4.4 Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build + type check |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests (`tests/unit`) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright E2E (`tests/e2e`, needs `npx playwright install chromium`) |
