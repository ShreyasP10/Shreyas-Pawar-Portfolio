# Developer Guide

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Last updated:** 2026-08-06

---

## 1. Prerequisites
- Node.js ≥ 20.9
- Git
- (Optional) `RESEND_API_KEY` for live contact emails

## 2. Local setup

```bash
git clone <repo-url>
cd portfolio
npm install
cp .env.local.example .env.local   # or create manually (see §3)
npm run dev
```

- 2D site: http://localhost:3000
- 3D workspace: http://localhost:3000/3d

> **Warning:** do **not** run `npm update` on `three` — it is pinned at `0.182.0` on purpose (see SRS §4.2).

## 3. Environment variables

```
RESEND_API_KEY=re_...
CONTACT_EMAIL=shreyas@example.com
```

Both optional. Without them the site works; `POST /api/contact` validates + logs server-side.

## 4. Useful commands

| Command | Use |
| --- | --- |
| `npm run dev` | dev server (Turbopack) |
| `npm run build` | production build + TS check |
| `npm run start` | serve the build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | type check only |
| `npx next build && npx next start --port 3999` | verify production build locally (use any free port) |

## 5. How the 3D scene is organized

| File | What it owns |
| --- | --- |
| `app/3d/page.tsx` | mount point + scroll/swipe/keyboard navigation |
| `components/3d/Experience.tsx` | Canvas, shadows config, lights, post-processing, `ReadyGate` |
| `components/3d/Room.tsx` | room shell, desk, LED strips, window + curtains, door, bookshelf, sticky notes, certs wall, `WallName` |
| `components/3d/Devices.tsx` | `Hoverable` wrapper (hover scale + click) + 3 device models + Html anchors |
| `components/3d/Screens.tsx` | the DOM UIs rendered inside each device |
| `components/3d/CameraRig.tsx` | damped POS/LOOK targets per `NavTarget` |
| `components/3d/Sidebar.tsx` / `Overlays.tsx` | 2D chrome over the canvas |
| `components/3d/store.ts` | zustand store (state + tones) |
| `components/3d/sound.ts` / `Dust.tsx` / `Lights.tsx` | audio, particles, lighting |

## 6. Ground rules when editing the scene

1. **Surface heights** — floor top = 0.05, desk top = 0.825. Every object's bottom edge must equal the surface it rests on. (Incident INC-20260806-04.)
2. **Screen anchors** — the Html anchor group must copy the device model's rotation exactly and sit at the model-space screen center; `distanceFactor` ≈ the camera-view distance.
3. **Camera LOOK** — must equal the computed world-space screen center of the target device; see SDS §3.2.
4. **No focal-plane effects** — DepthOfField is banned while the camera moves (INC-20260806-02).
5. **Wall Html** — 720×240 px container centered at the board; `distanceFactor` 5.45 (≈ wall-view distance) keeps 1:1 px:unit mapping.

## 7. Adding a view or a tab

**New device tab:** extend the union type in `store.ts` (`LaptopTab`/`TabletTab`), add a case in `Screens.tsx`, optionally a sidebar item in `Sidebar.tsx`.

**New camera view:** add a key to `NavTarget`, entries in `POS`/`LOOK` in `CameraRig.tsx`, a `SEQUENCE` entry in `app/3d/page.tsx`, and update `VIEW_LABELS` in `Overlays.tsx`.

## 8. Verification loop
After any change:
1. `npx tsc --noEmit` and `npm run lint`
2. `npm run build`
3. Serve the production build and check `/3d` returns 200 with sidebar/landing markers in the HTML
4. Manual QA: console must be free of three/R3F deprecation warnings (see TRD §4)
