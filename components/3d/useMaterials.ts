"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  woodTextureRepeat,
  brushedTexture,
  speckleTextureDark,
  speckleTextureMid,
  speckleTextureWarm,
  speckleTextureCool,
  speckleTextureTrim,
  speckleTextureCarpet,
  plasterTextureRepeat,
  floorTextureRepeat,
  mugTextTexture,
  deskMatTexture,
  acousticSlatTexture,
  posterTexture,
  bookSpinesTexture,
} from "./materials";

export interface MaterialCache {
  floor: THREE.MeshStandardMaterial;
  wall: THREE.MeshStandardMaterial;
  slats: THREE.MeshStandardMaterial;
  desk: THREE.MeshStandardMaterial;
  deskMat: THREE.MeshStandardMaterial;
  poster: THREE.MeshStandardMaterial;
  books: THREE.MeshStandardMaterial;
  leg: THREE.MeshStandardMaterial;
  mat: THREE.MeshStandardMaterial;
  matTop: THREE.MeshStandardMaterial;
  lampShade: THREE.MeshStandardMaterial;
  shelfWood: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  paper: THREE.MeshStandardMaterial;
  cover: THREE.MeshStandardMaterial;
  pegboard: THREE.MeshStandardMaterial;
  pot: THREE.MeshStandardMaterial;
  trim: THREE.MeshStandardMaterial;
  doorWood: THREE.MeshStandardMaterial;
  carpet: THREE.MeshStandardMaterial;
  mugText: THREE.MeshStandardMaterial;
  ceiling: THREE.MeshStandardMaterial;
  ceilingBand: THREE.MeshStandardMaterial;
  ceilingLight: THREE.MeshStandardMaterial;
  floorTrim: THREE.MeshStandardMaterial;
  monitorScreen: THREE.MeshBasicMaterial;
  screenDark: THREE.MeshBasicMaterial;
  brushed: THREE.MeshStandardMaterial;
  deck: THREE.MeshStandardMaterial;
  asusLid: THREE.MeshStandardMaterial;
  asusChin: THREE.MeshStandardMaterial;
}

export function useMaterials(): MaterialCache {
  return useMemo(() => {
    const floorTex = floorTextureRepeat([5, 4]);
    const wallTex = plasterTextureRepeat([4, 2]);
    const slatsTex = acousticSlatTexture([6, 1]);
    const deskTex = woodTextureRepeat([3, 1.5]);
    const deskMatTex = deskMatTexture();
    const posterTex = posterTexture();
    const booksTex = bookSpinesTexture();
    const legTex = woodTextureRepeat([1, 2]);
    const matTex = speckleTextureWarm();
    const matTopTex = speckleTextureMid();
    const lampShadeTex = brushedTexture();
    const shelfWoodTex = woodTextureRepeat([1, 2]);
    const rubberTex = speckleTextureDark();
    const paperTex = speckleTextureMid();
    const coverTex = speckleTextureWarm();
    const pegboardTex = speckleTextureCool();
    const potTex = speckleTextureCool();
    const trimTex = speckleTextureTrim();
    const doorWoodTex = woodTextureRepeat([1, 2.5]);
    const carpetTex = speckleTextureCarpet();
    const mugTextTex = mugTextTexture();
    const brushedTex = brushedTexture();
    const deckTex = speckleTextureDark();
    const asusLidTex = woodTextureRepeat([1, 1]);
    const asusChinTex = woodTextureRepeat([1, 1]);

    return {
      floor: new THREE.MeshStandardMaterial({ map: floorTex, color: "#ffffff", roughness: 0.2, metalness: 0.4 }),
      wall: new THREE.MeshStandardMaterial({ map: wallTex, color: "#0a0a0a", roughness: 0.9 }),
      slats: new THREE.MeshStandardMaterial({ map: slatsTex, roughness: 0.8 }),
      desk: new THREE.MeshStandardMaterial({ map: deskTex, color: "#ffffff", roughness: 0.6, metalness: 0.1 }),
      deskMat: new THREE.MeshStandardMaterial({ map: deskMatTex, color: "#ffffff", roughness: 0.85 }),
      poster: new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.2 }),
      books: new THREE.MeshStandardMaterial({ map: booksTex, color: "#ffffff", roughness: 0.7 }),
      leg: new THREE.MeshStandardMaterial({ map: legTex, color: "#ffffff", roughness: 0.6 }),
      mat: new THREE.MeshStandardMaterial({ map: matTex, color: "#ffffff", roughness: 0.95 }),
      matTop: new THREE.MeshStandardMaterial({ map: matTopTex, color: "#ffffff", roughness: 1 }),
      lampShade: new THREE.MeshStandardMaterial({ map: lampShadeTex, color: "#1a1a2e", roughness: 0.5, metalness: 0.3 }),
      shelfWood: new THREE.MeshStandardMaterial({ map: shelfWoodTex, color: "#ffffff", roughness: 0.65 }),
      rubber: new THREE.MeshStandardMaterial({ map: rubberTex, color: "#ffffff", roughness: 0.35, metalness: 0.6 }),
      paper: new THREE.MeshStandardMaterial({ map: paperTex, color: "#ffffff", roughness: 0.6 }),
      cover: new THREE.MeshStandardMaterial({ map: coverTex, color: "#ffffff", roughness: 0.5 }),
      pegboard: new THREE.MeshStandardMaterial({ map: pegboardTex, color: "#1a1a2e", roughness: 0.8 }),
      pot: new THREE.MeshStandardMaterial({ map: potTex, color: "#1a1a2e", roughness: 0.7 }),
      trim: new THREE.MeshStandardMaterial({ map: trimTex, color: "#ffffff", roughness: 0.8 }),
      doorWood: new THREE.MeshStandardMaterial({ map: doorWoodTex, color: "#ffffff", roughness: 0.5, metalness: 0.1 }),
      carpet: new THREE.MeshStandardMaterial({ map: carpetTex, color: "#121218", roughness: 0.95 }),
      mugText: new THREE.MeshStandardMaterial({ map: mugTextTex, color: "#ffffff", roughness: 0.3, metalness: 0.2 }),
      ceiling: new THREE.MeshStandardMaterial({ color: "#0d0d11", roughness: 0.92 }),
      ceilingBand: new THREE.MeshStandardMaterial({ color: "#ffb347", emissive: "#ffb347", emissiveIntensity: 2.0, roughness: 0.4 }),
      ceilingLight: new THREE.MeshStandardMaterial({ color: "#ffb347", emissive: "#ffb347", emissiveIntensity: 1.6, roughness: 0.4 }),
      floorTrim: new THREE.MeshStandardMaterial({ map: trimTex, color: "#ffffff", roughness: 0.8 }),
      monitorScreen: new THREE.MeshBasicMaterial({ color: "#101018" }),
      screenDark: new THREE.MeshBasicMaterial({ color: "#101018" }),
      brushed: new THREE.MeshStandardMaterial({ map: brushedTex, color: "#1a1a2e", roughness: 0.5, metalness: 0.3 }),
      deck: new THREE.MeshStandardMaterial({ map: deckTex, color: "#121218", roughness: 0.9 }),
      asusLid: new THREE.MeshStandardMaterial({ map: asusLidTex, color: "#1a1a2e", roughness: 0.3, metalness: 0.7 }),
      asusChin: new THREE.MeshStandardMaterial({ map: asusChinTex, color: "#1a1a2e", roughness: 0.3, metalness: 0.7 }),
    };
  }, []);
}