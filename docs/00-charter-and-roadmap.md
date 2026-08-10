# Project Charter & Development Roadmap

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Owner / Sponsor:** Shreyas Pawar
**Primary branch:** `3d-workspace` (3D experience); `main` (stable 2D site)
**Last updated:** 2026-08-06

---

## 1. Project Charter

### 1.1 Vision
A dual-experience portfolio: a fast, accessible, SEO-friendly 2D scrollable site, paired with a cinematic room-scale 3D workspace (React Three Fiber) that presents the same content as physical devices on a desk. Both experiences must be driven by a **single source of truth** (`lib/data.ts`) so they can never drift apart.

### 1.2 Mission
- Present the developer's identity, projects, hackathons, experience and skills through two complementary UX paradigms.
- Replicate the provided concept render of the workspace with high visual fidelity: dark room, LED strip on the desk's back edge, pegboard, shelf with a glowing 10:30 PM clock, laptop centered, portrait tablet and phone angled 45° toward it.
- Deliver 60 FPS camera choreography on desktop, 30+ FPS on mid-range mobile.

### 1.3 Success Metrics
| Metric | Target |
| --- | --- |
| 2D Lighthouse performance | ≥ 96 desktop, ≥ 90 mobile |
| 3D frame rate | 60 FPS desktop, 30+ FPS mobile |
| Camera view transitions | < 800 ms settle time |
| 3D scene fidelity vs. concept render | ≥ 95% (layout, devices, lighting) |
| Content parity 2D ↔ 3D | 100% (single `lib/data.ts`) |

### 1.4 Scope
**In scope:** 2D portfolio route `/`, 3D workspace route `/3d`, BFF API routes, contact form (Resend optional), content system, 3D scene (room, desk, devices, overlays, camera, audio, particles).

**Out of scope (explicitly decided):** database-backed CMS (content lives in `lib/data.ts`), real 3D asset files (devices are procedurally modeled), auth, analytics.

### 1.5 Risks
| Risk | Mitigation |
| --- | --- |
| R3F/three version drift (three r183 removed `THREE.Clock`, used internally by R3F) | Pin `three@0.182.0`; see Maintenance Guide |
| WebGL on low-end mobile | Scale-down, reduced-motion path, SSAO/Bloom tuned conservatively |
| HTML overlays (`drei Html`) jank on scroll | Anchored to screen centers of rotated groups; `distanceFactor` matched to camera distance |

---

## 2. Development Roadmap

| Phase | Deliverable | Status |
| --- | --- | --- |
| **1. Foundation** | Next.js App Router project, Tailwind v4 theme, `lib/data.ts` + `lib/types.ts`, BFF API routes | ✅ Done |
| **2. 2D portfolio** | Hero (typewriter + count-up), projects, hackathons, experience, skills, journey, open source, certifications, FAQ, contact | ✅ Done |
| **3. 3D scene setup** | Room, desk, mat, LED strip, pegboard, shelf, lamp, floor, camera rig, lighting, post-processing (SSAO/Bloom/Vignette) | ✅ Done |
| **3b. Room overhaul** | 10×9 m layout: window + curtains, sticky notes, bookshelf, certs wall, TV showcase wall, desk accessories (keyboard, RGB mouse, earbuds, hub), retuned camera views | ✅ Done |
| **4. Devices & screens** | Laptop, portrait tablet (kickstand), phone (stand), Html screen UIs, 45° tablet/phone facing laptop | ✅ Done |
| **5. Navigation & overlays** | Scroll/arrow/Esc navigation, sidebar, scroll rail, landing overlay, settings (sound/particles/reduced motion) | ✅ Done |
| **6. Polishing** | WebAudio tones, idle chair sway, deprecation fixes, README + docs suite | ✅ Done |
| **7. Hardening** | Automated tests (TRD/TDD plan), Lighthouse CI, mobile GPU tuning, branch merge `3d-workspace` → `main` | 🟡 In progress — tests (Vitest UT-01..07, 25/25 green), Playwright E2E, `.env.local.example`, CI workflow + Lighthouse config done; mobile GPU tuning + branch merge pending |

