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
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = "#3e2717";
  g.fillRect(0, 0, 512, 512);

  // Growth ring layers and wavy organic grain
  for (let x = 0; x < 512; x += 1.5) {
    const wave = Math.sin(x * 0.04) * 8 + Math.sin(x * 0.12) * 3;
    const r = Math.random();
    g.globalAlpha = 0.06 + Math.random() * 0.12;
    g.fillStyle = r < 0.3 ? "#24140b" : r < 0.65 ? "#5a3a22" : r < 0.85 ? "#6d472a" : "#1a0d06";
    g.fillRect(x + wave, 0, 1 + Math.random() * 2.5, 512);
  }

  // Micro-pores and fine wood fibers
  for (let i = 0; i < 600; i++) {
    g.globalAlpha = 0.05 + Math.random() * 0.08;
    g.fillStyle = Math.random() < 0.5 ? "#2a180d" : "#7b5030";
    const len = 30 + Math.random() * 120;
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    g.fillRect(x, y, 1.2 + Math.random() * 1.5, len);
  }

  // Subtle warm varnish highlights
  const grad = g.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "rgba(255, 215, 0, 0.04)");
  grad.addColorStop(0.5, "rgba(0, 0, 0, 0.06)");
  grad.addColorStop(1, "rgba(255, 180, 50, 0.03)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);

  g.globalAlpha = 1;
  return c;
}

function brushedCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = "#18181f";
  g.fillRect(0, 0, 512, 512);

  // Micro fine linear brushed metal streaks
  for (let y = 0; y < 512; y++) {
    g.globalAlpha = 0.04 + Math.random() * 0.08;
    g.fillStyle = Math.random() < 0.5 ? "#2d2d38" : "#0d0d12";
    g.fillRect(0, y, 512, 1);
  }

  for (let i = 0; i < 1200; i++) {
    g.globalAlpha = 0.05 + Math.random() * 0.1;
    g.fillStyle = Math.random() < 0.6 ? "#383846" : "#08080a";
    g.fillRect(Math.random() * 512, Math.random() * 512, 3 + Math.random() * 6, 1);
  }

  // Anisotropic diagonal metallic sheen
  const grad = g.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
  grad.addColorStop(0.3, "rgba(0, 0, 0, 0.08)");
  grad.addColorStop(0.5, "rgba(255, 255, 255, 0.09)");
  grad.addColorStop(0.7, "rgba(0, 0, 0, 0.08)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);

  g.globalAlpha = 1;
  return c;
}

function fabricCanvas(base: string): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);

  // Gold geometric pattern for luxury curtains
  if (base === "#050505") {
    g.strokeStyle = "#ffd700";
    g.lineWidth = 1.2;
    g.globalAlpha = 0.35;
    for (let i = 0; i < 512; i += 32) {
      for (let j = 0; j < 512; j += 32) {
        g.strokeRect(i + 4, j + 4, 24, 24);
        g.beginPath();
        g.moveTo(i + 4, j + 4);
        g.lineTo(i + 28, j + 28);
        g.stroke();
      }
    }
  } else {
    // Interlaced micro weave threads
    g.strokeStyle = "rgba(255,255,255,0.06)";
    g.lineWidth = 1;
    for (let i = 0; i <= 512; i += 4) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 512);
      g.stroke();
      g.beginPath();
      g.moveTo(0, i);
      g.lineTo(512, i);
      g.stroke();
    }
  }
  noise(g, 512, 512, 1000, "rgba(255,255,255,0.18)", "rgba(0,0,0,0.35)", 0.03, 0.07);
  return c;
}

function deskMatCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = "#121217";
  g.fillRect(0, 0, 512, 512);

  // Topographical contour lines
  g.strokeStyle = "rgba(255, 215, 0, 0.12)";
  g.lineWidth = 1;
  for (let r = 30; r < 360; r += 28) {
    g.beginPath();
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
      const radius = r + Math.sin(theta * 3) * 14 + Math.cos(theta * 5) * 8;
      const x = 256 + Math.cos(theta) * radius;
      const y = 256 + Math.sin(theta) * radius;
      if (theta === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.closePath();
    g.stroke();
  }

  // Crosshair coordinate markers
  g.strokeStyle = "rgba(125, 211, 252, 0.25)";
  g.lineWidth = 1;
  g.strokeRect(40, 40, 432, 432);
  g.beginPath();
  g.moveTo(256, 30);
  g.lineTo(256, 50);
  g.moveTo(256, 462);
  g.lineTo(256, 482);
  g.moveTo(30, 256);
  g.lineTo(50, 256);
  g.moveTo(462, 256);
  g.lineTo(482, 256);
  g.stroke();

  noise(g, 512, 512, 600, "#2a2a34", "#0a0a0e", 0.03, 0.06);
  return c;
}

