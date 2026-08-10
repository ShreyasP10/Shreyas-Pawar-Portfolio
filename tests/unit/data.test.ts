import { describe, expect, it } from "vitest";
import {
  projects,
  experience,
  education,
  certifications,
  hackathons,
  milestones,
  stats,
  skillGroups,
} from "@/lib/data";

interface WithId {
  id?: number;
}

const ID_COLLECTIONS: WithId[][] = [
  projects,
  experience,
  education,
  certifications,
  hackathons,
  milestones,
];

describe("UT-01 · Content parity (lib/data.ts)", () => {
  it("exports non-empty collections", () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(experience.length).toBeGreaterThan(0);
    expect(education.length).toBeGreaterThan(0);
    expect(certifications.length).toBeGreaterThan(0);
    expect(hackathons.length).toBeGreaterThan(0);
    expect(milestones.length).toBeGreaterThan(0);
    expect(stats.length).toBeGreaterThan(0);
    expect(skillGroups.length).toBeGreaterThan(0);
  });

  it("every item has a unique id", () => {
    for (const collection of ID_COLLECTIONS) {
      const ids = collection.map((item) => item.id).filter((id) => id !== undefined);
      expect(ids.length).toBe(collection.length);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
