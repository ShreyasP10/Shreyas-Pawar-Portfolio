"use client";

import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function toTexture(c: HTMLCanvasElement, repeat?: [number, number]): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  if (repeat) tex.repeat.set(repeat[0], repeat[1]);
  return tex;
}

function get(key: string, gen: () => HTMLCanvasElement, repeat?: [number, number]) {
  if (typeof document === "undefined") return null;
  const k = `${key}|${repeat ? repeat.join("x") : "1"}`;
  if (!cache.has(k)) cache.set(k, toTexture(gen(), repeat));
  return cache.get(k)!;
}

function noise(g: CanvasRenderingContext2D, w: number, h: number, count: number, light: string, dark: string, aMin = 0.05, aMax = 0.1) {
  for (let i = 0; i < count; i++) {
    g.globalAlpha = aMin + Math.random() * (aMax - aMin);
    g.fillStyle = Math.random() < 0.5 ? light : dark;
    g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
  g.globalAlpha = 1;
}

function woodCanvas(): HTMLCanvasElement {
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = "#5a3a22";
  g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 2) {
    const r = Math.random();
    g.globalAlpha = 0.05 + Math.random() * 0.1;
    g.fillStyle = r < 0.35 ? "#3a2413" : r < 0.7 ? "#7a5330" : "#4c3019";
    g.fillRect(x, 0, 1 + Math.random() * 2, 256);
  }
  for (let i = 0; i < 240; i++) {
    g.globalAlpha = 0.04 + Math.random() * 0.08;
    g.fillStyle = Math.random() < 0.5 ? "#422a15" : "#8a5f38";
    const len = 20 + Math.random() * 70;
    g.fillRect(Math.random() * 256, Math.random() * 256, 1.5 + Math.random() * 2, len);
  }
  g.globalAlpha = 1;
  return c;
}

function brushedCanvas(): HTMLCanvasElement {
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = "#202026";
  g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y++) {
    g.globalAlpha = 0.03 + Math.random() * 0.06;
    g.fillStyle = Math.random() < 0.5 ? "#2e2e36" : "#141419";
    g.fillRect(0, y, 256, 1);
  }
  for (let i = 0; i < 800; i++) {
    g.globalAlpha = 0.04 + Math.random() * 0.08;
    g.fillStyle = Math.random() < 0.5 ? "#3a3a44" : "#101014";
    g.fillRect(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 3, 1);
  }
  g.globalAlpha = 1;
  return c;
}

function fabricCanvas(base: string): HTMLCanvasElement {
  const c = makeCanvas(128, 128);
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "rgba(255,255,255,0.06)";
  for (let i = 0; i <= 128; i += 3) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i, 128);
    g.stroke();
    g.beginPath();
    g.moveTo(0, i);
    g.lineTo(128, i);
    g.stroke();
  }
  noise(g, 128, 128, 500, "rgba(255,255,255,0.5)", "rgba(0,0,0,0.6)", 0.04, 0.08);
  return c;
}

function speckleCanvas(base: string, light: string, dark: string): HTMLCanvasElement {
  const c = makeCanvas(128, 128);
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 128, 128);
  noise(g, 128, 128, 700, light, dark, 0.05, 0.1);
  return c;
}

function plasterCanvas(): HTMLCanvasElement {
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = "#1a1a1f";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 140; i++) {
    g.globalAlpha = 0.02 + Math.random() * 0.04;
    g.fillStyle = Math.random() < 0.5 ? "#26262c" : "#101014";
    g.beginPath();
    g.arc(Math.random() * 256, Math.random() * 256, 20 + Math.random() * 60, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  return c;
}

function floorCanvas(): HTMLCanvasElement {
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = "#0d0d11";
  g.fillRect(0, 0, 256, 256);
  const plankH = 32;
  for (let y = 0; y < 256; y += plankH) {
    g.globalAlpha = 0.3;
    g.fillStyle = "#000000";
    g.fillRect(0, y, 256, 2);
    for (let i = 0; i < 10; i++) {
      g.globalAlpha = 0.3;
      g.fillRect(Math.random() * 256, y, 2, 2);
    }
    noise(g, 256, plankH - 2, 90, "#17171c", "#0a0a0d", 0.03, 0.07);
  }
  g.globalAlpha = 1;
  return c;
}

function cityNightCanvas(): HTMLCanvasElement {
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d")!;
  const sky = g.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, "#070b1e");
  sky.addColorStop(0.55, "#0d1330");
  sky.addColorStop(1, "#141a3a");
  g.fillStyle = sky;
  g.fillRect(0, 0, 256, 256);
  g.globalAlpha = 0.9;
  g.fillStyle = "#e8e9f0";
  g.beginPath();
  g.arc(208, 52, 16, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 0.18;
  g.fillStyle = "#e8e9f0";
  g.beginPath();
  g.arc(208, 52, 30, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 1;
  for (let i = 0; i < 42; i++) {
    const bw = 10 + Math.random() * 22;
    const bh = 18 + Math.random() * 52;
    const bx = Math.random() * 256;
    const by = 30 + Math.random() * 180;
    g.fillStyle = `rgba(${8 + Math.random() * 10}, ${10 + Math.random() * 12}, ${26 + Math.random() * 16}, 1)`;
    g.fillRect(bx, by, bw, bh);
    for (let w = 0; w < 7; w++) {
      for (let hh = 0; hh < 9; hh++) {
        if (Math.random() < 0.22) {
          g.globalAlpha = 0.55 + Math.random() * 0.45;
          const warm = Math.random() < 0.55;
          g.fillStyle = warm ? "#ffc887" : "#dfe6ff";
          g.fillRect(bx + 1.5 + w * 2.8, by + 2 + hh * 4.4, 1.6, 2.4);
        }
      }
    }
  }
  g.globalAlpha = 0.25;
  g.fillStyle = "#ffd9a0";
  for (let i = 0; i < 26; i++) {
    g.fillRect(Math.random() * 256, 205 + Math.random() * 30, 1.4 + Math.random() * 1.6, 1.4);
  }
  g.globalAlpha = 1;
  return c;
}

export const woodTexture = () => get("wood", woodCanvas);
export const woodTextureRepeat = (r: [number, number]) => get("wood", woodCanvas, r);
export const brushedTexture = () => get("brushed", brushedCanvas);
export const brushedTextureRepeat = (r: [number, number]) => get("brushed", brushedCanvas, r);
export const fabricTexture = (base: string) => get(`fabric:${base}`, () => fabricCanvas(base));
export const speckleTexture = (base: string, light: string, dark: string) =>
  get(`speckle:${base}:${light}:${dark}`, () => speckleCanvas(base, light, dark));
export const plasterTexture = () => get("plaster", plasterCanvas);
export const plasterTextureRepeat = (r: [number, number]) => get("plaster", plasterCanvas, r);
export const floorTexture = () => get("floor", floorCanvas);
export const floorTextureRepeat = (r: [number, number]) => get("floor", floorCanvas, r);
export const cityNightTexture = () => get("cityNight", cityNightCanvas);
