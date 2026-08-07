# Entity Relationship Diagram (ERD) & Data Model

**Project:** Shreyas Pawar — Developer Portfolio & Cinematic 3D Workspace
**Last updated:** 2026-08-06

---

## 1. Architecture decision: JSON-backed content layer

The system deliberately has **no database**. `lib/data.ts` is the single source of truth; API routes re-export it. Rationale:

- Portfolio content is static, small and authored by one person — a DB adds infra with zero benefit.
- Build-time bundling guarantees 2D and 3D parity forever.
- Swapping in a real DB later requires only re-implementing `app/api/*` (the `lib/types.ts` contract stays identical).

## 2. ERD

```
Profile 1 ────o Experience
Profile 1 ────o Education
Profile 1 ────o Certification
Profile 1 ────o Project
Profile 1 ────o Hackathon
Profile 1 ────o Milestone
Profile 1 ────1 SocialLinks
Profile 1 ────1 FAQItem[]        (1:1 API shape)
Profile 1 ────1 SkillGroup[]     (1:1 API shape)
Profile 1 ────1 Stat[]           (1:1 API shape)
```

All entities hang off the single `Profile` (the author). The 3D screen UIs consume the same shape (`TabletScreen` reads `experience`, `education`, `certifications`, `milestones` (+ R&D feed from `projects`); laptop reads `projects`, `skillGroups`, `hackathons`, `techStack`).

## 3. Type definitions (`lib/types.ts`)

### Profile
| Field | Type |
| --- | --- |
| id | number |
| name | string |
| subheading | string |
| photoUrl | string \| null |
| email | string |
| phone | string |
| place | string |
| socialLinks | SocialLinks |
| bio | string |

### SocialLinks
linkedin · github · instagram · leetcode · twitter · whatsapp — all `string`.

### ExperienceItem
id, role, company, `type` (`"Work" | "Education" | "Certifications"` semantics), startDate, endDate, description, skills[].

### Project
id, title, description, tags[], githubUrl, demoUrl?, year, highlight?

### Hackathon
id, title, event, outcome, tags[], githubUrl?, year.

### Education / Certification
- **Education:** id, degree, institution, period, note?
- **Certification:** id, title, issuer, issued, credentialId.

### Milestone
id, period, title, place, description, `type` (`education | competition | internship | hackathon`).

### Supporting shapes
- **SkillGroup:** category, skills[]
- **Stat:** value, suffix, label
- **FAQItem:** question, answer
- **ContactMessagePayload:** name, email, message (POST /api/contact)

## 4. Seed content (`lib/data.ts`)

Exports (consumed by both 2D and 3D):
`profile, education, certifications, skillGroups, projects, hackathons, experience, milestones, stats, faqs, techStack, journey`.

Placeholders to replace before public launch:
- `profile.email = "shreyas@example.com"`, `profile.phone = "+91 XXXXX XXXXX"`
- `profile.photoUrl = null` (set to `/your-image.jpg` in `public/` to enable photo)

## 5. Future database migration path (reference only)

If a CMS is ever required, the target schema (Prisma/PostgreSQL) maps 1:1:

```prisma
model Profile {
  id          Int           @id @default(autoincrement())
  name        String
  email       String
  experiences Experience[]
  projects    Project[]
  hackathons  Hackathon[]
}

model Experience {
  id        Int     @id @default(autoincrement())
  role      String
  company   String
  type      String  // Work | Education | Certifications
  startDate String
  endDate   String?
  profile   Profile @relation(fields: [profileId], references: [id])
  profileId Int
}
```

Migration contract: keep `lib/types.ts` stable; only `app/api/*` implementations change.
