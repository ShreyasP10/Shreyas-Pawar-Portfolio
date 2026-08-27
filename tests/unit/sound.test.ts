import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore, useCameraStore, POS } from "@/components/3d/store";

class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  state: AudioContextState = "running";
  currentTime = 0;
  destination: unknown = {};

  constructor() {
    FakeAudioContext.instances.push(this);
  }

  resume() {
    this.state = "running";
  }

  createOscillator() {
    return {
      type: "sine",
      frequency: {
        value: 0,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  createGain() {
    return {
      gain: {
        value: 0,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
  }

  createPanner() {
    return {
      panningModel: "",
      distanceModel: "",
      refDistance: 0,
      maxDistance: 0,
      rolloffFactor: 0,
      positionX: { setValueAtTime: () => {} },
      positionY: { setValueAtTime: () => {} },
      positionZ: { setValueAtTime: () => {} },
      connect: () => {},
      disconnect: () => {},
    };
  }
}

(globalThis as unknown as { window: unknown }).window = {
  AudioContext: FakeAudioContext,
};

beforeEach(() => {
  FakeAudioContext.instances.length = 0;
  useUIStore.setState({
    soundOn: false,
    target: "door",
    activeDevice: null,
    reducedMotion: false,
    isMoving: false,
    targetCameraPosition: POS.door,
    targetLookAt: useUIStore.getState().targetLookAt,
  });
  useCameraStore.setState({
    targetCameraPosition: POS.door,
    targetLookAt: useCameraStore.getState().targetLookAt,
  });
});

describe("UT-07 · audio respects soundOn", () => {
  it("creates no AudioContext while sound is off", () => {
    useUIStore.getState().go("wall");
    useUIStore.getState().openDevice("laptop");
    useUIStore.getState().closeDoor();
    expect(FakeAudioContext.instances).toHaveLength(0);
  });

  it("creates one shared AudioContext once sound is on", () => {
    useUIStore.getState().setSound(true);
    expect(FakeAudioContext.instances).toHaveLength(1);

    useUIStore.getState().go("wall");
    useUIStore.getState().openDevice("tv");
    expect(FakeAudioContext.instances).toHaveLength(1);
  });

  it("playing device tones reuses the shared context without creating another", () => {
    useUIStore.getState().setSound(true);

    useUIStore.getState().openDevice("laptop");
    useUIStore.getState().navigateTab("tv", "experience");
    expect(FakeAudioContext.instances).toHaveLength(0);
  });
});
