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
| **7. Hardening** | Automated tests (TRD/TDD plan), Lighthouse CI, mobile GPU tuning, branch merge `3d-workspace` → `main` | 🚧 Planned |

## 3. Change History
| Date | Change |
| --- | --- |
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
