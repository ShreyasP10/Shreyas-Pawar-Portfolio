# API Specification

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Base:** all routes under `app/api/*` (Next.js Route Handlers, BFF pattern)
**Last updated:** 2026-08-06

---

## 1. Endpoints

| Method | Route | Purpose | Request body | Response |
| --- | --- | --- | --- | --- |
| GET | `/api/profile` | Hero: name, subheading, bio, stats, social links | — | `Profile` (+ stats/socials) |
| GET | `/api/projects` | Featured projects + open source | — | `Project[]` |
| GET | `/api/experience` | Work timeline | — | `ExperienceItem[]` |
| GET | `/api/hackathons` | Hackathon achievements | — | `Hackathon[]` |
| GET | `/api/about` | Skills, certifications, education | — | `{ skills, certifications, education }` |
| POST | `/api/contact` | Contact form → validate → email (Resend) or server log | `ContactMessagePayload` | `{ success: true }` \| `{ error }` with status codes |

All GET routes return `application/json; charset=utf-8`. The 2D site consumes them via `lib/useFetch.ts`; the 3D screens import `lib/data.ts` directly (same contract, zero network).

## 2. POST /api/contact

### 2.1 Request
```json
{
  "name": "Jane Recruiter",
  "email": "jane@company.com",
  "message": "Loved the 3D workspace..."
}
```

### 2.2 Validation & behavior
1. Payload validated server-side (schema: non-empty `name`, valid `email`, non-empty `message`; trimmed).
2. If `process.env.RESEND_API_KEY` is set → send email to `CONTACT_EMAIL` via Resend.
3. Otherwise (or on send failure) → log the validated message server-side and still return success.
4. Invalid payload → `400 { error: "Invalid payload" }`.

### 2.3 Responses
| Code | Body |
| --- | --- |
| 200 | `{ success: true, messageId? }` |
| 400 | `{ error }` — validation failed |
| 500 | `{ error }` — email transport failure |

## 3. Error handling conventions
- All GET routes are static-safe (read-only, sync from `lib/data.ts`) — no failure modes beyond serialization.
- No secrets are ever exposed in client responses.

## 4. Contract stability
`lib/types.ts` is the single contract for every endpoint. Any data-shape change is a breaking change for both `/` and `/3d`; update `lib/data.ts` and the types together (see Maintenance Guide).
