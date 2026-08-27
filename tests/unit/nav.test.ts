import { describe, expect, it } from "vitest";
import { SEQUENCE } from "@/components/3d/nav";
import type { NavTarget } from "@/components/3d/store";

const EXPECTED: NavTarget[] = [
  "door",
  "entry",
  "laptop",
  "tablet",
  "phone",
  "tv",
  "overview",
  "wall",
];

describe("UT-05 · scroll/view SEQUENCE", () => {
  it("matches the documented cycle", () => {
    expect(SEQUENCE).toEqual(EXPECTED);
  });

  it("contains every NavTarget exactly once", () => {
    expect(new Set(SEQUENCE).size).toBe(SEQUENCE.length);
    for (const t of EXPECTED) {
      expect(SEQUENCE).toContain(t);
    }
  });
});
