import { oklch } from './color';
import type { Random } from './random';

export type Palette = {
  ground: string;
  /** Soft washes that bleed in from the edges of the frame. */
  tints: string[];
  /** Saturated colors of the main subject, in the order they flow across it. */
  subject: string[];
  /** A contrasting color for a secondary subject. */
  accent: string[];
  /** Glow that spills around a subject. */
  halo: string;
  mode: GroundMode;
  scheme: Scheme;
  hue: number;
};

export type GroundMode = 'pale' | 'mist' | 'night';
export type Scheme = 'analogous' | 'complementary' | 'triadic' | 'split';

/**
 * Hue offsets, in degrees, from the base hue for each color harmony. A subject's colors stay
 * neighbors, since distant hues blur together into gray; the harmony shows in the accent and ground.
 */
const SCHEMES: Record<Scheme, { subject: number[]; accent: number; ground: number }> = {
  analogous: { subject: [0, 28, 56], accent: -40, ground: 200 },
  complementary: { subject: [0, 25], accent: 180, ground: 180 },
  triadic: { subject: [0, 35], accent: 120, ground: 240 },
  split: { subject: [0, 30], accent: 150, ground: 210 },
};

type Lightness = {
  ground: [number, number];
  groundChroma: [number, number];
  tint: [number, number];
  tintChroma: [number, number];
  subject: [number, number];
  subjectChroma: [number, number];
};

const MODES: Record<GroundMode, Lightness> = {
  pale: {
    ground: [0.94, 0.975],
    groundChroma: [0.005, 0.02],
    tint: [0.88, 0.93],
    tintChroma: [0.04, 0.08],
    subject: [0.72, 0.86],
    subjectChroma: [0.14, 0.2],
  },
  mist: {
    ground: [0.8, 0.86],
    groundChroma: [0.03, 0.06],
    tint: [0.84, 0.9],
    tintChroma: [0.03, 0.06],
    subject: [0.72, 0.84],
    subjectChroma: [0.15, 0.2],
  },
  night: {
    ground: [0.17, 0.24],
    groundChroma: [0.02, 0.05],
    tint: [0.28, 0.36],
    tintChroma: [0.05, 0.09],
    subject: [0.7, 0.84],
    subjectChroma: [0.13, 0.19],
  },
};

const MODE_WEIGHTS: [GroundMode, number][] = [
  ['pale', 0.55],
  ['mist', 0.25],
  ['night', 0.2],
];

export const GROUND_MODES: GroundMode[] = ['pale', 'mist', 'night'];
export const COLOR_SCHEMES = Object.keys(SCHEMES) as Scheme[];

export type PaletteOptions = {
  mode?: GroundMode;
  scheme?: Scheme;
  /** Base hue in degrees. */
  hue?: number;
};

export function generatePalette(random: Random, options: PaletteOptions = {}): Palette {
  // Draw every choice even when it's overridden, so fixing one leaves the rest of the palette as is.
  const drawnMode = weighted(random, MODE_WEIGHTS);
  const drawnScheme = random.pick(COLOR_SCHEMES);
  const drawnHue = random.next() * 360;
  const mode = options.mode ?? drawnMode;
  const scheme = options.scheme ?? drawnScheme;
  const base = options.hue ?? drawnHue;
  const offsets = SCHEMES[scheme];
  const range = MODES[mode];
  const jitter = () => random.between(-8, 8);
  const at = ([min, max]: [number, number]) => random.between(min, max);

  const vivid = (hue: number) =>
    oklch(brightEnough(hue, at(range.subject)), at(range.subjectChroma), hue);

  const subject = offsets.subject.map((offset) => vivid(base + offset + jitter()));
  const accentHue = base + offsets.accent + jitter();
  const accent = [0, 20].map((offset) => vivid(accentHue + offset));
  // Dim grounds in warm or green hues read as brown and olive, so keep them cool or rosy.
  const groundHue =
    mode === 'pale' ? base + offsets.ground + jitter() : into(base + offsets.ground, 190, 340);
  const tintHues =
    mode === 'pale'
      ? [groundHue, base + offsets.subject[0]!, accentHue]
      : [groundHue, into(base, 190, 340), into(accentHue, 190, 340)];

  return {
    ground: oklch(at(range.ground), at(range.groundChroma), groundHue),
    tints: tintHues.map((hue) => oklch(at(range.tint), at(range.tintChroma), hue + jitter())),
    subject,
    accent,
    halo:
      mode === 'night'
        ? oklch(isYellowish(base) ? 0.72 : 0.5, 0.12, base + jitter())
        : oklch(at(range.tint), 0.09, base + jitter()),
    mode,
    scheme,
    hue: base,
  };
}

/** Yellows and limes turn olive unless they're light. */
function brightEnough(hue: number, lightness: number): number {
  return isYellowish(hue) ? Math.max(lightness, 0.88) : lightness;
}

function isYellowish(hue: number): boolean {
  const h = ((hue % 360) + 360) % 360;
  return h > 65 && h < 135;
}

/** Maps any hue proportionally into the range [from, to]. */
function into(hue: number, from: number, to: number): number {
  const h = ((hue % 360) + 360) % 360;
  return from + (h / 360) * (to - from);
}

function weighted<T>(random: Random, options: [T, number][]): T {
  let roll = random.next();
  for (const [value, weight] of options) {
    roll -= weight;
    if (roll < 0) return value;
  }
  return options[options.length - 1]![0];
}
