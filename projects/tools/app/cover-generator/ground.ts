import type { Light } from './light';
import { lightGroup } from './light';
import type { Palette } from './palette';
import type { Random } from './random';
import type { Layer, RenderContext } from './svg';
import { COVER_HEIGHT, COVER_WIDTH } from './svg';

/** Corners and edge midpoints, as fractions of the frame. */
const ANCHORS = [
  [0, 0],
  [0.5, 0],
  [1, 0],
  [1, 0.5],
  [1, 1],
  [0.5, 1],
  [0, 1],
  [0, 0.5],
] as const;

/** Washes of the palette's tints bleeding in from a few edges of the frame. */
export function generateGround(random: Random, palette: Palette): Light[] {
  const first = Math.floor(random.next() * ANCHORS.length);
  // Spread the washes around the frame so they don't pool on one side.
  return palette.tints.map((color, index): Light => {
    const [ax, ay] = ANCHORS[(first + index * 3) % ANCHORS.length]!;
    const sigma = random.between(0.18, 0.28) * COVER_WIDTH;
    return {
      x: (ax + random.between(-0.08, 0.08)) * COVER_WIDTH,
      y: (ay + random.between(-0.1, 0.1)) * COVER_HEIGHT,
      sigmaX: sigma,
      sigmaY: sigma * random.between(0.7, 1),
      intensity: random.between(0.75, 1),
      color,
    };
  });
}

export function renderGround(lights: Light[], ctx: RenderContext): Layer {
  return {
    defs: lightGroup(lights, 'ground', ctx),
    body: `<use href="#${ctx.id}-ground"/>`,
  };
}
