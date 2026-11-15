/**
 * A glowing disc partly covered by a dark one, like the Moon passing in front of the Sun.
 *
 * What stays visible is the lune between two overlapping circles; how much of it shows depends
 * only on the distance between their centers. A soft corona glows around the covered disc.
 */
import type { Random } from '../random';
import type { Layer, Paint, RenderContext } from '../svg';
import { blurFilter, COVER_HEIGHT, COVER_WIDTH, gradientStops, num } from '../svg';

export type EclipseStudy = Paint & {
  kind: 'eclipse';
  x: number;
  y: number;
  radius: number;
  /** Distance between the two centers, as a fraction of the radius. */
  separation: number;
  /** Direction from the glowing disc to the covering one, in radians. */
  angle: number;
  /** Size of the covering disc relative to the glowing one. */
  cover: number;
};

export function generateEclipse(random: Random, paint: Paint): EclipseStudy {
  return {
    kind: 'eclipse',
    ...paint,
    x: random.between(0.35, 0.65) * COVER_WIDTH,
    y: random.between(0.42, 0.58) * COVER_HEIGHT,
    radius: random.between(0.26, 0.34) * COVER_HEIGHT,
    separation: random.between(0.3, 0.65),
    angle: random.next() * Math.PI * 2,
    cover: random.between(0.92, 1.05),
  };
}

export function renderEclipse(study: EclipseStudy, ctx: RenderContext): Layer {
  const { id } = ctx;
  const { x, y, radius } = study;
  const coverX = x + Math.cos(study.angle) * study.separation * radius;
  const coverY = y + Math.sin(study.angle) * study.separation * radius;
  // The colors run across the lune, from its thick middle out to its tips.
  const dx = -Math.cos(study.angle) / 2;
  const dy = -Math.sin(study.angle) / 2;

  return {
    defs:
      `<linearGradient id="${id}-disc" x1="${num(0.5 - dx)}" y1="${num(0.5 - dy)}" x2="${num(0.5 + dx)}" y2="${num(0.5 + dy)}">${gradientStops(study.colors)}</linearGradient>` +
      blurFilter(`${id}-corona-blur`, radius * 0.45) +
      blurFilter(`${id}-disc-blur`, radius * 0.08) +
      blurFilter(`${id}-cover-blur`, radius * 0.1) +
      `<mask id="${id}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${COVER_WIDTH}" height="${COVER_HEIGHT}">` +
      `<rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="#fff"/>` +
      `<circle cx="${num(coverX)}" cy="${num(coverY)}" r="${num(radius * study.cover)}" fill="#000" filter="url(#${id}-cover-blur)"/>` +
      `</mask>`,
    body:
      `<circle cx="${num(x)}" cy="${num(y)}" r="${num(radius * 1.35)}" fill="${study.halo}" opacity="0.7" filter="url(#${id}-corona-blur)"/>` +
      `<g mask="url(#${id}-mask)">` +
      `<circle cx="${num(x)}" cy="${num(y)}" r="${num(radius)}" fill="url(#${id}-disc)" filter="url(#${id}-disc-blur)"/>` +
      `</g>`,
  };
}
