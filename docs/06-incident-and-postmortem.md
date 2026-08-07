# Incident Reports & Postmortems

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Last updated:** 2026-08-06

---

## 1. Incident Report — SSAO runtime crash (postprocessing v3)

| Field | Value |
| --- | --- |
| ID | INC-20260806-01 |
| Severity | P1 (runtime crash, `/3d` blank) |
| Status | Resolved |
| Discovered | During development of `Experience.tsx` |

**Symptoms:** `/3d` canvas throws at runtime: *"Please enable the NormalPass in the EffectComposer in order to use SSAO."* — blank screen after `LoadingScreen` dismisses.

**Root cause:** `@react-three/postprocessing` v3 requires `enableNormalPass` on `<EffectComposer>` for SSAO; the effect was added without it.

**Resolution:** Added `enableNormalPass` to `<EffectComposer>` (validated against the package's TypeScript declarations).

**Prevention:** API/version changes in `@react-three/postprocessing` are checked against the installed package's `.d.ts` before use; manual QA item "no console errors" added to TRD.

## 2. Incident Report — DepthOfField blurring devices

| Field | Value |
| --- | --- |
| ID | INC-20260806-02 |
| Severity | P2 (visual regression) |
| Status | Resolved |

**Symptoms:** Devices looked out-of-focus in every view.

**Root cause:** `DepthOfField` uses a **fixed focus plane** in world space; the camera moves between device views, so the focus plane never matched the active screen.

**Resolution:** Removed DepthOfField entirely. Kept SSAO + Bloom + Vignette.

**Prevention:** Rule documented in SDS §3.4 — no focal-length-based effects while using a moving camera.

## 3. Incident Report — three r183 deprecation of THREE.Clock

| Field | Value |
| --- | --- |
| ID | INC-20260806-03 |
| Severity | P2 (console noise + future breakage) |
| Status | Resolved |

**Symptoms:** Per-frame deprecation warnings from `THREE.Clock`; also `PCFSoftShadowMap` shadow warning.

**Root cause:** R3F instantiates `THREE.Clock` internally; it is deprecated from three r183 onward. The boolean `shadows` Canvas prop selected the deprecated `PCFSoftShadowMap`.

**Resolution:** Pinned `three@0.182.0`; shadows configured explicitly as `shadows={{ type: THREE.PCFShadowMap }}`.

**Prevention:** Pinning rule in SRS §4.2 + Maintenance Guide; never `npm update three`.

## 4. Incident Report — missing chair / sunken room furniture

| Field | Value |
| --- | --- |
| ID | INC-20260806-04 |
| Severity | P2 (fidelity vs. concept render) |
| Status | Resolved |

**Symptoms:** No chair in the room (a `chairRef` existed but was never attached to any mesh); desk mat buried under the floor; mouse, mug, notebook and pen cup sunk into the desk top; LED strip floating behind the desk; tablet landscape and floating above the desk; name/headline off-center on the wall board.

**Root cause:** Position tuning was done without ground-truthing against the desk top height (0.825 m) and the floor surface (0.05 m); the tablet body was authored landscape; `Html` centering stacked the wall name off-center.

**Resolution:** Rebuilt the chair (star base, casters, gas lift, seat, backrest, armrests) at `(-0.9, 0, -6.05)` wired to `chairRef`; raised mat/props/LED strip to rest on their surfaces; tablet converted to portrait on a kickstand with matching screen anchor; wall name restructured into a fixed-size container (720×240 px = board 7.2×2.4 m at `distanceFactor` 7.6) with name+headline dead-centered; camera LOOK targets recomputed to exact screen centers.

**Prevention:** Grounding rule: every scene object's bottom edge must equal the surface height it rests on; manual QA checklist in TRD §4; camera LOOK = computed screen center (SDS §3.2).

## 5. Postmortem — scroll-jank on route transition (2D → 3D)

| Field | Value |
| --- | --- |
| ID | PM-20260806-01 |
| Severity | P3 |
| Date | 2026-08-06 |

**Summary:** Entering `/3d` could inherit a browser smooth-scroll animation from the previous route, making the canvas appear to "jump" briefly while loading.

**Timeline**
1. `T+0` — user scrolls the 2D page (anchor links + native smooth scroll).
2. `T+0.1s` — router pushes `/3d`; the document keeps its scroll offset.
3. `T+0.5s` — canvas mounts; pending scroll gesture fights the WebGL camera → jump.

**Root cause:** The document's native smooth-scroll behavior persisted across the route transition.

**Resolution:** Set `data-scroll-behavior="smooth"` on `<html>` (App Router route transitions are scroll-triggered; hard CSS `scroll-behavior` on `html` was the jank source). `/3d` root is `fixed inset-0 overflow-hidden overscroll-none`, so the document never scrolls there.

**Preventative actions:**
- `data-scroll-behavior="smooth"` documented in SRS §4.2.
- E2E test E2E-02 asserts `/3d` mounts without scroll offset.

**Lessons:** Whenever two scroll systems coexist (browser scroll + virtual camera), explicitly disable one at the boundary.

---

## 6. Blameless culture note
All incidents above are environmental/version/geometry issues, not individual faults. Fixes are codified in docs (SRS §4.2, SDS §3.4, TRD §4, Maintenance Guide) so they cannot regress silently.