function speckleCanvas(base: string, light: string, dark: string): HTMLCanvasElement {
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  noise(g, 256, 256, 1200, light, dark, 0.04, 0.09);
  return c;
}

function plasterCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = "#16161b";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 200; i++) {
    g.globalAlpha = 0.02 + Math.random() * 0.04;
    g.fillStyle = Math.random() < 0.5 ? "#24242b" : "#0d0d11";
    g.beginPath();
    g.arc(Math.random() * 512, Math.random() * 512, 30 + Math.random() * 80, 0, Math.PI * 2);
    g.fill();
  }
  noise(g, 512, 512, 1000, "#2c2c36", "#09090c", 0.02, 0.05);
  g.globalAlpha = 1;
  return c;
}

function acousticSlatCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = "#0a0a0d";
  g.fillRect(0, 0, 512, 512);

  // Vertical wood slat panels with deep shadow grooves
  const slatWidth = 16;
  const gapWidth = 6;
  const total = slatWidth + gapWidth;

  for (let x = 0; x < 512; x += total) {
    // Slat base
    g.fillStyle = "#2c1c11";
    g.fillRect(x, 0, slatWidth, 512);

    // Slat wood grain
    for (let i = 0; i < 6; i++) {
      g.globalAlpha = 0.08 + Math.random() * 0.12;
      g.fillStyle = Math.random() < 0.5 ? "#4a301e" : "#1e120a";
      g.fillRect(x + Math.random() * slatWidth, 0, 1.5, 512);
    }

    // Slat highlight edge
    g.globalAlpha = 0.2;
    g.fillStyle = "#ffd700";
    g.fillRect(x, 0, 1, 512);

    // Deep shadow groove
    g.globalAlpha = 0.9;
    g.fillStyle = "#000000";
    g.fillRect(x + slatWidth, 0, gapWidth, 512);
  }

  g.globalAlpha = 1;
  return c;
}

function floorCanvas(): HTMLCanvasElement {
  const c = makeCanvas(1024, 1024);
  const g = c.getContext("2d")!;
  g.fillStyle = "#050508";
  g.fillRect(0, 0, 1024, 1024);

  // Seamless large slate tile grid seams
  g.strokeStyle = "rgba(255, 255, 255, 0.04)";
  g.lineWidth = 2;
  g.strokeRect(0, 0, 512, 512);
  g.strokeRect(512, 0, 512, 512);
  g.strokeRect(0, 512, 512, 512);
  g.strokeRect(512, 512, 512, 512);

  // Luxurious organic gold and bronze mineral veins
  for (let i = 0; i < 14; i++) {
    const isGold = Math.random() < 0.65;
    g.strokeStyle = isGold ? "#ffd700" : "#7dd3fc";
    g.globalAlpha = 0.12 + Math.random() * 0.22;
    g.lineWidth = 0.8 + Math.random() * 2.2;
    g.beginPath();
    let x = Math.random() * 1024;
    let y = 0;
    g.moveTo(x, y);
    while (y < 1024) {
      x += (Math.random() - 0.5) * 50 + 25;
      y += Math.random() * 35 + 15;
      g.lineTo(x, y);
    }
    g.stroke();

    // Fine branching tributary veins
    g.lineWidth = 0.3;
    g.globalAlpha = 0.08;
    for (let j = 0; j < 4; j++) {
      g.beginPath();
      g.moveTo(x - 30, y - 60);
      g.lineTo(x + 20, y + 30);
      g.stroke();
    }
  }

  noise(g, 1024, 1024, 2500, "#181820", "#000000", 0.02, 0.05);
  g.globalAlpha = 1;
  return c;
}

export const woodTexture = () => get("wood", woodCanvas);
export const woodTextureRepeat = (r: [number, number]) => get("wood", woodCanvas, r);
export const brushedTexture = () => get("brushed", brushedCanvas);
export const brushedTextureRepeat = (r: [number, number]) => get("brushed", brushedCanvas, r);
export const fabricTexture = (base: string) => get(`fabric:${base}`, () => fabricCanvas(base));
export const deskMatTexture = () => get("deskMat", deskMatCanvas);
export const acousticSlatTexture = (r?: [number, number]) => get("acousticSlat", acousticSlatCanvas, r);

// Shared speckle palette
const speckleDark = () => get("speckle:dark", () => speckleCanvas("#101014", "#1c1c24", "#07070a"));
const speckleMid = () => get("speckle:mid", () => speckleCanvas("#14141a", "#1d1d26", "#0a0a0e"));
const speckleWarm = () => get("speckle:warm", () => speckleCanvas("#1a1610", "#2a2218", "#0f0a07"));
const speckleCool = () => get("speckle:cool", () => speckleCanvas("#10141a", "#181e2a", "#080b10"));
const speckleTrim = () => get("speckle:trim", () => speckleCanvas("#101014", "#18181e", "#08080b"));
const speckleCarpet = () => get("speckle:carpet", () => speckleCanvas("#1a2028", "#232b36", "#0e1218"));