## 3. Change History
| Date | Change |
| --- | --- |
| 2026-08-09 | **Hardening phase (docs/05 + docs/00 §Phase 7)**: pinned `three@0.182.0` exact (SRS §4.2); added Vitest 4 (`vitest.config.ts`, `tests/unit/` — data parity UT-01, API↔data UT-02, contact validation UT-03, store device nav UT-04, SEQUENCE UT-05, camera targets UT-06, audio/soundOn UT-07 — 25 tests green) and Playwright 1.62 (`playwright.config.ts`, `tests/e2e/` — E2E-01 home renders, E2E-02 3D loads, E2E-08 contact API); extracted shared `SEQUENCE` into `components/3d/nav.ts` (single source for page.tsx + ScrollRail, makes UT-05 a real test); added `npm test`/`test:watch`/`test:e2e` scripts, `.env.local.example`, `.github/workflows/ci.yml` (lint + tsc + unit + build + Lighthouse), `lighthouserc.json`. |
| 2026-08-08 | **"Perfect 3D site" polish round 2**: (1) **Screen occlusion** — all 4 device screens (laptop / tablet / phone active+AOD / TV) now use drei `Html occlude` (scene-wide raycast) so 2D content hides when anything passes in front (AR-like depth); each screen plane nudged forward so its own device body can't self-occlude (laptop z 0.024, tablet 0.032, phone 0.022, TV 0.064). (2) **WebGL fallback** — new `WebGLBoundary` (ErrorBoundary around `<Canvas>`) renders a 2D device-card fallback (Laptop·Skills / Tablet·Journey / TV·Achievements / Phone·Contact, all from `lib/data.ts`) with Download Resume + back links when WebGL init fails. (3) **Positional audio** — `sound.ts` gains an AudioListener-based engine: `playPositionalTone` (HRTF panner, linear falloff 1.5–14 m) fired from each device's world position on open + tab-switch, plus a soft 90+180.5 Hz device hum (`startHum`/`stopHum`) that pans with the active device; listener attached to the camera via the new `AudioRig` in `Experience.tsx`. |
| 2026-08-08 | **Device content restructure (1:1 with sections) + 100px-margin camera framing**: each device now shows exactly its assigned content — laptop → hero / skills / certs (3 tabs), tablet → featured projects / journey (2 tabs), TV → hackathons / achievements / experience / open source / certs (5 tabs, achievements derived from competition + hackathon milestones), phone → "Let's Build Something Together" + email/phone + socials + **Download Resume** (`/resume/Shreyas%20Pawar%20Resume.pdf`); `store.ts` unions narrowed to match (`LaptopTab`/`TabletTab`/`TvTab`), sidebar items remapped to the devices, laptop hero CTAs re-pointed (VIEW SKILLS →, GET IN TOUCH opens phone), sticky notes open laptop home; **100px-margin framing**: on device click the camera now frames the full screen with a ~100px (0.5 m world) margin — laptop `POS (0,1.3,-5.75)`/`LOOK (0,1.2,-8.09)` (D 2.34), tablet `(0.23,1.69,-5.85)`→`(1.78,1.32,-7.36)` (D 2.20), phone `(-0.51,1.44,-5.81)`→`(-1.89,1.13,-7.16)` (D 1.96), TV `(1.9,1.9,-4.5)`→`(4.745,1.9,-4.5)` (D 2.84); screen materials softened (emissive 0.6–0.7 → 0.15–0.18, roughness 0.45); `CODE·BUILD·REPEAT` moved onto the mug body (was a giant floating label, distanceFactor 12 → 1); wall heading camera un-zoomed (`[0,3.15,-5.5]`) + WallName Html rescaled (distanceFactor 5.45 → 3.5) so the full heading fits. |
| 2026-08-08 | **Resume now user-uploaded**: removed the PDF builder (`scripts/generate-resume.js` + generated `Shreyas_Pawar_Resume.pdf`); the download links (Download Resume section + navbar pills + 3D phone screen) now point to the user's real resume file **`public/resume/Shreyas Pawar Resume.pdf`** (URL `/resume/Shreyas%20Pawar%20Resume.pdf`) — drop your resume into `public/resume/` under that name and every download link serves it with no code changes. |
| 2026-08-08 | **Floor-plan room restructure** (per the floor plan sketch — north workspace, west window/curtains, east TV, south notes + door): window + long curtains moved to the **west wall** (double-pane night-city, moonlight `(-4.4, 2.3, -4.3)`, west wall now solid); **door relocated to the south wall SE corner** (doorway gap x 3.2…4.85, hinge x 4.175, leaf swings in via rot.y −1.9, exterior floor slab `(3.6, 0, 1.4)`); sticky notes moved to the **south wall SW corner** (x −4.68/−4.24); **TV moved to the east wall** `(4.8, 1.9, -4.5)` rotated `Y(−π/2)` so the screen faces into the room (screen Html no longer needs the Yπ flip + `scaleX(-1)` un-mirror; `Hoverable` gained a `rotation` prop; point lights + glow flipped to the room side); certs now flank the TV (z −6.3/−2.7, LED accent z −3.1); pegboard moved to the north wall right of the wall board (rot Y(π), plant flipped to the room side); chair centered `(0, 0, -5.9)`; mug + steam moved to the desk's far right `(2.4, 0.88, -6.95)`; camera retuned: door `(3.6, 1.2, 1.6)` → `(3.6, 1.5, -0.4)`, entry `(1.4, 1.0, -1.9)`, tv `(-2.9, 1.9, -4.5)` → screen `(4.74, 1.9, -4.5)`. Docs 01/02/05 synced. |
| 2026-08-07 | **Resume download + content cleanup**: new **Download Resume** section (last section on the home page, 3D-portfolio gold-pill style) with a generated A4 PDF (`public/resume/Shreyas_Pawar_Resume.pdf`, built by `scripts/generate-resume.js` — dependency-free PDF writer with validated xref offsets, regenerable after content changes); "Resume" pill added to the navbar right before the 3D Portfolio pill (desktop + mobile menu); section labels above all headings removed (`SectionHeading` now renders title + description only); navbar logo changed to **ShreyasPawar.Dev** (footer already had it); `daily_drivers` bar cleaned up (`//` prefix removed); FAQ questions rewritten in first person ("What do I currently work on?", "What kind of work am I open to?", …). |
| 2026-08-07 | **Live contact + analytics + content fixes**: real contact info (email `shreyaspawar1011@gmail.com`, LinkedIn `in/shreyaspawar10`) everywhere (profile API, footer, direct links); GitHub followers now **live** via `/api/github-stats` (GitHub API, 1 h cache, static fallback 19 — actual current count, replaces stale 637) shown in Hero stats and Open Source card; contact form actually delivers: Resend when `RESEND_API_KEY` is set, otherwise the API returns a prefilled `mailto:` link to the real inbox (opened client-side); **Vercel Analytics** (`@vercel/analytics`) added to layout; visit tracking via `POST /api/visits` (beacon on route change: path, referrer, IP, UA — JSONL in `data/visits.jsonl` locally, `/tmp` on Vercel) + `GET /api/visits` summary; `//` removed from all section headings; Journey section restyled as a vertical timeline matching Experience (rail + dots, icon + type badge, place/period/description); FAQ rewritten from "what I do" (6 first-person Q&As); footer brand now `ShreyasPawar.Dev`. |
| 2026-08-07 | **Device-bound screens + free camera**: all device UIs moved from billboard panels to drei `Html` **transform** mode — CSS3D planes glued to each screen face and sized exactly to the screen inset (laptop 324×204, tablet 104×164, phone 60×124, TV 480×270), so the content looks like it is *inside* the device; camera views pulled closer (laptop/tablet/phone at 1.6/0.95/0.65 m) so screens fill the frame. Content completed to the full section list: laptop 10 tabs (Home · About · Experience · Projects · Skills · Achievements · Education · Open Source · Blog · Contact — blog now lists the 11 sticky-note posts), TV 7 tabs (Showcase · Projects · Experience · Skills · Open Source · Certs · Contact, fullscreen 1280×720). **Free camera**: `OrbitControls` (rotate-only, damping) auto-enables after every scripted transition settles — drag to look around freely; any nav re-engages the scripted spring. Phone AOD now shows a live clock. |
| 2026-08-07 | Layout bugfixes: floor re-centered to `(0, 0, -4.5)` (spans z −9…0, grounds desk/bookshelf/chair — was shifted 4.5 m south, leaving the desk zone over the void and a phantom patio beyond the south wall); TV moved **inside** the room to `(0, 1.9, -0.6)` against the south wall with the screen facing into the room (was embedded in / sticking through the wall with the console on the exterior); `overview` camera moved inside `(0, 3.0, -3.0)` → `(0, 2.3, -7.8)` (was outside the south wall, blocked); `tv` camera retuned `(0, 1.9, -2.6)` → screen center `(0, 1.9, -0.53)`; TV hover glow flipped to the room side. |
| 2026-08-06 | Room overhaul 14×12 → **10×9 m**: south wall added; north window (night-city canvas + glass + swaying curtains + moonlight); west wall sticky-notes blog wall (hover preview → opens laptop blog), floor bookshelf (books, Pi, GPU box, trophy, 10:30 PM clock), pegboard moved in; east wall certificate plates + LED accent; south-wall TV showcase (OLED screen + console cabinet, tabs: Projects/Experience/Hackathons/Open Source/Certs, sidebar "Showcase" item); desk shifted to z −7.6 with keyboard (RGB underglow), RGB-breathing mouse, earbuds, USB hub, corner plant, carpet + relocated floor lamp; camera POS/LOOK retuned (incl. new `tv` view); sequence now `door → entry → wall → overview → tv → laptop → tablet → phone`. |
| 2026-08-06 | Door entry intro: real doorway gap in the west wall, dark wooden door with gold "SHREYAS PAWAR" nameplate, auto swing-open + camera flies through the doorway to the entry view; wall board heading updated to the 4 role lines + concept intro; sequence now `door → entry → wall → …`. |
| 2026-08-06 | Cinematic polish: damped-spring camera easing (ζ≈0.66), cyan hover glow + floor ring on devices, stronger sidebar active glow, mug steam, plant sway, lamp flicker, real GitHub QR on the phone (`qrcode` lib). |
| 2026-08-06 | Concept alignment: new `entry` camera view (behind the chair) with landing overlay → CTA to wall; wall board now shows intro line + 4 concept badges; laptop home gains "View Projects"/"Download Resume" CTAs + tech-stack badges; tablet gets a Research tab (R&D feed from projects); phone gets a QR-style "Scan to Connect" glyph. |
| 2026-08-06 | Room structure overhaul: real chair (was missing), tablet portrait, desk props grounded, wall name dead-centered, camera LOOK targets aimed at exact screen centers. |
| 2026-08-06 | Scroll-driven sequential navigation (`wall → overview → laptop → tablet → phone`) + gold progress rail. |
