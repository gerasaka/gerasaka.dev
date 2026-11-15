import type { Palette } from './palette';

export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 630;

export type RenderContext = {
  /** Prefix for every element id, so several covers can share a page. */
  id: string;
  seed: number;
  palette: Palette;
  /** Opacity of the film grain, from 0 to 1. */
  grain: number;
};

export const DEFAULT_GRAIN = 0.4;

export type Layer = {
  defs: string;
  body: string;
};

/** Colors a subject is painted with. */
export type Paint = {
  colors: string[];
  halo: string;
};

export function coverSvg(layers: Layer[], { id, seed, palette, grain }: RenderContext): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COVER_WIDTH} ${COVER_HEIGHT}" width="${COVER_WIDTH}" height="${COVER_HEIGHT}">` +
    `<defs>` +
    layers.map((layer) => layer.defs).join('') +
    `<filter id="${id}-grain" x="0" y="0" width="100%" height="100%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed % 1000}" stitchTiles="stitch"/>` +
    `<feColorMatrix type="saturate" values="0"/>` +
    `</filter>` +
    `</defs>` +
    `<rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="${palette.ground}"/>` +
    layers.map((layer) => layer.body).join('') +
    `<rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" filter="url(#${id}-grain)" opacity="${num(grain)}" style="mix-blend-mode:overlay"/>` +
    `</svg>`
  );
}

/** A Gaussian blur, the same kernel heat diffusion spreads with. */
export function blurFilter(id: string, deviation: number): string {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${num(deviation)}"/></filter>`;
}

export function polyline(points: readonly (readonly [number, number])[], closed = false): string {
  const path = points
    .map(([x, y], index) => `${index ? 'L' : 'M'}${num1(x)} ${num1(y)}`)
    .join('');
  return closed ? `${path}Z` : path;
}

export function gradientStops(colors: readonly string[]): string {
  return colors
    .map(
      (color, index) =>
        `<stop offset="${num(colors.length === 1 ? 0 : index / (colors.length - 1))}" stop-color="${color}"/>`,
    )
    .join('');
}

export function num(value: number): string {
  return String(Math.round(value * 1000) / 1000);
}

function num1(value: number): string {
  return String(Math.round(value * 10) / 10);
}