export const speckleTexture = () => speckleDark();
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

export function disposeTextureCache() {
  cache.forEach((tex) => tex.dispose());
  cache.clear();
}

function wallBoardCanvas(): HTMLCanvasElement {
  const c = makeCanvas(1024, 320);
  const g = c.getContext("2d")!;
  g.fillStyle = "#0a0a0a";
  g.fillRect(0, 0, 1024, 320);
  noise(g, 1024, 320, 300, "#ffffff", "#000000", 0.02, 0.04);

  const g2 = g as unknown as { letterSpacing?: string };
  g.textAlign = "center";
  g.textBaseline = "middle";

  // Outer Glow
  g.shadowColor = "rgba(255, 215, 0, 0.4)";
  g.shadowBlur = 40;

  g.fillStyle = "#ffd700";
  g.font = "900 100px 'Segoe UI', Arial, sans-serif";
  if (g2.letterSpacing !== undefined) g2.letterSpacing = "22px";
  g.fillText("SHREYAS PAWAR", 512, 160);

  g.shadowBlur = 0;

  // Subtle decorative lines
  g.strokeStyle = "rgba(255, 215, 0, 0.3)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(250, 230);
  g.lineTo(774, 230);
  g.stroke();

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
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;

  // Background
  g.fillStyle = "#0a0a0a";
  g.fillRect(0, 0, 512, 512);

  // Subtle Noise/Grain
  noise(g, 512, 512, 400, "#ffffff", "#000000", 0.03, 0.06);

  // Gold Ring
  g.strokeStyle = "#ffd700";
  g.lineWidth = 8;
  g.beginPath();
  g.arc(256, 256, 180, 0, Math.PI * 2);
  g.stroke();

  // Inner Ring
  g.lineWidth = 2;
  g.beginPath();
  g.arc(256, 256, 165, 0, Math.PI * 2);
  g.stroke();

  // Monogram SP
  g.fillStyle = "#ffd700";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "bold 140px 'Segoe UI', Arial, sans-serif";
  g.fillText("SP", 256, 256);

  // Bottom text
  const g2 = g as unknown as { letterSpacing?: string };
  g.font = "300 24px 'Segoe UI', Arial, sans-serif";
  if (g2.letterSpacing !== undefined) g2.letterSpacing = "10px";
  g.fillText("EST. 2022", 256, 380);

  return c;
}

export const mugTextTexture = () => get("mugText", mugTextCanvas);

function bookSpinesCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  const books = [
    { title: "SYSTEM DESIGN", color: "#1e293b", accent: "#38bdf8" },
    { title: "DISTRIBUTED SYSTEMS", color: "#18181b", accent: "#fbbf24" },
    { title: "THREE.JS & WEBGL", color: "#0f172a", accent: "#4ade80" },
    { title: "REACT ARCHITECTURE", color: "#172554", accent: "#60a5fa" },
    { title: "DEEP LEARNING", color: "#2e1065", accent: "#c084fc" },
    { title: "CLEAN CODE", color: "#052e16", accent: "#34d399" },
  ];
  const w = 512 / books.length;
  books.forEach((b, i) => {
    g.fillStyle = b.color;
    g.fillRect(i * w, 0, w, 512);
    // Gold/accent spine foil bars
    g.fillStyle = b.accent;
    g.fillRect(i * w + 4, 30, w - 8, 4);
    g.fillRect(i * w + 4, 470, w - 8, 4);

    g.save();
    g.translate(i * w + w / 2, 256);
    g.rotate(-Math.PI / 2);
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#ffffff";
    g.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    g.fillText(b.title, 0, 0);
    g.restore();
  });
  return c;
}

export const bookSpinesTexture = () => get("bookSpines", bookSpinesCanvas);

function posterCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = "#0c0d12";
  g.fillRect(0, 0, 512, 512);

  // Geometric abstract generative artwork
  g.strokeStyle = "rgba(255, 215, 0, 0.4)";
  g.lineWidth = 2;
  g.strokeRect(32, 32, 448, 448);

  for (let i = 0; i < 8; i++) {
    g.beginPath();
    g.arc(256, 256, 40 + i * 24, 0, Math.PI * 1.5);
    g.strokeStyle = i % 2 === 0 ? "rgba(255, 215, 0, 0.5)" : "rgba(125, 211, 252, 0.4)";
    g.stroke();
  }

  g.fillStyle = "#ffd700";
  g.font = "bold 24px 'Segoe UI', Arial, sans-serif";
  g.textAlign = "center";
  g.fillText("CREATE · BUILD · SCALE", 256, 420);
  return c;
}

export const posterTexture = () => get("poster", posterCanvas);
