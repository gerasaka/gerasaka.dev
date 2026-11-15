/**
 * A row of soft capsules whose heights trace a standing wave.
 *
 * A string fixed at both ends vibrates in modes, y = |sin(nπx/L + φ)|; sampling that envelope at
 * evenly spaced points gives each capsule its height.
 */
import type { Random } from '../random';
import type { Layer, Paint, RenderContext } from '../svg';
import { blurFilter, COVER_HEIGHT, COVER_WIDTH, gradientStops, num } from '../svg';

export type PillarsStudy = Paint & {
  kind: 'pillars';
  count: number;
  width: number;
  gap: number;
  /** Center of the row. */
  x: number;
  y: number;
  /** Mode number and phase of the standing wave. */
  mode: number;
  phase: number;
  /** Shortest and tallest capsule heights. */
  minHeight: number;
  maxHeight: number;
  /** Grow capsules from a shared baseline instead of the center line. */
  grounded: boolean;
};

export function generatePillars(random: Random, paint: Paint): PillarsStudy {
  const count = Math.round(random.between(3, 5));
  const width = random.between(0.08, 0.11) * COVER_WIDTH;
  return {
    kind: 'pillars',
    ...paint,
    count,
    width,
    gap: width * random.between(0.35, 0.8),
    x: random.between(0.42, 0.58) * COVER_WIDTH,
    y: random.between(0.45, 0.55) * COVER_HEIGHT,
    mode: random.pick([1, 1, 2]),
    phase: random.between(0, Math.PI),
    minHeight: random.between(0.25, 0.4) * COVER_HEIGHT,
    maxHeight: random.between(0.65, 0.85) * COVER_HEIGHT,
    grounded: random.chance(0.35),
  };
}

export function renderPillars(study: PillarsStudy, ctx: RenderContext): Layer {
  const { id } = ctx;
  const pitch = study.width + study.gap;
  const rowWidth = study.count * pitch - study.gap;
  const left = study.x - rowWidth / 2;
  const baseline = study.y + study.maxHeight / 2;

  const capsules = Array.from({ length: study.count }, (_, index) => {
    const position = (index + 0.5) / study.count;
    const envelope = Math.abs(Math.sin(study.mode * Math.PI * position + study.phase));
    const height = study.minHeight + (study.maxHeight - study.minHeight) * envelope;
    const top = study.grounded ? baseline - height : study.y - height / 2;
    return `<rect x="${num(left + index * pitch)}" y="${num(top)}" width="${num(study.width)}" height="${num(height)}" rx="${num(study.width / 2)}" fill="url(#${id}-pillar${index % 2})"/>`;
  });

  const reversed = [...study.colors].reverse();
  return {
    defs:
      `<linearGradient id="${id}-pillar0" x1="0" y1="0" x2="0" y2="1">${gradientStops(study.colors)}</linearGradient>` +
      `<linearGradient id="${id}-pillar1" x1="0" y1="0" x2="0" y2="1">${gradientStops(reversed)}</linearGradient>` +
      blurFilter(`${id}-halo-blur`, study.maxHeight * 0.3) +
      blurFilter(`${id}-pillar-blur`, study.width * 0.3),
    body:
      `<ellipse cx="${num(study.x)}" cy="${num(study.y)}" rx="${num(rowWidth * 0.7)}" ry="${num(study.maxHeight * 0.6)}" fill="${study.halo}" opacity="0.6" filter="url(#${id}-halo-blur)"/>` +
      `<g filter="url(#${id}-pillar-blur)">${capsules.join('')}</g>`,
  };
}
