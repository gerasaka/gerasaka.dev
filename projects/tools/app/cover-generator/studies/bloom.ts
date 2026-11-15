/**
 * A soft bloom of color, like a glow seen out of focus.
 *
 * The outline is a short Fourier series, r(θ) = R(1 + Σ aₖ cos(kθ + φₖ)), which bends a circle
 * into an organic shape. The colors flow across it, and a Gaussian blur softens the edge.
 */
import type { Random } from '../random';
import type { Layer, Paint, RenderContext } from '../svg';
import { blurFilter, COVER_HEIGHT, COVER_WIDTH, gradientStops, num, polyline } from '../svg';

export type Harmonic = {
  amplitude: number;
  phase: number;
};

export type BloomStudy = Paint & {
  kind: 'bloom';
  x: number;
  y: number;
  radius: number;
  /** Horizontal stretch, so the bloom fills a wide frame. */
  stretch: number;
  /** Harmonics 2, 3, and 4 of the outline. */
  harmonics: Harmonic[];
  /** Direction the colors flow across the bloom, in radians. */
  flow: number;
  /** Where the brightest core sits, as a fraction of the radius along the flow. */
  coreOffset: number;
  /** Extra blur, so a small companion bloom reads as further out of focus. */
  softness: number;
};

const OUTLINE_SAMPLES = 72;

export function generateBloom(random: Random, paint: Paint): BloomStudy {
  return {
    kind: 'bloom',
    ...paint,
    x: random.between(0.38, 0.62) * COVER_WIDTH,
    y: random.between(0.45, 0.58) * COVER_HEIGHT,
    radius: random.between(0.3, 0.4) * COVER_HEIGHT,
    stretch: random.between(1.05, 1.4),
    harmonics: harmonics(random),
    flow: random.next() * Math.PI * 2,
    coreOffset: random.between(0.1, 0.3),
    softness: 1,
  };
}

/** A smaller, softer bloom tucked toward a corner, behind the main subject. */
export function generateOrb(random: Random, paint: Paint): BloomStudy {
  const left = random.chance(0.5);
  const top = random.chance(0.5);
  return {
    kind: 'bloom',
    ...paint,
    x: (left ? random.between(0.1, 0.25) : random.between(0.75, 0.9)) * COVER_WIDTH,
    y: (top ? random.between(0.15, 0.3) : random.between(0.7, 0.85)) * COVER_HEIGHT,
    radius: random.between(0.16, 0.24) * COVER_HEIGHT,
    stretch: random.between(1, 1.2),
    harmonics: harmonics(random),
    flow: random.next() * Math.PI * 2,
    coreOffset: random.between(0.1, 0.3),
    softness: random.between(2, 2.8),
  };
}

function harmonics(random: Random): Harmonic[] {
  return [0.08, 0.05, 0.03].map((max) => ({
    amplitude: random.between(0, max),
    phase: random.next() * Math.PI * 2,
  }));
}

export function renderBloom(study: BloomStudy, ctx: RenderContext): Layer {
  const { id } = ctx;
  const outline = (scale: number) =>
    polyline(
      Array.from({ length: OUTLINE_SAMPLES }, (_, index) => {
        const angle = (index / OUTLINE_SAMPLES) * Math.PI * 2;
        const wobble = study.harmonics.reduce(
          (sum, { amplitude, phase }, harmonic) =>
            sum + amplitude * Math.cos((harmonic + 2) * angle + phase),
          0,
        );
        const r = study.radius * scale * (1 + wobble);
        return [study.x + r * Math.cos(angle) * study.stretch, study.y + r * Math.sin(angle)];
      }),
      true,
    );

  const dx = Math.cos(study.flow);
  const dy = Math.sin(study.flow);
  const core = study.colors[Math.floor(study.colors.length / 2)]!;
  // The core leans back along the flow and the halo spills forward, so the colors read as zones.
  const shift = (amount: number) =>
    `translate(${num(dx * study.radius * amount * study.stretch)} ${num(dy * study.radius * amount)})`;
  const blur = (amount: number) => study.radius * amount * study.softness;

  return {
    defs:
      `<linearGradient id="${id}-flow" x1="${num(0.5 - dx / 2)}" y1="${num(0.5 - dy / 2)}" x2="${num(0.5 + dx / 2)}" y2="${num(0.5 + dy / 2)}">${gradientStops(study.colors)}</linearGradient>` +
      blurFilter(`${id}-halo-blur`, blur(0.4)) +
      blurFilter(`${id}-bloom-blur`, blur(0.14)) +
      blurFilter(`${id}-core-blur`, blur(0.22)),
    body:
      `<path d="${outline(1.25)}" transform="${shift(0.3)}" fill="${study.halo}" opacity="0.8" filter="url(#${id}-halo-blur)"/>` +
      `<path d="${outline(1)}" fill="url(#${id}-flow)" opacity="${num(Math.min(1, 1.6 / study.softness + 0.1))}" filter="url(#${id}-bloom-blur)"/>` +
      `<path d="${outline(0.45)}" transform="${shift(-study.coreOffset)}" fill="${core}" opacity="0.5" filter="url(#${id}-core-blur)"/>`,
  };
}
