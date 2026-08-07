# Maintenance Guide

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Last updated:** 2026-08-06

---

## 1. Updating content (most common task)

Everything lives in `lib/data.ts` + `lib/types.ts`. No component changes needed.

**Add a project** → append an object to `projects[]` in `lib/data.ts`. The 2D section and the laptop's Projects tab both render it immediately.

**Edit social links** → update `profile.socialLinks` (linkedin, github, instagram, leetcode, twitter, whatsapp). The phone contact grid and 2D footer share it.

**Swap in a photo** → set `profile.photoUrl: "/your-image.jpg"` and drop the file into `public/`.

**Verify parity** → run UT-01/UT-02 (TRD) or at minimum reload both `/` and `/3d` laptop screen.

## 2. Dependency discipline (critical)

| Package | Rule | Why |
| --- | --- | --- |
| `three` | **Never** `npm update three`. Stay at `0.182.0` | r183+ removed `THREE.Clock`, which R3F instantiates internally → per-frame deprecation noise, future breakage |
| `@react-three/fiber`, `drei`, `postprocessing` | Upgrade only together and only after checking compatibility with pinned `three` | minor bumps can pull newer three |
| `next` / `react` | Upgrade deliberately; run full build + E2E | framework majors change route/runtime behavior |

If an upgrade is forced: verify no console deprecation warnings, then update **SRS §4.2** and **SDS** version tables.

## 3. When the concept render changes (visual direction)

1. Update placement table in `docs/02-sds-and-architecture.md` §3.1.
2. Recompute camera LOOK targets to the new screen centers.
3. Re-run the manual QA checklist (`docs/05-trd-and-tdd.md` §4).

## 4. Replacing procedural models with GLTF assets (future)

Models are currently procedural (box/cylinder primitives in `Devices.tsx`/`Room.tsx`). To switch to real assets:

```bash
npx gltfjsx public/models/laptop.glb --transform --types
```

Then keep: `castShadow`/`receiveShadow` on casing parts, the `Html` anchor at the model's screen center, and the group rotation conventions from `Devices.tsx`.

## 5. Monitoring & health

- **Runtime checks:** `npm run build` + serve + `Invoke-WebRequest -UseBasicParsing http://localhost:3999/3d` (PS) or `curl -I localhost:3999/3d`.
- **Logs:** contact messages log server-side when no `RESEND_API_KEY`.
- **WebGL performance:** DevTools Performance on `/3d`; expect 60 FPS desktop / 30+ mobile; if lower, reduce Bloom intensity or disable SSAO `intensity` before touching the model.
- **Deprecation watch:** console must stay clean; if three deprecations appear, check `three` version first.

## 6. Rollback

- Code: `git revert <sha>` on the failing commit; deploy follows automatically (Vercel).
- Content: `git log -p lib/data.ts` to restore a previous snapshot.
- `3d-workspace` branch: all 3D work lands there; `main` stays stable until merge.

## 7. Recurring maintenance calendar

| Frequency | Task |
| --- | --- |
| Weekly | `npm audit` (review only — do not auto-update `three`), console deprecation scan |
| Monthly | Full QA checklist (TRD §4), Lighthouse re-run, contact form smoke test |
| Quarterly | Dependency review against this guide's rules, docs freshness check |
| On content change | Parity check 2D ↔ 3D (UT-01/UT-02) |
