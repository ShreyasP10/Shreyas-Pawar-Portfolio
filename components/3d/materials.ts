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
  tex.anisotropy = 4;
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

// Shared speckle palette (reused across surfaces to limit texture units)
const speckleDark = () => get("speckle:dark", () => speckleCanvas("#101014", "#1c1c24", "#07070a"));
const speckleMid = () => get("speckle:mid", () => speckleCanvas("#14141a", "#1d1d26", "#0a0a0e"));
const speckleWarm = () => get("speckle:warm", () => speckleCanvas("#1a1610", "#2a2218", "#0f0a07"));
const speckleCool = () => get("speckle:cool", () => speckleCanvas("#10141a", "#181e2a", "#080b10"));
const speckleTrim = () => get("speckle:trim", () => speckleCanvas("#101014", "#18181e", "#08080b"));
const speckleCarpet = () => get("speckle:carpet", () => speckleCanvas("#1a2028", "#232b36", "#0e1218"));

export const speckleTexture = (_base: string, _light: string, _dark: string) => speckleDark();
export const speckleTextureDark = speckleDark;
export const speckleTextureMid = speckleMid;
export const speckleTextureWarm = speckleWarm;
export const speckleTextureCool = speckleCool;
export const speckleTextureTrim = speckleTrim;
export const speckleTextureCarpet = speckleCarpet;

export const plasterTexture = () => get("plaster", plasterCanvas);
export const plasterTextureRepeat = (r: [number, number]) => get("plaster", plasterCanvas, r);
export const floorTexture = () => get("floor", floorCanvas);
export const floorTextureRepeat = (r: [number, number]) => get("floor", floorCanvas, r);
export const cityNightTexture = () => get("cityNight", cityNightCanvas);

function wallBoardCanvas(): HTMLCanvasElement {
  const c = makeCanvas(1024, 320);
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 320);
  grad.addColorStop(0, "#1a1521");
  grad.addColorStop(1, "#0f0c15");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 320);
  noise(g, 1024, 320, 420, "#ffffff", "#000000", 0.015, 0.035);

  g.strokeStyle = "rgba(255,215,0,0.55)";
  g.lineWidth = 3;
  g.strokeRect(16, 16, 992, 288);

  const g2 = g as CanvasRenderingContext2D & { letterSpacing?: string };
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = "rgba(255,215,0,0.4)";
  g.shadowBlur = 22;

  g.fillStyle = "#ffd700";
  g.font = "900 116px 'Segoe UI', Arial, sans-serif";
  g2.letterSpacing = "24px";
  g.fillText("SHREYAS", 512, 92);
  g.fillText("PAWAR", 512, 188);
  g2.letterSpacing = "0px";

  g.fillStyle = "#7dd3fc";
  g.font = "600 19px 'Courier New', monospace";
  g.shadowColor = "rgba(125,211,252,0.6)";
  g.shadowBlur = 10;
  g2.letterSpacing = "5px";
  g.fillText("SOFTWARE ENGINEER · AI DEVELOPER · FULL STACK DEVELOPER · INNOVATOR", 512, 236);
  g2.letterSpacing = "0px";

  g.shadowBlur = 0;
  g.font = "600 21px 'Courier New', monospace";
  const tags = ["PROBLEM SOLVER", "TECH ENTHUSIAST", "LIFELONG LEARNER", "OPEN SOURCE"];
  const tagW = tags.map((t) => g.measureText(t).width + 34);
  const totalW = tagW.reduce((a, b) => a + b, 0) + 14 * (tags.length - 1);
  let x = 512 - totalW / 2;
  tags.forEach((t, i) => {
    g.fillStyle = "rgba(255,215,0,0.12)";
    const w = tagW[i];
    const h = 40;
    const y = 264;
    const r = 20;
    g.beginPath();
    g.roundRect(x, y - h / 2, w, h, r);
    g.fill();
    g.strokeStyle = "rgba(255,215,0,0.5)";
    g.lineWidth = 1.5;
    g.stroke();
    g.fillStyle = "#ffd700";
    g.fillText(t, x + w / 2, y + 1);
    x += w + 14;
  });
  return c;
}

export const wallBoardTexture = () => get("wallBoard", wallBoardCanvas);

function asusLidCanvas(): HTMLCanvasElement {
  const c = makeCanvas(1024, 640);
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 640);
  grad.addColorStop(0, "#2b2d33");
  grad.addColorStop(0.5, "#3a3d46");
  grad.addColorStop(1, "#25272d");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 640);
  for (let i = 0; i < 900; i++) {
    g.globalAlpha = 0.02 + Math.random() * 0.045;
    g.fillStyle = Math.random() < 0.5 ? "#ffffff" : "#000000";
    g.fillRect(Math.random() * 1024, 0, 1, 640);
  }
  g.globalAlpha = 1;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#e6e4e0";
  g.font = "italic 800 200px 'Segoe UI', Arial, sans-serif";
  g.fillText("ASUS", 512, 262);
  g.strokeStyle = "rgba(230,228,224,0.35)";
  g.lineWidth = 2;
  g.strokeText("ASUS", 512, 262);
  g.fillStyle = "#c9c6cd";
  g.font = "600 52px 'Segoe UI', Arial, sans-serif";
  g.fillText("VIVOBOOK", 512, 420);
  g.fillStyle = "#8f8c99";
  g.font = "600 34px 'Segoe UI', Arial, sans-serif";
  g.fillText("16X", 512, 476);
  return c;
}

export const asusLidTexture = () => get("asusLid", asusLidCanvas);

function asusChinCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 96);
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 512, 96);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#d8d6d2";
  g.font = "600 42px 'Segoe UI', Arial, sans-serif";
  g.fillText("VIVOBOOK 16X", 256, 48);
  return c;
}

export const asusChinTexture = () => get("asusChin", asusChinCanvas);

function mugTextCanvas(): HTMLCanvasElement {
  const c = makeCanvas(1024, 256);
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#2b2b32");
  grad.addColorStop(0.5, "#1d1d23");
  grad.addColorStop(1, "#27272e");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 256);
  noise(g, 1024, 256, 260, "#ffffff", "#000000", 0.02, 0.05);

  g.strokeStyle = "rgba(255,215,0,0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(0, 46);
  g.lineTo(1024, 46);
  g.stroke();
  g.beginPath();
  g.moveTo(0, 210);
  g.lineTo(1024, 210);
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#ffd700";
  g.font = "700 66px 'Courier New', monospace";
  g.shadowColor = "rgba(255,215,0,0.55)";
  g.shadowBlur = 20;
  g.fillText("CODE · BUILD · REPEAT", 512, 128);
  return c;
}

export const mugTextTexture = () => get("mugText", mugTextCanvas);
