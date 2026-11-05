import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Film, Palette, RotateCcw, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import type { SiteContent } from './siteContent';
import { WRAP_PRODUCTS, WRAP_BRAND_ORDER } from './ProductCatalog';

type ServiceMode = 'windows' | 'wrap';
type GlassZone = 'combined';

interface CarModel {
  id: string;
  brand: string;
  model: string;
  category: 'coupe' | 'sedan' | 'suv' | 'hatchback';
  uid: string;
  author: string;
  license: string;
  source: string;
}

const ARCHIVED_CAR_MODELS: CarModel[] = [
  // Confirmed retained models from the user's approved vehicle list.
  { id: 'ford-mustang', brand: 'Ford', model: 'Mustang (Improved)', category: 'coupe', uid: '88775b874f094f9eb946d198cf851786', author: 'WolfGames36', license: 'CC BY', source: 'https://sketchfab.com/3d-models/ford-mustang--improved-88775b874f094f9eb946d198cf851786' },
  { id: 'nissan-gtr', brand: 'Nissan', model: 'GT-R R35', category: 'coupe', uid: '51c912a8310c4e00a82ad7673d84228a', author: 'Ciasny', license: 'CC BY', source: 'https://sketchfab.com/3d-models/nissan-gtr-r35-51c912a8310c4e00a82ad7673d84228a' },
  { id: 'audi-a4', brand: 'Audi', model: 'A4 (B5)', category: 'sedan', uid: 'b5861ddefcb8478b858b3150aa44cd7f', author: 'MMC Works', license: 'CC BY', source: 'https://sketchfab.com/models/b5861ddefcb8478b858b3150aa44cd7f' },
  { id: 'porsche-911-930', brand: 'Porsche', model: '911 (930) Turbo', category: 'coupe', uid: '8568d9d14a994b9cae59499f0dbed21e', author: 'Lionsharp Studios', license: 'CC BY', source: 'https://sketchfab.com/3d-models/free-1975-porsche-911-930-turbo-8568d9d14a994b9cae59499f0dbed21e' },
  { id: 'lamborghini-huracan', brand: 'Lamborghini', model: 'Huracán LP 610-4', category: 'coupe', uid: '4b7b162bcb4f48849f30b1c25b3102a3', author: 'MdMahib', license: 'CC BY', source: 'https://sketchfab.com/3d-models/lamborghini-huracan-lp-6104-2014-4b7b162bcb4f48849f30b1c25b3102a3' },

  // Restored models previously approved by the user. Material calibration must be checked per model.
  { id: 'audi-rs6-avant', brand: 'Audi', model: 'RS6 Avant (2020)', category: 'sedan', uid: '980dbda2cbbb4bae8decaed2fa80aa0c', author: 'Ddiaz Design', license: 'CC BY-NC-SA (verify)', source: 'https://sketchfab.com/3d-models/2020-audi-rs6-avant-980dbda2cbbb4bae8decaed2fa80aa0c' },
  { id: 'mercedes-g63-2025', brand: 'Mercedes-Benz', model: 'G-Class AMG G 63 (2025)', category: 'suv', uid: 'f583b5bfc17346c08573dc4f1edebefe', author: 'Ddiaz Design', license: 'CC BY-NC (verify)', source: 'https://sketchfab.com/3d-models/2025-mercedes-benz-g-class-amg-g-63-f583b5bfc17346c08573dc4f1edebefe' },
  { id: 'vw-golf-gti-mk2', brand: 'Volkswagen', model: 'Golf GTI MK2 (1992)', category: 'hatchback', uid: '1fb8f26b105445fbaa98ca2577f7067e', author: 'Ddiaz Design', license: 'CC BY-NC-SA (verify)', source: 'https://sketchfab.com/3d-models/1992-volkswagen-golf-gti-mk2-1fb8f26b105445fbaa98ca2577f7067e' },
  { id: 'vw-passat-pro-2025', brand: 'Volkswagen', model: 'Passat Pro 380TSI (2025)', category: 'sedan', uid: '92115be13e984f42926e67057e969fd7', author: 'Ddiaz Design', license: 'Verify original Sketchfab license', source: 'https://sketchfab.com/search?q=2025%20Volkswagen%20Passat%20Pro%20380TSI%202.0T&type=models' },

  // Ten new Sketchfab candidates requested by the user. Add first; calibrate and filter only after testing.
  { id: 'fiat-500f-1965', brand: 'Fiat', model: '500F (1965)', category: 'hatchback', uid: '91c9a625d0c24026b266fbe68352e6fa', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/1965-fiat-500f-91c9a625d0c24026b266fbe68352e6fa' },
  { id: 'fiat-tipo-2021', brand: 'Fiat', model: 'Tipo 5-Door (2021)', category: 'hatchback', uid: '8511790219664c84807777c53c82c9e0', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/fiat-tipo-5door-2021-8511790219664c84807777c53c82c9e0' },
  { id: 'citroen-c3-2020', brand: 'Citroën', model: 'C3 (2020)', category: 'hatchback', uid: 'c3caaa231ed34ad9bb9367a5cf760097', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/citroen-c3-2020-c3caaa231ed34ad9bb9367a5cf760097' },
  { id: 'opel-corsa-gsi-2019', brand: 'Opel', model: 'Corsa GSi (2019)', category: 'hatchback', uid: 'fdadf75ad03c42d0b7e81dd056869228', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/opel-corsa-gsi-2019-fdadf75ad03c42d0b7e81dd056869228' },
  { id: 'opel-insignia-2020', brand: 'Opel', model: 'Insignia Grand Sport (2020)', category: 'sedan', uid: '03daad120187448998ae2bd5fd964237', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/opel-insignia-grand-sport-2020-03daad120187448998ae2bd5fd964237' },
  { id: 'opel-astra', brand: 'Opel', model: 'Astra', category: 'hatchback', uid: 'b78d6a098dc345fc9b5293552e4cc642', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/opel-astra-b78d6a098dc345fc9b5293552e4cc642' },
  { id: 'opel-grandland-x-2019', brand: 'Opel', model: 'Grandland X (2019)', category: 'suv', uid: '88da47dec6b04feaa89b24384d6ce9b0', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/opel-grandland-x-2019-88da47dec6b04feaa89b24384d6ce9b0' },
  { id: 'audi-s3-2007', brand: 'Audi', model: 'S3 (2007)', category: 'hatchback', uid: '6cfe7fdcb8ea43699ee11049057706ea', author: 'Sketchfab creator', license: 'Verify on Sketchfab', source: 'https://sketchfab.com/3d-models/2007-audi-s3-6cfe7fdcb8ea43699ee11049057706ea' },
];

// Mustang Improved remains first and untouched. Every other candidate is individually calibrated after live material inspection.
const APPROVED_CAR_MODEL_ORDER = [
  'ford-mustang', 'nissan-gtr', 'audi-a4', 'porsche-911-930', 'lamborghini-huracan',
  'audi-rs6-avant',
  'mercedes-g63-2025', 'vw-golf-gti-mk2', 'vw-passat-pro-2025',
  'fiat-500f-1965', 'fiat-tipo-2021', 'citroen-c3-2020',
  'opel-corsa-gsi-2019', 'opel-insignia-2020', 'opel-astra', 'opel-grandland-x-2019',
  'audi-s3-2007',
];

const CAR_MODELS: CarModel[] = APPROVED_CAR_MODEL_ORDER.flatMap((id) =>
  ARCHIVED_CAR_MODELS.filter((car) => car.id === id),
);

const VLT_OPTIONS = [30, 50, 65, 85, 95];
const WRAP_FINISHES = [
  { id: 'gloss', label: 'Gloss / Сјај', roughness: 0.18, metalness: 0.18 },
  { id: 'highGloss', label: 'High Gloss / Висок сјај', roughness: 0.08, metalness: 0.16 },
  { id: 'satin', label: 'Satin / Сатен', roughness: 0.42, metalness: 0.16 },
  { id: 'matte', label: 'Matte / Мат', roughness: 0.78, metalness: 0.04 },
  { id: 'metallic', label: 'Metallic / Металик', roughness: 0.24, metalness: 0.72 },
  { id: 'texture', label: 'Texture / Текстура', roughness: 0.58, metalness: 0.22 },
  { id: 'colorflip', label: 'Color Flip / Промена на нијанса', roughness: 0.22, metalness: 0.88 },
  { id: 'chrome', label: 'Chrome / Хром', roughness: 0.08, metalness: 0.96 },
];
const WRAP_COLORS = [
  { label: 'Black', color: '#111318' }, { label: 'Black Metallic', color: '#252a31' },
  { label: 'Anthracite', color: '#41464c' }, { label: 'Nardo Grey', color: '#777d83' },
  { label: 'White', color: '#e7e8e8' }, { label: 'Pearl White', color: '#eee9df' },
  { label: 'White Aluminum', color: '#c4c7c9' }, { label: 'Silver', color: '#aeb4bb' },
  { label: 'Liquid Copper', color: '#b96a3d' }, { label: 'Hot Rod Red', color: '#c51c2c' },
  { label: 'Dragon Fire Red', color: '#b51d2b' }, { label: 'Smoldering Red', color: '#922936' },
  { label: 'Vampire Red', color: '#681d2a' }, { label: 'Bright Orange', color: '#ef6a24' },
  { label: 'Sunflower Yellow', color: '#e8bd20' }, { label: 'Lucid Yellow', color: '#d7dc22' },
  { label: 'Envy Green', color: '#477b36' }, { label: 'Light Green', color: '#8ebd62' },
  { label: 'Key West', color: '#409889' }, { label: 'Atomic Teal', color: '#00a6a5' },
  { label: 'Midnight Blue', color: '#182a4c' }, { label: 'Intense Blue', color: '#173d8b' },
  { label: 'Blue Fire', color: '#1457a6' }, { label: 'Blue Raspberry', color: '#1477a5' },
  { label: 'Perfect Blue', color: '#315fb6' }, { label: 'Indigo', color: '#333c63' },
  { label: 'Pine Green', color: '#244b39' }, { label: 'Military Green', color: '#62694a' },
  { label: 'Carbon Fiber Black', color: '#202329' }, { label: 'Brushed Titanium', color: '#747a80' },
  { label: 'Chameleon Purple', color: '#6653a8' },
];

type SketchfabMaterial = { name: string; stateSetID: number; channels: Record<string, any>; [key: string]: any };
type SketchfabApi = {
  start: () => void;
  stop?: () => void;
  addEventListener: (event: string, callback: (...args: any[]) => void) => void;
  getMaterialList: (callback: (error: any, materials: SketchfabMaterial[]) => void) => void;
  getNodeMap: (callback: (error: any, nodes: any[]) => void) => void;
  createMaterial: (material: SketchfabMaterial, callback: (error: any, created: SketchfabMaterial) => void) => void;
  assignMaterial: (node: any, materialId: string | number, callback?: (error?: any) => void) => void;
  setMaterial: (material: SketchfabMaterial, callback?: (error?: any) => void) => void;
  getScreenShot?: (width: number, height: number, callback: (error: any, data: string) => void) => void;
};
declare global { interface Window { Sketchfab?: new (iframe: HTMLIFrameElement) => { init: (uid: string, options: any) => void } } }

function loadSketchfabScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Sketchfab) return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[data-sketchfab-api="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => { existing.remove(); reject(new Error('Sketchfab API не може да се вчита.')); }, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    script.async = true;
    script.dataset.sketchfabApi = 'true';
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); reject(new Error('Не успеавме да ја вчитаме 3D платформата. Провери ја интернет-врската.')); };
    document.head.appendChild(script);
  });
}

function isBlackWrapColor(hex: string) { return /^#0{6}$/i.test(hex); }
function rgb(hex: string): number[] {
  const clean = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
}
function materialColorChannel(material: SketchfabMaterial) {
  return material.channels?.AlbedoPBR ? 'AlbedoPBR' : material.channels?.DiffusePBR ? 'DiffusePBR' : material.channels?.DiffuseColor ? 'DiffuseColor' : 'AlbedoPBR';
}
function setMaterialTint(original: SketchfabMaterial, color: string, options: { roughness?: number; metalness?: number; blend?: number; opacity?: number } = {}) {
  const material = JSON.parse(JSON.stringify(original)) as SketchfabMaterial;
  material.channels = material.channels || {};
  // Sketchfab models do not always expose a color channel. Some glazing
  // materials expose only AlphaMask/Opacity/Specular channels; writing into a
  // missing fallback channel without enabling a supported albedo channel can
  // result in a successful API call with no visible change. Create AlbedoPBR
  // explicitly when no supported color channel exists, while preserving all
  // original opacity/mask data.
  const channelName = material.channels?.AlbedoPBR ? 'AlbedoPBR'
    : material.channels?.DiffusePBR ? 'DiffusePBR'
    : material.channels?.DiffuseColor ? 'DiffuseColor'
    : 'AlbedoPBR';
  const existing = material.channels[channelName] || {};
  const tint = rgb(color);
  const base = Array.isArray(existing.color) && existing.color.length >= 3 ? existing.color : [1, 1, 1];
  // Keep the source glass shading/texture visible; a full 1.0 blend flattens
  // the glazing into a solid painted surface and is the main cause of the
  // matte/plastic appearance reported in V16.11.
  const blend = Math.max(0, Math.min(0.96, options.blend ?? 0.38));
  const mixed = base.slice(0, 3).map((value: number, index: number) => Math.max(0, Math.min(1, value * (1 - blend) + tint[index] * blend)));
  material.channels[channelName] = { ...existing, enable: true, color: mixed };
  if (options.roughness !== undefined) material.channels.RoughnessPBR = { ...(material.channels.RoughnessPBR || {}), enable: true, factor: options.roughness };
  if (options.metalness !== undefined) material.channels.MetalnessPBR = { ...(material.channels.MetalnessPBR || {}), enable: true, factor: options.metalness };
  // Opacity is the actual material alpha (1 = opaque). V16.11 used
  // Math.max(oldOpacity, target), which kept common fully-opaque glass at 1
  // and prevented any see-through result. Set the calibrated alpha directly,
  // while retaining every other source channel/property and AlphaMask data.
  if (options.opacity !== undefined) {
    const opacityChannel = material.channels.Opacity || {};
    material.channels.Opacity = {
      ...opacityChannel,
      enable: true,
      factor: Math.max(0.12, Math.min(0.99, options.opacity)),
    };
  }
  return material;
}
function tintMaterial(original: SketchfabMaterial, darkness: number, film: 'vlt' | 'xr88' | 'chameleon' = 'vlt', options: { applyOpacity?: boolean; blendOverride?: number; calibration?: 'audi-a4' | 'nissan-gtr' } = {}) {
  // Simulator darkness scale (not physical VLT). The approved user-facing
  // stops are intentionally nonlinear so each step is visibly darker.
  // The five customer-facing tint stops run from light (30% total tint) to darkest (95%).
  const standardStops: Record<number, { color: string; opacity: number }> = {
    30: { color: '#929DA7', opacity: 0.28 },
    50: { color: '#59636D', opacity: 0.40 },
    65: { color: '#343E48', opacity: 0.50 },
    85: { color: '#070B10', opacity: 0.82 },
    95: { color: '#000000', opacity: 0.92 },
  };
  // Audi A4 (B5): retain its proven calibrated appearance while mapping it to the new five stops.
  const audiStops: Record<number, { color: string; opacity: number; blend: number }> = {
    30: { color: '#171B20', opacity: 0.34, blend: 0.86 },
    50: { color: '#080B0F', opacity: 0.44, blend: 0.90 },
    65: { color: '#020305', opacity: 0.62, blend: 0.94 },
    85: { color: '#000000', opacity: 0.88, blend: 0.98 },
    95: { color: '#000000', opacity: 0.99, blend: 0.96 },
  };
  // Nissan GT-R: neutralize the original pale/white plastic-looking glazing.
  // Keep the original maps, but use a charcoal glass base and lower roughness.
  const nissanStops: Record<number, { color: string; opacity: number; blend: number }> = {
    30: { color: '#56616B', opacity: 0.30, blend: 0.72 },
    50: { color: '#252D35', opacity: 0.38, blend: 0.88 },
    65: { color: '#111820', opacity: 0.52, blend: 0.92 },
    85: { color: '#05080C', opacity: 0.82, blend: 0.96 },
    95: { color: '#000000', opacity: 0.94, blend: 0.97 },
  };
  // Nissan GT-R R35 experiment: use the proven Audi A4 visual calibration
  // as the reference instead of the previous Nissan-specific cloudy/glassy
  // values. The Nissan model keeps its own geometry and texture maps; only
  // the tint response and PBR surface tuning are matched to the Audi preset.
  const stops = options.calibration === 'nissan-gtr' ? nissanStops : options.calibration === 'audi-a4' ? audiStops : standardStops;
  const levels = Object.keys(stops).map(Number).sort((a, b) => a - b);
  const value = Math.max(30, Math.min(95, darkness));
  let lower = levels[0], upper = levels[levels.length - 1];
  for (let i = 0; i < levels.length - 1; i++) {
    if (value >= levels[i] && value <= levels[i + 1]) { lower = levels[i]; upper = levels[i + 1]; break; }
  }
  const ratio = lower === upper ? 0 : (value - lower) / (upper - lower);
  const mix = (a: number, b: number) => a + (b - a) * ratio;
  const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const a = hexToRgb(stops[lower].color), b = hexToRgb(stops[upper].color);
  const color = `#${a.map((v, i) => Math.round(mix(v, b[i])).toString(16).padStart(2, '0')).join('')}`;
  const opacity = mix(stops[lower].opacity, stops[upper].opacity);
  const audiBlendStops: Record<number, number> = { 30: 0.18, 50: 0.86, 65: 0.90, 85: 0.94, 95: 0.96 };
  const audiBlend = mix(audiBlendStops[lower], audiBlendStops[upper]);
  const calibratedBlend = mix(stops[lower].blend, stops[upper].blend);
  const tint = film === 'chameleon' ? '#7187b8' : film === 'xr88' ? '#c5d0da' : color;
  return setMaterialTint(original, tint, {
    blend: options.blendOverride ?? ((options.calibration === 'nissan-gtr') ? calibratedBlend : options.calibration === 'audi-a4' ? audiBlend : film === 'chameleon' ? 0.42 : film === 'xr88' ? 0.32 : ({ 30: 0.18, 50: 0.30, 65: 0.40, 85: 0.68, 95: 0.78 } as Record<number, number>)[Math.round(value)] ?? 0.42),
    // Keep glazing glossy and non-metallic to avoid a pale, plastic haze.
    roughness: options.calibration === 'nissan-gtr' ? 0.06 : options.calibration === 'audi-a4' ? 0.12 : undefined,
    metalness: (options.calibration === 'audi-a4' || options.calibration === 'nissan-gtr') ? 0 : undefined,
    opacity: film === 'vlt' && options.applyOpacity !== false ? opacity : undefined,
  });
}

const NON_GLASS_MATERIAL_NAME = /(sill|threshold|rocker|step|door.?step|door.?sill|trim|moulding|molding|seal|rubber|weatherstrip|frame|pillar|body|paint|bumper|fender|hood|bonnet|chassis|underbody|interior)/i;

// Confirmed from the user's live Sketchfab diagnostics for Lionsharp Studios'
// Porsche 911 (930) Turbo: stateSetID 7 is the dedicated material named `glass`.
// The same material is exposed by Sketchfab for the model's glazing, so it is
// deliberately used only for glass tinting and never as a body/wrap target.
const MODEL_GLASS_MATERIAL_IDS: Record<string, { all?: number[]; frontSide?: number[]; rear?: number[] }> = {
  // Mustang glazing was previously confirmed working; ID 7 is used as rear/side glazing only.
  'ford-mustang': { rear: [7] },
};

function isGlassLikeName(name = '') { return /glass|window|windshield|windscreen|glazing|fenster|vitre|parabrisas|стакл|стакло/i.test(name); }
function isSafeBodyCandidate(material: SketchfabMaterial) {
  const name = material.name || '';
  return !isGlassLikeName(name) && !/(sill|threshold|rocker|step|door.?step|door.?sill|trim|moulding|molding|seal|rubber|weatherstrip|frame|pillar|wheel|tire|tyre|rim|mirror|head.?light|tail.?light|lamp|lens|interior|seat|dashboard|steering|grille|exhaust|underbody|chassis.?under)/i.test(name) && /car.?paint|body.?paint|paint|bodywork|body|exterior|shell|main.?color|kuzov|karoser|lak|fender|bonnet|hood|bumper|vehicle.?paint|outer.?body|mesh.?body|painted/i.test(name);
}

function isSafeGlassCandidate(material: SketchfabMaterial) {
  const name = material.name || '';
  return !NON_GLASS_MATERIAL_NAME.test(name) && !/mirror.?glass|head.?light|tail.?light|lamp.?lens/i.test(name);
}
function isFrontWindshieldCandidate(material: SketchfabMaterial) { return /windshield|windscreen|front.?glass|glass.?front|ws.?glass|parabrisas/i.test(material.name || '') && !/rear|back/i.test(material.name || ''); }

function classifyMaterials(materials: SketchfabMaterial[], _mode: ServiceMode) {
  // Classify glass and body independently of the selected configurator tab.
  // This lets the active window tint remain applied while the user previews Wrap.
  const find = (pattern: RegExp) => materials.filter((m) => pattern.test(m.name || '') && isSafeGlassCandidate(m));
  const windshield = find(/windshield|windscreen|parabrisas|wind.?screen|front.?glass|glass.?front|ws.?glass/i).filter((m) => !/rear|back|door|bumper|fender/i.test(m.name || ''));
  const rearWindshield = find(/rear.?windshield|rear.?windscreen|back.?glass|rear.?glass|rear.?window.?glass|luneta|glass.?rear|back.?window/i).filter((m) => !/door|side|quarter/i.test(m.name || ''));
  const frontSide = find(/front.?side.?window|side.?front.?window|front.?door.?glass|driver.?window|passenger.?window|door.?glass.?front|front.?quarter.?glass|glass.?front.?door|window.?fl|window.?fr|front.?window|window.?front/i);
  const rearSide = find(/rear.?side.?window|side.?rear.?window|quarter.?glass|back.?side.?window|rear.?door.?glass|rear.?quarter|glass.?rear.?door|window.?rl|window.?rr|vent.?glass|rear.?window|window.?rear/i).filter((m) => !rearWindshield.some((w) => w.stateSetID === m.stateSetID));
  const genericGlazing = find(/glass|window|glazing|fenster|vitre|стакл|стакло/i).filter((m) => !windshield.some((w) => w.stateSetID === m.stateSetID) && !frontSide.some((w) => w.stateSetID === m.stateSetID) && !rearSide.some((w) => w.stateSetID === m.stateSetID) && !rearWindshield.some((w) => w.stateSetID === m.stateSetID));
  const glass = [...windshield, ...frontSide, ...rearSide, ...rearWindshield, ...genericGlazing]
    .filter((item, index, all) => all.findIndex((other) => other.stateSetID === item.stateSetID) === index);
  const bodyPattern = /car.?paint|body.?paint|paint|bodywork|body|exterior|shell|main.?color|kuzov|karoser|lak|fender|bonnet|hood|bumper|chassis.?paint|vehicle.?paint|outer.?body|mesh.?body|painted/i;
  const body = materials.filter((material) => bodyPattern.test(material.name || '') && isSafeBodyCandidate(material));
  return { glass, windshield, frontSide, rearSide, rearWindshield, body, headlights: [] };
}

interface BookingPayload { vehicleModel: string; serviceType: string; preference: string; note: string }
interface Props { content: SiteContent; onBook: (payload: BookingPayload) => void }

export default function CarStudio({ content, onBook }: Props) {
  const [service, setService] = useState<ServiceMode>('windows');
  const [selectedModelId, setSelectedModelId] = useState('ford-mustang');
  const selectedModel = CAR_MODELS.find((car) => car.id === selectedModelId) || CAR_MODELS[0];
  const [viewerStatus, setViewerStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [reloadKey, setReloadKey] = useState(0);
  const [viewerError, setViewerError] = useState('');
  const [screenshotStatus, setScreenshotStatus] = useState('');
  const [screenshotBusy, setScreenshotBusy] = useState(false);
  const [materials, setMaterials] = useState<SketchfabMaterial[]>([]);
  const [manualBodyByModel, setManualBodyByModel] = useState<Record<string, number[]>>({});
  const [manualGlassByModel, setManualGlassByModel] = useState<Record<string, Record<string, number[]>>>({});
  const [manualMappingsLoaded, setManualMappingsLoaded] = useState(false);
  const manualBodyIds = manualBodyByModel[selectedModelId] || [];
  const manualGlassIds = manualGlassByModel[selectedModelId]?.combined || [];
  const [materialRoles, setMaterialRoles] = useState<ReturnType<typeof classifyMaterials>>({ glass: [], windshield: [], frontSide: [], rearSide: [], rearWindshield: [], body: [], headlights: [] });
  const [glassVlt, setGlassVlt] = useState<number>(50);
  const [wrapBrand, setWrapBrand] = useState('3M');
  const [selectedWrapId, setSelectedWrapId] = useState('3m-gloss-black');
  const selectedWrap = WRAP_PRODUCTS.find((p) => p.id === selectedWrapId) || WRAP_PRODUCTS[0];
  const rawWrapColor = selectedWrap?.swatch && /^#[0-9a-fA-F]{6}$/.test(selectedWrap.swatch) ? selectedWrap.swatch : '#202329';
  // Normalize near-black wrap swatches to true black so the render does not
  // become charcoal after the original material color is blended in.
  const isBlackWrap = /black/i.test(`${selectedWrap?.name || ''} ${selectedWrap?.color || ''} ${selectedWrap?.id || ''}`) && !/carbon/i.test(`${selectedWrap?.name || ''} ${selectedWrap?.color || ''} ${selectedWrap?.id || ''}`);
  const wrapColor = isBlackWrap ? '#000000' : rawWrapColor;
  const wrapBrands = WRAP_BRAND_ORDER.filter((brand) => WRAP_PRODUCTS.some((p) => p.brand === brand));
  const brandWraps = WRAP_PRODUCTS.filter((p) => p.brand === wrapBrand);
  const applyWrapVariant = (id: string) => { const product = WRAP_PRODUCTS.find((p) => p.id === id); setSelectedWrapId(id); const f = (product?.finish || '').toLowerCase(); setWrapFinish(f.includes('satin') ? 'satin' : f.includes('matte') ? 'matte' : f.includes('metallic') ? 'metallic' : f.includes('texture') || f.includes('carbon') ? 'texture' : f.includes('flip') || f.includes('chameleon') ? 'colorflip' : 'gloss'); };
  const [wrapFinish, setWrapFinish] = useState('gloss');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const apiRef = useRef<SketchfabApi | null>(null);
  const originalMaterialsRef = useRef<SketchfabMaterial[]>([]);
  const materialUpdateRunRef = useRef(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('tintology-v16-material-mappings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setManualBodyByModel(parsed.body && typeof parsed.body === 'object' ? parsed.body : {});
          setManualGlassByModel(parsed.glass && typeof parsed.glass === 'object' ? parsed.glass : {});
        }
      }
    } catch { /* Ignore invalid or unavailable local storage; automatic mapping remains usable. */ }
    setManualMappingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!manualMappingsLoaded) return;
    try { window.localStorage.setItem('tintology-v16-material-mappings', JSON.stringify({ body: manualBodyByModel, glass: manualGlassByModel })); }
    catch { /* Storage can be disabled; mappings still work for this session. */ }
  }, [manualMappingsLoaded, manualBodyByModel, manualGlassByModel]);

  const categoryLabel = selectedModel.category === 'coupe' ? 'Купе' : selectedModel.category === 'suv' ? 'Џип / Караван' : selectedModel.category === 'hatchback' ? 'Лимузина / Хечбек' : 'Лимузина';

  useEffect(() => {
    let cancelled = false;
    setViewerStatus('loading'); setViewerError(''); setMaterials([]); setMaterialRoles({ glass: [], windshield: [], frontSide: [], rearSide: [], rearWindshield: [], body: [], headlights: [] });
    apiRef.current = null; originalMaterialsRef.current = [];
    loadSketchfabScript().then(() => {
      const iframe = iframeRef.current;
      if (cancelled || !iframe) return;
      const SketchfabConstructor = window.Sketchfab;
      if (!SketchfabConstructor) { setViewerStatus('error'); setViewerError('Sketchfab API не е достапен.'); return; }
      const client = new SketchfabConstructor(iframe);
      client.init(selectedModel.uid, {
        autostart: 1, autospin: 0, camera: 0, ui_controls: 1, ui_infos: 0, ui_watermark: 1,
        success: (api: SketchfabApi) => {
          if (cancelled) return;
          api.start();
          api.addEventListener('viewerready', () => {
            if (cancelled) return;
            apiRef.current = api;
            api.getMaterialList((error, list) => {
              if (cancelled) return;
              if (error || !Array.isArray(list)) { setViewerStatus('error'); setViewerError('Не можевме да ги прочитаме материјалите на овој модел.'); return; }
              originalMaterialsRef.current = list.map((item) => JSON.parse(JSON.stringify(item)));
              setMaterials(list);
              setViewerStatus('ready');
            });
          });
        },
        error: () => { if (!cancelled) { setViewerStatus('error'); setViewerError('3D моделот не можеше да се отвори. Обиди се повторно или избери друг автомобил.'); } },
      });
    }).catch((error: Error) => { if (!cancelled) { setViewerStatus('error'); setViewerError(error.message); } });
    return () => { cancelled = true; apiRef.current?.stop?.(); apiRef.current = null; };
  }, [selectedModel.uid, reloadKey]);

  useEffect(() => { setMaterialRoles(classifyMaterials(materials, service)); }, [materials, service]);

  const uniqueById = (items: SketchfabMaterial[]) => items.filter((item, index) => items.findIndex((other) => other.stateSetID === item.stateSetID) === index);
  const getGlassTargets = useCallback(() => {
    // Prefer explicitly named side/rear glazing. If a model exposes only a
    // generic `glass` / `windows` material, retain the previous V16 fallback:
    // use it only when no specifically named side/rear targets exist, and
    // always reject materials explicitly identified as the front windshield.
    const namedSideAndRear = [...materialRoles.frontSide, ...materialRoles.rearSide, ...materialRoles.rearWindshield]
      .filter((material) => !isFrontWindshieldCandidate(material));
    const genericFallback = namedSideAndRear.length === 0
      ? materialRoles.glass.filter((material) => isGlassLikeName(material.name || '') && isSafeGlassCandidate(material) && !isFrontWindshieldCandidate(material))
      : [];
    const savedIds = manualGlassByModel[selectedModelId]?.combined || [];
    const manual = materials.filter((material) => savedIds.includes(material.stateSetID) && isSafeGlassCandidate(material) && !isFrontWindshieldCandidate(material));
    return uniqueById([...namedSideAndRear, ...genericFallback, ...manual]);
  }, [materialRoles, materials, manualGlassByModel, selectedModelId]);
  const getBodyTargets = useCallback(() => {
    const confirmedGlassIds = new Set((MODEL_GLASS_MATERIAL_IDS[selectedModelId]?.all || []));
    return uniqueById([...materialRoles.body.filter(isSafeBodyCandidate), ...materials.filter((material) => manualBodyIds.includes(material.stateSetID) && !confirmedGlassIds.has(material.stateSetID) && isSafeBodyCandidate(material))]);
  }, [materialRoles.body, materials, manualBodyIds, selectedModelId]);

  useEffect(() => {
    const api = apiRef.current;
    if (!api || viewerStatus !== 'ready') return;
    const runId = ++materialUpdateRunRef.current;
    let cancelled = false;
    const applyMaterial = (material: SketchfabMaterial) => new Promise<void>((resolve) => {
      api.setMaterial(JSON.parse(JSON.stringify(material)), (error) => {
        if (error) console.error('Tintology: material update failed', error);
        resolve();
      });
    });
    const applyBothServices = async () => {
      // Serialize the complete material pass. Sketchfab may process setMaterial
      // asynchronously; issuing restore and tint/wrap calls together can cause
      // the original material to overwrite a newer user selection.
      for (const original of originalMaterialsRef.current) {
        if (cancelled || runId !== materialUpdateRunRef.current) return;
        await applyMaterial(original);
      }
      const glassTargets = getGlassTargets();
      for (const original of glassTargets) {
        if (cancelled || runId !== materialUpdateRunRef.current) return;
        const updated = tintMaterial(original, glassVlt, 'vlt', {
          calibration: selectedModelId === 'audi-a4' ? 'audi-a4' : selectedModelId === 'nissan-gtr' ? 'nissan-gtr' : undefined,
        });
        await applyMaterial(updated);
      }
      const finish = WRAP_FINISHES.find((item) => item.id === wrapFinish) || WRAP_FINISHES[0];
      for (const original of getBodyTargets()) {
        if (cancelled || runId !== materialUpdateRunRef.current) return;
        const updated = JSON.parse(JSON.stringify(original)) as SketchfabMaterial;
        updated.channels = updated.channels || {};
        const key = materialColorChannel(updated);
        const old = updated.channels[key] || {};
        const target = rgb(wrapColor);
        const base = Array.isArray(old.color) && old.color.length >= 3 ? old.color : [1,1,1];
        updated.channels[key] = { ...old, enable: true, color: base.slice(0,3).map((v:number,i:number) => Math.max(0,Math.min(1,isBlackWrapColor(wrapColor) ? target[i] : v*0.08+target[i]*0.92))) };
        updated.channels.RoughnessPBR = { ...(updated.channels.RoughnessPBR || {}), enable: true, factor: finish.roughness };
        updated.channels.MetalnessPBR = { ...(updated.channels.MetalnessPBR || {}), enable: true, factor: finish.metalness };
        await applyMaterial(updated);
      }
    };
    void applyBothServices();
    return () => { cancelled = true; };
  }, [viewerStatus, glassVlt, wrapColor, wrapFinish, selectedModelId, getGlassTargets, getBodyTargets]);

  const saveVehicleScreenshot = useCallback(() => {
    const api = apiRef.current;
    if (!api || viewerStatus !== 'ready') { setScreenshotStatus('Почекај 3D автомобилот целосно да се вчита.'); return; }
    if (typeof api.getScreenShot !== 'function') { setScreenshotStatus('Оваа верзија на Sketchfab не поддржува Screenshot преку API.'); return; }
    setScreenshotBusy(true); setScreenshotStatus('Се подготвува сликата...');
    api.getScreenShot(1920, 1080, (error, data) => {
      setScreenshotBusy(false);
      if (error || !data) { setScreenshotStatus('Не успеавме да ја зачуваме сликата. Обиди се повторно.'); return; }
      try {
        const link = document.createElement('a');
        link.href = data.startsWith('data:') ? data : `data:image/png;base64,${data}`;
        link.download = `Tintology-${selectedModel.brand}-${selectedModel.model.replace(/[^a-z0-9]+/gi, '-')}.png`;
        document.body.appendChild(link); link.click(); link.remove();
        setScreenshotStatus('Screenshot е зачуван.');
      } catch { setScreenshotStatus('Прелистувачот не дозволи зачувување на Screenshot.'); }
    });
  }, [viewerStatus, selectedModel.brand, selectedModel.model]);

  const currentTargets = service === 'windows' ? getGlassTargets() : getBodyTargets();
  // Diagnostic panels show only the materials currently classified for that role.
  // For the confirmed Porsche 930 map this means glass ID 7 only.
  const glassMaterialOptions = service === 'windows' ? uniqueById([
    ...getGlassTargets(),
    // Include named but unclassified candidates in the manual mapping list.
    // They are never auto-applied: the user must explicitly confirm the zone.
    ...materials.filter((m) => isGlassLikeName(m.name || '') && isSafeGlassCandidate(m)),
    ...Object.values(manualGlassByModel[selectedModelId] || {}).flat().flatMap((id) => materials.filter((m) => m.stateSetID === id && isSafeGlassCandidate(m))),
  ]) : [];
  const bodyMaterialOptions = service === 'wrap' ? getBodyTargets() : [];
  const modelName = `${selectedModel.brand} ${selectedModel.model}`;

  const book = () => {
    const tintPreference = `Затемнување стакла: ${glassVlt}%. Предното ветробранско стакло не се затемнува.`;
    const wrapPreference = `${selectedWrap?.brand || ''} · ${selectedWrap?.name || wrapColor} · ${(WRAP_FINISHES.find((f) => f.id === wrapFinish) || WRAP_FINISHES[0]).label}`;
    const serviceType = 'WINDOW TINT + CAR WRAP – заедничка 3D конфигурација';
    const preference = `${tintPreference} | Wrap: ${wrapPreference}`;
    const note = `Избор од заедничкиот 3D Studio: ${tintPreference} Wrap: ${wrapPreference}. Опфат: цела каросерија. Тип: ${categoryLabel}. Финалната понуда се потврдува по преглед.`;
    onBook({ vehicleModel: modelName, serviceType, preference, note });
  };

  return <section id="simulator" className="py-20 bg-[#0d0d12] border-t border-b border-[#1c1c28]">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2"><Sparkles className="h-4 w-4"/><span>Tintology 3D Car Studio</span></div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Конфигуратор на автомобили</h2>
        <p className="mt-3 text-base text-slate-300">Избери автомобил, ротирај го во 3D и испробај Tint и Wrap. Кај затемнувањето, 30% е најсветло, а 95% е најтемно.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-2xl bg-[#12121a] border border-[#232332] p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">Избран автомобил</div><div className="text-white font-bold text-lg">{modelName}</div></div>
            <div className="flex items-center gap-2 rounded-lg border border-blue-900/70 bg-blue-950/40 px-3 py-2 text-xs text-blue-200"><RotateCcw className="h-3.5 w-3.5"/> Влечи за 360° преглед</div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-[#29384a] bg-gradient-to-b from-[#1a2635] to-[#080d15] aspect-[4/3] sm:aspect-[16/10]">
            {viewerStatus === 'loading' && <div className="absolute inset-0 z-20 grid place-items-center bg-[#0b111b]/90 text-center p-6"><div><div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"/><div className="text-white font-semibold">Се вчитува 3D автомобилот...</div><div className="text-xs text-slate-400 mt-1">Првото вчитување може да потрае неколку секунди.</div></div></div>}
            {viewerStatus === 'error' && <div className="absolute inset-0 z-20 grid place-items-center bg-[#0b111b] text-center p-6"><div className="max-w-sm"><AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-3"/><div className="text-white font-semibold">3D прегледот не е достапен</div><p className="text-xs text-slate-400 mt-2">{viewerError}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-black">Обиди се повторно</button></div></div>}
            <iframe key={`${selectedModel.uid}-${reloadKey}`} ref={iframeRef} title={`${modelName} 3D model`} className="absolute inset-0 h-full w-full border-0" allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={saveVehicleScreenshot} disabled={viewerStatus !== 'ready' || screenshotBusy} className="rounded-lg border border-blue-500/50 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-200 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40">{screenshotBusy ? 'Се подготвува...' : 'Зачувај Screenshot 1920×1080'}</button>
            {screenshotStatus && <span className="text-[10px] text-slate-400" role="status">{screenshotStatus}</span>}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
            <span>3D модел: {selectedModel.author} · {selectedModel.license}</span>
            <a href={selectedModel.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200">Извор и авторство <ExternalLink className="h-3 w-3"/></a>
          </div>
          {viewerStatus === 'ready' && <div className="mt-4 grid grid-cols-2 gap-2">{(service === 'windows' ? [['Стакла', getGlassTargets().length]] : [['Каросерија', getBodyTargets().length]]).map(([label, count]) => <div key={label} className="rounded-lg border border-[#242d3a] bg-[#0d131d] p-2 text-center"><div className="text-[10px] text-slate-500">{label}</div><div className={`text-sm font-bold ${Number(count) ? 'text-emerald-300' : 'text-amber-300'}`}>{count}</div></div>)}</div>}
          {viewerStatus === 'ready' && <div className="mt-3 text-[10px] text-slate-500">Моделите се вчитуваат од Sketchfab и бараат интернет-врска. Материјалите се менуваат само кога 3D моделот ги изложува како одделни делови.</div>}
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-[#12121a] border border-[#232332] p-4 sm:p-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">1. Избери марка и модел</label>
          <select value={selectedModelId} onChange={(e) => setSelectedModelId(e.target.value)} className="w-full rounded-xl bg-[#181824] border border-[#343449] px-3 py-3 text-sm text-white outline-none focus:border-blue-400 mb-5">
            {CAR_MODELS.map((car) => <option key={car.id} value={car.id}>{car.brand} {car.model}</option>)}
          </select>
          <div className="space-y-3">
          <div className="rounded-xl border border-[#303044] bg-[#181824] p-3">
            <div className="mb-3 flex items-center gap-2"><Film className="h-4 w-4 text-blue-300"/><h3 className="text-xs font-extrabold tracking-wider text-white">TINT · ЗАТЕМНУВАЊЕ СТАКЛА</h3><span className="ml-auto text-[9px] font-bold text-emerald-300">СЕКОГАШ АКТИВНО</span></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Затемнување стакла</label><div className="grid grid-cols-5 gap-2">{VLT_OPTIONS.map((value) => { const active = glassVlt === value; return <button key={value} type="button" onClick={() => setGlassVlt(value)} className={`rounded-lg border py-3 text-sm font-extrabold ${active ? 'border-blue-400 bg-blue-400 text-black' : 'border-[#303044] bg-[#181824] text-slate-300'}`}>{value}%</button>; })}</div><p className="mt-2 text-[10px] text-slate-500">30% е најсветла нијанса, а 95% е најтемна. Затемнувањето се применува само на страничните и задните стакла.</p></div>
          </div>

          <div className="rounded-xl border border-[#303044] bg-[#181824] p-3">
            <div className="mb-3 flex items-center gap-2"><Palette className="h-4 w-4 text-blue-300"/><h3 className="text-xs font-extrabold tracking-wider text-white">WRAP · ПРОМЕНА НА БОЈА</h3><span className="ml-auto text-[9px] font-bold text-emerald-300">СЕКОГАШ АКТИВНО</span></div>
            <div className="space-y-3"><label className="block text-xs font-bold uppercase tracking-wider text-slate-400">2. Избери производител</label><select value={wrapBrand} onFocus={() => setService('wrap')} onChange={(e) => { setService('wrap'); const nextBrand=e.target.value; setWrapBrand(nextBrand); const first=WRAP_PRODUCTS.find((p)=>p.brand===nextBrand); if(first) applyWrapVariant(first.id); }} className="w-full rounded-lg bg-[#181824] border border-[#303044] px-3 py-3 text-sm text-white">{wrapBrands.map((brand)=><option key={brand} value={brand}>{brand} ({WRAP_PRODUCTS.filter((p)=>p.brand===brand).length})</option>)}</select><label className="block text-xs font-bold uppercase tracking-wider text-slate-400">3. Избери точна варијанта</label><select value={selectedWrapId} onFocus={() => setService('wrap')} onChange={(e)=>{setService('wrap');applyWrapVariant(e.target.value)}} className="w-full rounded-lg bg-[#181824] border border-[#303044] px-3 py-3 text-sm text-white">{brandWraps.map((p)=><option key={p.id} value={p.id}>{p.name}{p.code ? ` · ${p.code}` : ''} · {p.finish || 'Финиш'}</option>)}</select><div className="flex items-center gap-3 rounded-xl border border-[#303044] bg-[#181824] p-3"><span className="h-12 w-12 shrink-0 rounded-lg border border-white/20" style={{background:wrapColor}}/><div className="min-w-0"><p className="text-sm font-bold text-white">{selectedWrap?.name}</p><p className="text-xs text-slate-400">{selectedWrap?.brand} · {selectedWrap?.series} · {selectedWrap?.finish}</p><p className="text-[10px] text-slate-500">Визуелна симулација на нијансата</p></div></div></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">4. Завршна обработка</label><select value={wrapFinish} onFocus={() => setService('wrap')} onChange={(e) => {setService('wrap');setWrapFinish(e.target.value)}} className="w-full rounded-lg bg-[#181824] border border-[#303044] px-3 py-3 text-sm text-white">{WRAP_FINISHES.map((finish) => <option key={finish.id} value={finish.id}>{finish.label}</option>)}</select></div>
            <div className="rounded-lg border border-[#303044] bg-[#181824] p-3 text-sm text-slate-200">Опфат: цела каросерија</div>
          </div>
          </div>



        </div>
      </div>
      <div className="mt-5 text-[10px] text-slate-600">3D модели се прикажуваат преку Sketchfab. Авторството и лиценцата се наведени за секој избран модел. Tintology не е поврзан со производителите на возилата.</div>
    </div>
  </section>;
}
