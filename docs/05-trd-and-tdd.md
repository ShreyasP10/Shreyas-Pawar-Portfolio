# Test Plan (TRD) & Test-Driven Development (TDD)

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Last updated:** 2026-08-06

> Status: **specification/plan** — no test runner is installed yet (Jest + Playwright are the targets). Tests below are defined before implementation, per TDD.

---

## 1. Unit tests (Jest + React Testing Library)

| ID | Test | Assertion |
| --- | --- | --- |
| UT-01 | Content parity | `lib/data.ts` exports non-empty `projects`, `experience`, `education`, `hackathons`, `milestones`, `stats`; every item has a unique `id`. |
| UT-02 | API ↔ data agreement | `GET /api/projects` response length equals `projects.length` in `lib/data.ts` (repeat for experience, hackathons, about). |
| UT-03 | Contact validation | `/api/contact` rejects empty name, invalid email, empty message with `400`. |
| UT-04 | Store logic | `openDevice("tablet", "education")` sets `target: "tablet"`, `activeDevice: "tablet"`, `tabletTab: "education"`, updates `lastInteraction`. |
| UT-05 | Sequence math | `SEQUENCE` in `app/3d/page.tsx` equals `["door","entry","wall","overview","tv","laptop","tablet","phone"]`; wheel/touch navigation clamps at the ends. |
| UT-06 | Camera targets | LOOK targets equal computed screen centers within tolerance (see SDS §3.2/3.3). |
| UT-07 | Sound | `playTone` respects `soundOn` (no `AudioContext` created when off). |

## 2. Integration / E2E tests (Playwright)

| ID | Test | Steps → Expected |
| --- | --- | --- |
| E2E-01 | 2D renders | Open `/` → hero roles typewriter, sections present, no console errors. |
| E2E-02 | 3D loads | Open `/3d` → loading screen, then landing overlay → ENTER WORKSPACE. |
| E2E-03 | Scroll navigation | Simulate wheel `ΔY ≥ 12` → view advances `door → entry → wall → overview → tv → laptop → tablet → phone`; scroll up reverses; ends clamp. |
| E2E-04 | Arrow keys | ArrowRight cycles with wrap-around; Esc closes open panel. |
| E2E-05 | Device click | Click laptop mesh → `activeDevice === "laptop"`, panel visible. |
| E2E-06 | Sidebar | Click "Education" → camera at tablet view + `tabletTab: "education"`. |
| E2E-07 | Settings | Toggle sound/particles/reduced motion → store state + dust visibility change. |
| E2E-08 | Contact form | POST valid payload → 200; invalid → 400. |
| E2E-09 | Reduced motion | Emulate `prefers-reduced-motion: reduce` → camera teleports (no damping), no dust. |

## 3. Performance tests

| ID | Test | Threshold |
| --- | --- | --- |
| PERF-01 | Lighthouse 2D (desktop/mobile) | ≥ 96 / ≥ 90 |
| PERF-02 | 3D FPS (Playwright + `requestAnimationFrame` sampling, Moto G4 emulation) | ≥ 30 FPS |
| PERF-03 | Camera settle time | < 800 ms after view change |
| PERF-04 | 3D bundle size | `three` + R3F deps chunk reasonable (< 1.2 MB gzip combined with app) — trim via tree-shaking/dynamic import if exceeded |

## 4. Manual QA checklist (3D room structure)

- [ ] Name + headline dead-centered on wall board; board fits frame; fades out off-wall view.
- [ ] Tablet is **portrait** on kickstand; both tablet + phone angled 45° toward laptop; screens render on the rotated faces (no floating panels).
- [ ] Chair visible front-left of desk; sways after 20 s idle; resets on interaction.
- [ ] Desk mat visible on floor (not buried); all props (mouse, mug, notebook, pen cup, keyboard, earbuds, hub) sit on the desk top.
- [ ] LED strip sits on the desk back edge; lamp has a shade and warm glow; ceiling + baseboard LED strips glow.
- [ ] Window on the north wall: night city visible, glass, curtains sway; board + window don't overlap.
- [ ] Sticky notes on west wall: hover shows preview, click opens laptop blog tab.
- [ ] Bookshelf on floor near west wall (books, trophy, clock); certs plates on east wall.
- [ ] TV on the south wall **inside the room**: screen faces into the room, console back flush with the wall; hover glow on the room side; click opens showcase screen with 5 tabs; cabinet sits on the floor.
- [ ] Floor runs under the whole room (z −9…0): desk, mat, bookshelf, chair all grounded — no void; no floor visible beyond the south wall.
- [ ] Overview + TV camera views are inside the room (south wall never fills the frame).
- [ ] Every device UI is a transform-glued plane exactly on its screen face (laptop/tablet/phone/TV) — no billboard panels; content sits inside the device boundary from every angle.
- [ ] Laptop shows all 10 sections (Home/About/Experience/Projects/Skills/Achievements/Education/Open Source/Blog/Contact); TV shows 7 tabs incl. Showcase; phone AOD clock is live.
- [ ] Drag on the canvas orbits the camera freely after each view settles; scroll/arrows/sidebar still navigate; dragging on device UIs doesn't orbit.
- [ ] Door camera view outside the room; nameplate readable; leaf swings in; camera threads the doorway gap.
- [ ] Every camera view shows 20–30% surrounding environment.
- [ ] No console warnings (three deprecations, SSAO normal-pass, React key/hydration).
