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
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);

  // Gold geometric pattern for curtains
  if (base === "#050505") {
    g.strokeStyle = "#ffd700";
    g.lineWidth = 1;
    g.globalAlpha = 0.4;
    for (let i = 0; i < 256; i += 32) {
      for (let j = 0; j < 256; j += 32) {
        g.strokeRect(i + 4, j + 4, 24, 24);
        g.beginPath();
        g.moveTo(i + 4, j + 4);
        g.lineTo(i + 28, j + 28);
        g.stroke();
      }
    }
  } else {
    g.strokeStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i <= 256; i += 6) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 256);
      g.stroke();
      g.beginPath();
      g.moveTo(0, i);
      g.lineTo(256, i);
      g.stroke();
    }
  }
  noise(g, 256, 256, 500, "rgba(255,255,255,0.2)", "rgba(0,0,0,0.4)", 0.04, 0.08);
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
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = "#050507";
  g.fillRect(0, 0, 512, 512);

  // Organic gold veining
  g.strokeStyle = "#ffd700";
  for (let i = 0; i < 8; i++) {
    g.globalAlpha = 0.15 + Math.random() * 0.3;
    g.lineWidth = 0.5 + Math.random() * 2;
    g.beginPath();
    let x = Math.random() * 512;
    let y = 0;
    g.moveTo(x, y);
    while (y < 512) {
      x += (Math.random() - 0.5) * 40 + 20; // diagonal-ish
      y += Math.random() * 30 + 10;
      g.lineTo(x, y);
    }
    g.stroke();

    // Finer veins
    g.lineWidth = 0.2;
    g.globalAlpha = 0.1;
    for (let j = 0; j < 3; j++) {
      g.beginPath();
      g.moveTo(x - 20, y - 50);
      g.lineTo(x + 10, y + 20);
      g.stroke();
    }
  }

  noise(g, 512, 512, 1000, "#17171c", "#000000", 0.02, 0.05);
  g.globalAlpha = 1;
  return c;
}

function cityNightCanvas(): HTMLCanvasElement {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d")!;
  // Deep night sky
  const sky = g.createLinearGradient(0, 0, 0, 512);
  sky.addColorStop(0, "#040614");
  sky.addColorStop(0.45, "#0a1030");
  sky.addColorStop(0.72, "#131b42");
  sky.addColorStop(1, "#1c2450");
  g.fillStyle = sky;
  g.fillRect(0, 0, 512, 512);

  // Stars
  for (let i = 0; i < 130; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 330;
    const r = 0.4 + Math.random() * 1.1;
    g.globalAlpha = 0.25 + Math.random() * 0.65;
    g.fillStyle = Math.random() < 0.75 ? "#dfe6ff" : "#ffd9a0";
    g.fillRect(sx, sy, r, r);
  }
  g.globalAlpha = 1;

  // Moon + halo
  g.fillStyle = "#eef1ff";
  g.beginPath();
  g.arc(392, 84, 30, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 0.16;
  g.fillStyle = "#eef1ff";
  g.beginPath();
  g.arc(392, 84, 58, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 0.07;
  g.beginPath();
  g.arc(392, 84, 92, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 1;
  // Moon craters
  g.fillStyle = "rgba(200, 208, 235, 0.5)";
  for (const [cx, cy, cr] of [[380, 76, 5], [398, 92, 7], [404, 72, 4], [386, 96, 3]] as const) {
    g.beginPath();
    g.arc(cx, cy, cr, 0, Math.PI * 2);
    g.fill();
  }

  // Far building layer (darker silhouettes)
  const horizon = 368;
  for (let i = 0; i < 26; i++) {
    const bw = 26 + Math.random() * 46;
    const bh = 60 + Math.random() * 150;
    const bx = Math.random() * 512;
    const top = horizon - bh;
    g.fillStyle = "#0d1230";
    g.fillRect(bx, top, bw, bh);
    // sparse cool windows
    for (let w = 0; w < Math.floor(bw / 7); w++) {
      for (let hh = 0; hh < Math.floor(bh / 11); hh++) {
        if (Math.random() < 0.1) {
          g.globalAlpha = 0.35 + Math.random() * 0.4;
          g.fillStyle = "#bfd4ff";
          g.fillRect(bx + 3 + w * 7, top + 5 + hh * 11, 2.6, 4);
        }
      }
    }
  }
  g.globalAlpha = 1;

  // Near building layer (taller, lit windows)
  for (let i = 0; i < 18; i++) {
    const bw = 34 + Math.random() * 58;
    const bh = 110 + Math.random() * 210;
    const bx = Math.random() * 512;
    const top = horizon - bh;
    const shade = 8 + Math.random() * 8;
    g.fillStyle = `rgb(${shade + 6}, ${shade + 8}, ${shade + 26})`;
    g.fillRect(bx, top, bw, bh);
    // window grid
    const cols = Math.floor(bw / 8);
    const rows = Math.floor(bh / 12);
    for (let w = 0; w < cols; w++) {
      for (let hh = 0; hh < rows; hh++) {
        const warm = Math.random() < 0.58;
        if (Math.random() < 0.34) {
          g.globalAlpha = 0.5 + Math.random() * 0.5;
          g.fillStyle = warm ? "#ffc887" : "#dfe6ff";
          g.fillRect(bx + 3 + w * 8, top + 4 + hh * 12, 3.4, 5.4);
        }
      }
    }
  }
  g.globalAlpha = 1;

  // Antennae/roof details on near layer
  for (let i = 0; i < 9; i++) {
    const bx = 20 + Math.random() * 470;
    g.fillStyle = "#05070f";
    g.fillRect(bx, 40 + Math.random() * 200, 2, 30 + Math.random() * 60);
  }

  // Distant traffic glow along the horizon
  const glow = g.createLinearGradient(0, horizon - 24, 0, horizon + 46);
  glow.addColorStop(0, "rgba(255, 180, 110, 0.0)");
  glow.addColorStop(0.5, "rgba(255, 190, 120, 0.10)");
  glow.addColorStop(1, "rgba(255, 200, 130, 0.22)");
  g.fillStyle = glow;
  g.fillRect(0, horizon - 24, 512, 70);
  g.globalAlpha = 0.55;
  g.fillStyle = "#ffd9a0";
  for (let i = 0; i < 60; i++) {
    g.fillRect(Math.random() * 512, horizon + 4 + Math.random() * 16, 1.4 + Math.random() * 2.2, 1.4);
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
