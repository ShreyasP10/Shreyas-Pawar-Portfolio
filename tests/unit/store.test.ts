import { beforeEach, describe, expect, it } from "vitest";
import {
  useWorkspace,
  POS,
  LOOK,
  type NavTarget,
} from "@/components/3d/store";
import { DEVICE_SOUND_POS } from "@/components/3d/sound";

const NAV_TARGETS: NavTarget[] = [
  "door",
  "entry",
  "wall",
  "overview",
  "tv",
  "laptop",
  "tablet",
  "phone",
];

beforeEach(() => {
  useWorkspace.setState({
    target: "door",
    activeDevice: null,
    laptopTab: "home",
    tabletTab: "projects",
    tvTab: "hackathons",
    tvFullscreen: false,
    freeCam: false,
    soundOn: false,
    settingsOpen: false,
    isMoving: false,
    targetCameraPosition: POS.door,
    targetLookAt: LOOK.door,
  });
});

describe("UT-04 · store device navigation", () => {
  it("openDevice sets target, active device and tab", () => {
    useWorkspace.getState().openDevice("tablet", "journey");
    const s = useWorkspace.getState();
    expect(s.target).toBe("tablet");
    expect(s.activeDevice).toBe("tablet");
    expect(s.tabletTab).toBe("journey");
    expect(s.laptopTab).toBe("home");
    expect(s.freeCam).toBe(false);
    expect(s.targetCameraPosition).toEqual(POS.tablet);
    expect(s.targetLookAt).toEqual(LOOK.tablet);
  });

  it("openDevice without a tab keeps existing tabs", () => {
    useWorkspace.getState().openDevice("tv", "hackathons");
    useWorkspace.getState().openDevice("phone");
    const s = useWorkspace.getState();
    expect(s.target).toBe("phone");
    expect(s.tvTab).toBe("hackathons");
  });

  it("is blocked while moving (unless reducedMotion)", () => {
    useWorkspace.setState({ isMoving: true });
    useWorkspace.getState().openDevice("tv");
    expect(useWorkspace.getState().target).toBe("door");

    useWorkspace.setState({ isMoving: true, reducedMotion: true });
    useWorkspace.getState().openDevice("tv");
    expect(useWorkspace.getState().target).toBe("tv");
  });
});

describe("UT-06 · camera targets vs. screens", () => {
  it("every nav target has POS and LOOK", () => {
    for (const t of NAV_TARGETS) {
      expect(POS[t]).toBeDefined();
      expect(LOOK[t]).toBeDefined();
    }
  });

  it("door view stands outside the room (z > 0)", () => {
    expect(POS.door[2]).toBeGreaterThan(0);
  });

  it("entry view looks deep into the room", () => {
    expect(LOOK.entry[2]).toBeLessThan(-5);
  });

  it("device cameras sit 0.5–4 units in front of their target", () => {
    for (const device of ["laptop", "tablet", "phone"] as const) {
      const [px, py, pz] = POS[device];
      const [lx, ly, lz] = LOOK[device];
      const dist = Math.hypot(px - lx, py - ly, pz - lz);
      expect(dist).toBeGreaterThanOrEqual(0.5);
      expect(dist).toBeLessThanOrEqual(4);
    }
  });

  it("tv look-at matches the device sound position", () => {
    const [lx, ly, lz] = LOOK.tv;
    const [sx, sy, sz] = DEVICE_SOUND_POS.tv;
    expect(Math.abs(lx - sx)).toBeLessThan(0.1);
    expect(Math.abs(ly - sy)).toBeLessThan(0.1);
    expect(Math.abs(lz - sz)).toBeLessThan(0.1);
  });
});
