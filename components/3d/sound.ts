"use client";

import type { AudioListener } from "three";

let context: AudioContext | null = null;
let listener: AudioListener | null = null;
let humNodes: {
  oscillators: OscillatorNode[];
  gain: GainNode;
  panner: PannerNode;
} | null = null;

export const DEVICE_SOUND_POS: Record<
  "laptop" | "tablet" | "phone" | "tv",
  [number, number, number]
> = {
  laptop: [0, 1.1, -7.4],
  tablet: [0.75, 1.1, -7.3],
  phone: [-0.75, 1.05, -7.35],
  tv: [4.75, 1.9, -4.5],
};

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return null;
    context = new AudioCtor();
  }
  if (context.state === "suspended") {
    void context.resume();
  }
  return context;
}

function createPanner(ctx: AudioContext, position: [number, number, number]): PannerNode {
  const panner = ctx.createPanner();
  panner.panningModel = "HRTF";
  panner.distanceModel = "linear";
  panner.refDistance = 1.5;
  panner.maxDistance = 14;
  panner.rolloffFactor = 1;
  panner.positionX.setValueAtTime(position[0], ctx.currentTime);
  panner.positionY.setValueAtTime(position[1], ctx.currentTime);
  panner.positionZ.setValueAtTime(position[2], ctx.currentTime);
  return panner;
}

export function setAudioListener(next: AudioListener | null) {
  listener = next;
}

export function playTone(
  frequency = 520,
  duration = 0.05,
  gainValue = 0.03
) {
  const ctx = ensureContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(frequency * 0.8, 1),
    now + duration
  );

  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

export function playPositionalTone(
  frequency = 520,
  duration = 0.05,
  gainValue = 0.03,
  position: [number, number, number]
) {
  const ctx = ensureContext();
  if (!ctx) return;
  if (!listener) {
    playTone(frequency, duration, gainValue);
    return;
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const panner = createPanner(ctx, position);
  const now = ctx.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(frequency * 0.82, 1),
    now + duration
  );

  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(panner);
  panner.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

export function startHum(position: [number, number, number], volume = 0.006) {
  const ctx = ensureContext();
  if (!ctx || !listener || humNodes) return;

  const panner = createPanner(ctx, position);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.4);

  const oscillators = [90, 180.5].map((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const oscGain = ctx.createGain();
    oscGain.gain.value = freq === 90 ? 1 : 0.35;
    osc.connect(oscGain);
    oscGain.connect(gain);
    osc.start();
    return osc;
  });

  gain.connect(panner);
  panner.connect(ctx.destination);
  humNodes = { oscillators, gain, panner };
}

export function stopHum() {
  const ctx = ensureContext();
  if (!ctx || !humNodes) return;
  const { oscillators, gain, panner } = humNodes;
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  const stopAt = now + 0.35;
  oscillators.forEach((osc) => osc.stop(stopAt));
  panner.disconnect();
  humNodes = null;
}
