# System Design Specification (SDS) & Architecture

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Last updated:** 2026-08-06

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 (App Router, Turbopack) — single deployment      │
│                                                             │
│  ┌─────────────┐   ┌──────────────────────┐                 │
│  │  /  (2D)    │   │  /3d  (3D Workspace) │                 │
│  │  sections   │   │  Canvas + overlays   │                 │
│  └──────┬──────┘   └──────────┬───────────┘                 │
│         │                     │                             │
│         │    lib/data.ts      │  (single source of truth)   │
│         │    lib/types.ts     │                             │
│  ┌──────┴─────────────────────┴───────────┐                 │
│  │  lib/useFetch.ts  →  app/api/* (BFF)   │                 │
│  └─────────────────────────────────────────┘                 │
│      GET /api/profile | projects | experience | hackathons  │
│      GET /api/about   | POST /api/contact → Resend (opt.)   │
└─────────────────────────────────────────────────────────────┘
```

- **Monolith with BFF**: API route handlers wrap the shared content layer. The 2D site fetches via `lib/useFetch.ts`; the 3D device screens import `lib/data.ts` directly (static import is fine inside `Html` overlays).
- **No database**: content lives in typed TS data (`lib/data.ts`). API routes re-export it — a deliberate decision documented in the ERD document.
- **Parity guarantee**: because both UIs read the same module, content can never desync between the 2D and 3D worlds.

## 2. Directory Structure

```
app/
├── 3d/page.tsx          # /3d route: canvas mount + scroll/swipe/key navigation
├── api/about|contact|experience|hackathons|profile|projects/route.ts
├── layout.tsx           # root layout, data-scroll-behavior="smooth"
├── page.tsx             # / 2D portfolio
└── globals.css          # Tailwind v4 theme, keyframes (loader-slide, panel-pop)
components/
├── 3d/
│   ├── Experience.tsx   # Canvas, shadows PCFShadowMap, EffectComposer (SSAO/Bloom/Vignette)
│   ├── Room.tsx         # room shell, desk, LED strips, window+curtains, door, bookshelf, sticky notes, certs wall, WallName
│   ├── Devices.tsx      # Hoverable wrapper + laptop/portrait-tablet/phone models + Html anchors
│   ├── Screens.tsx      # LaptopScreen, TabletScreen (portrait), PhoneScreen — live React UIs
│   ├── CameraRig.tsx    # damped camera; POS/LOOK per NavTarget, viewport scale
│   ├── Sidebar.tsx      # glass sidebar: menu, room view, socials, settings
│   ├── Overlays.tsx     # LoadingScreen, LandingOverlay (entry view), HUD, HelpBar, ScrollRail, SettingsModal
│   ├── Dust.tsx         # seeded gold-dust particle field (AdditiveBlending)
│   ├── Lights.tsx       # hemisphere + key spot + accent points
│   ├── materials.ts     # procedural canvas textures (wood, brushed, fabric, speckle, plaster, planks)
│   ├── sound.ts         # WebAudio tone synthesis (playTone)
│   └── store.ts         # zustand workspace store
└── (2D section components: Navbar, Hero, Footer, …)
lib/
├── data.ts              # ALL portfolio content
├── types.ts             # shared TS interfaces
└── useFetch.ts          # fetch hook (loading/error states)
docs/                    # this documentation suite
```

## 3. 3D Scene Specification

Coordinate system: **Y-up, Z-forward**; 1 unit ≈ 1 m. Room 10 × 9 m (walls at x ±5.05, z −9.05…+0.05).

### 3.1 Placement (verified against code)
| Element | Position | Notes |
| --- | --- | --- |
| Floor | y 0 (top 0.05), centered `(0, 0, -4.5)` | 10 × 9 m, spans z −9…0 under the whole room, planks repeat [5, 4] |
| North wall | `(0, 3, -9.05)` | 10 × 6 m plaster |
| South wall | `(0, 3, 0.05)` | 10 × 6 m plaster (exterior back of room) |
| West wall | `(-5.05, 3, -6.5875)` + `(-5.05, 3, -1.5125)` | two segments (4.825 / 3.025 m), doorway gap z −4.175…−3.025 |
| East wall | `(5.05, 3, -4.5)` | 9 m wide plaster |
| Ceiling | `(0, 6.05, -4.5)` | dark, 4 perimeter LED strips `#ffb347` (emissive 2.0) |
| Baseboards + LED | y 0.095 / y 0.16 | `#trim` speckle + emissive `#ffb347` strips |
| Desk | `(0, 0.78, -7.6)` | 5.4 × 2 m walnut, legs at corners, cable tray |
| Desk mat | `(0, 0.065, -6.8)` | 5.8 × 3.2 m on floor (top 0.08, mat top 5.1 × 2.6) |
| Laptop | `(0, 0.835, -7.4)` | base flush with desk top (0.825) |
| Tablet | `(1.8, 0.995, -7.3)` | portrait, kickstand rests on desk, yaw −45° |
| Phone | `(-1.9, 0.81, -7.1)` | portrait on stand, yaw +45° |
| Keyboard | `(0, 0.835, -6.85)` | 3 key rows, RGB underglow (breathing hue cycle) |
| Mouse | `(0.95, 0.89, -6.85)` | + `BreathingDot` RGB pulsing top dot |
| Mug | `(2.35, 0.88, -8.0)` | + `CODE·BUILD·REPEAT` Html label + steam |
| Earbuds case | `(2.05, 0.8725, -6.8)` | white, gold LED |
| USB hub | `(1.55, 0.8725, -8.1)` | 3 blue ports |
| Notebook + pen | `(-2.3, 0.833, -7.95)` | grounded |
| Pen cup | `(-1.1, 0.905, -7.1)` | grounded |
| LED strip | `(0, 0.835, -8.57)` | 5.2 m emissive `#ffb347` + spill pointLight |
| Chair | `(-0.9, 0, -6.2)` | office chair, idle sway after 20 s |
| Floor lamp | `(-3.7, 0, -2.6)` | shade + bulb + pointLight `#ffd9a0`, flickers |
| Carpet | `(-4.0, 0.06, -2.0)` | 2.2 × 1.6 m under the lamp |
| Door | west wall x −5.0, hinge z −4.175, leaf 1.15 × 2.25 m | swings inward 109° on load; gold SHREYAS PAWAR nameplate; exterior floor slab `(-6, 0, -3.6)` |
| Window | north wall `(-4.0, 1.6, -8.98)` | night-city canvas, glass, black frame, swaying curtains, moonlight pointLight |
| Wall board | `(0, 3.1, -8.95)` | 6.4 × 2.0 m, gold frame, name + headline dead-centered, raised mid-wall above window + laptop |
| Pegboard | `(-4.95, 3.0, -6.4)` | headphones + plant |
| Bookshelf | `(-4.8, 0, -8.0)` | floor unit 0.42 × 2.3 × 1.05, books, Pi, GPU box, trophy, 10:30 PM clock |
| Sticky notes | west wall `(-4.96, y 1.82…3.32, z -4.68/-5.12)` | 8 colored blog notes, hover preview, click → laptop blog |
| Certs wall | east wall `(4.94, 2.35/3.2, -3.4/-5.8)` | 2 certificate plates + vertical LED accent |
| TV (south) | `(0, 1.9, -0.6)` | 2.4 × 1.35 OLED screen **facing into the room**, console cabinet back flush with the south wall inner face (z 0); gold LED bar, console cabinet with books + framed photo |
| Corner plant | `(4.5, 0, -8.1)` | pot + two spheres |
| Window plant | `(-4.1, 0, -2.2)` | potted, 3 spheres |

### 3.2 Camera choreography (CameraRig.tsx)
Damped spring (semi-implicit Euler per frame, `delta` clamped to 0.1 s):
```
vel  += (target − pos) · k · delta
vel  *= e^(−c·delta)
pos  += vel · delta
```
`k=11, c=4.4` (position) and `k=14, c=4.8` (look-at) → critically-damped-ish with a subtle cinematic overshoot (ζ ≈ 0.66).
POS/LOOK targets (world): see table below. **LOOK targets are the exact device screen centers in world space and are never scaled** — the camera always points precisely at the screen/board. POS is scaled along the camera→target ray (`POS = LOOK + (POS−LOOK)·scale`, `scale = min(innerWidth/1400, innerHeight/900)` clamped to `[0.55, 1]`) so devices keep the same apparent size at any viewport. The `door` and `entry` views are always **unscaled (scale 1)** so the entry path stays inside the doorway band (z −4.175…−3.025) and never clips the west wall at small viewports.

| View | Camera POS | Look at (screen center) |
| --- | --- | --- |
| door | `(-6.9, 1.15, -3.6)` | `(-5.1, 1.6, -3.6)` |
| entry | `(-1.2, 0.95, -3.2)` | `(0, 0.9, -6.5)` |
| wall | `(0, 3.2, -5.9)` | `(0, 3.1, -8.95)` |
| overview | `(0, 3.0, -3.0)` | `(0, 2.3, -7.8)` |
| tv | `(0, 1.9, -2.6)` | `(0, 1.9, -0.53)` |
| laptop | `(0, 1.38, -6.51)` | `(0, 1.38, -8.11)` |
| tablet | `(1.258, 1.277, -6.593)` | `(1.817, 1.32, -7.362)` |
| phone | `(-1.448, 1.115, -6.685)` | `(-1.89, 1.13, -7.162)` |

Laptop/tablet/phone POS distances were tightened (~1.6 / 0.95 / 0.65 m from the screen) so each screen fills ~25–50 % of the viewport and its UI is comfortably readable.

**Free look:** after each scripted transition settles (springs within 0.03 units), `CameraRig` flips `freeCam` on and a drei `OrbitControls` (rotate-only, damping, no zoom/pan; touch drag disabled so mobile swipe-nav keeps priority) takes over — the user can drag to orbit freely around the current look target. Any `go()`/`openDevice()` re-engages the scripted spring from the current camera pose.

**Intro choreography:** the initial `door` view sits 1.85 m outside the west wall, aligned with the doorway (z −4.175…−3.025). ~1.6 s after the loading screen clears, the door leaf swings inward (109°, damped rate 2.2/s) and the camera springs through the real wall gap to `entry` (`-1.2, 0.95, -3.2`), whose straight-line path stays inside the opening. `LandingOverlay` (z-55) shows on `door` ("OPEN THE DOOR" → openDoor + go entry) and on `entry` (CTA → `wall`).

Reduced motion: instant `position.copy` + `lookAt` (no damping).

### 3.3 Ambient life (idle details, all gated on `reducedMotion`)
| Detail | Implementation |
| --- | --- |
| Mug steam | 6 sphere wisps looping up from the mug (`MugSteam`, sine drift, fade in/out) |
| Plant sway | `PlantSway` rotation wobble, ~0.5 Hz |
| Lamp flicker | `FloorLamp` pointLight intensity × `(1 + 0.035·sin(41.7t) + 0.05·sin(23.3t+2.1))` |
| Device hover glow | `Hoverable` cyan pointLight + additive floor ring, damped intensity (8/s) |
| Curtain sway | `Window` curtain meshes rotate ±0.02 rad at 0.35/0.3 Hz |
| Keyboard RGB | underglow material hue-cycles `setHSL(t·0.1)` + pulse 0.7–1.2 |
| Mouse breathing | `BreathingDot` hue-cycles + emissive pulse 0.5–1.9 |
| Sidebar active | cyan `#7dd3fc` glow: border + outer/inner shadow |
| Phone QR | **real** QR code via `qrcode` (`QRCode.create`, EC level M) encoding `profile.socialLinks.github` |

### 3.4 Device screen anchors (Html, `transform` mode)
Every screen UI is a drei `Html` with `transform` — a CSS3D plane glued to the device's screen face (rotates with the device, no billboard panels). Sizing: world size = css px × `distanceFactor` / 400, so each element is **exactly the screen inset size** (1.62 × 1.02 m laptop, 0.52 × 0.82 m tablet, 0.30 × 0.62 m phone, 2.4 × 1.35 m TV). All use `distanceFactor={2}`.

| Device | Anchor (local, inside the rotated screen group) | css size | Tabs (content = real `lib/data.ts`) |
| --- | --- | --- | --- |
| Laptop | `(0, 0.55, 0.02)` rot `(-0.35, 0, 0)` | 324 × 204 | HOME · ABOUT · EXPERIENCE · PROJECTS · SKILLS · ACHIEVEMENTS · EDUCATION · OPEN SOURCE · BLOG · CONTACT |
| Tablet | `(0, 0, 0.003)` rot `(-0.24, -π/4, 0)` | 104 × 164 | WORK · EDU · CERTS · JOURNEY · R&D |
| Phone | `(0, 0, 0.002)` rot `(-0.22, +π/4, 0)` | 60 × 124 | Contact card + AOD (live clock, GitHub notification) |
| TV | `(0, 0, 0.053)` + rot `(0, π, 0)`, inner `scaleX(-1)`, inside `[0, 1.9, -0.6]` group | 480 × 270 (fullscreen 1280 × 720) | SHOWCASE · PROJECTS · EXPERIENCE · SKILLS · OPEN SOURCE · CERTS · CONTACT |

Html overlays are wrapped in groups with **identical rotations** to their device models so the UI sits exactly on the rotated screen face. The TV is the exception: its screen faces the wall (+z), so the Html is flipped `Y(π)` to face the room and the content is un-mirrored with an inner `scaleX(-1)`. The TV fullscreen overlay scales the same 480 × 270 panel 2.667× to 1280 × 720.

### 3.5 Materials (procedural canvas textures)
All materials are procedural `THREE.CanvasTexture` textures generated once and cached in `components/3d/materials.ts` (lazy-created, SSR-safe via `document` guard, `RepeatWrapping` + SRGB):

| Texture | Used on |
| --- | --- |
| Wood grain (+ bump) | desk top, desk legs, shelf, books |
| Brushed metal | laptop base/lid, tablet + phone bodies, kickstand, chair metal, lamp, TV console |
| Fabric weave | chair seat, backrest, armrests |
| Rubber speckle | desk mat, mouse, mug, pen cup, headphones |
| Plaster mottle | walls |
| Floor planks | floor (repeat 5×4) |
| Paper / cover / pegboard / pot / trim speckle | notebook, pegboard, plant pot, base trim |
| Carpet speckle | rug under the floor lamp |
| Night city skyline (canvas) | north window (sky gradient, moon, buildings, lit windows) |

Textures multiply with material color; `map`-equipped materials use `color="#ffffff"` so the texture's own tone defines the surface.

### 3.6 Lighting & post-processing
- Hemisphere `(#d7d3e8, #141210, 0.5)`, warm key spot (1024 shadow map), LED strip spill `#ffb347`, lamp `#ffd9a0`.
- Ceiling + baseboard LED strips `#ffb347` (emissive 2.0 / 1.6), window moonlight `#8fa8ff`, TV warm point `#ffb347` + cool `#7dd3fc`, cert wall LED accent `#ffb347`.
- `EffectComposer`: **SSAO** (`enableNormalPass`), **Bloom** (mipmap), **Vignette**. DepthOfField intentionally removed (fixed focus plane blurred moving devices).

## 4. Navigation Flow (app/3d/page.tsx)

```
SEQUENCE = [door, entry, wall, overview, tv, laptop, tablet, phone]
wheel (|ΔY| ≥ 12, 650 ms cooldown)  → prev/next in sequence (clamped)
touch swipe (≥ 40 px)               → prev/next (clamped)
ArrowLeft/Right                     → prev/next (wraps)
Esc                                 → close panels / settings
click device (Hoverable)            → openDevice(device)
sidebar item                        → go() or openDevice(device, tab)
```

## 5. State Management (components/3d/store.ts, zustand)

| Slice | Purpose |
| --- | --- |
| `target` | active `NavTarget` |
| `activeDevice` | open device (`laptop`/`tablet`/`phone`/`tv`/null) |
| `laptopTab` / `tabletTab` / `tvTab` | active tab per device |
| `soundOn` / `particlesOn` / `reducedMotion` | settings |
| `loading` | initial loading screen |
| `lastInteraction` | idle detection for chair sway |
| actions | `go`, `navigateTab`, `openDevice`, `closePanels`, `setSound`, `setParticles`, `setReducedMotion`, `setSettingsOpen`, `setLoading`, `noteInteraction` |

All actions update `lastInteraction` and play tones via `sound.ts` (`playTone(freq, duration)` — single shared `AudioContext`, created lazily on first user gesture).
