import type { RenderContext } from './svg';
import { num } from './svg';

/** A soft wash of color with a Gaussian falloff, the shape light takes as it diffuses. */
export type Light = {
  x: number;
  y: number;
  /** Standard deviation of the falloff along each axis. */
  sigmaX: number;
  sigmaY: number;
  /** Peak opacity at the center. */
  intensity: number;
  color: string;
};

/** Radius of a light shape in standard deviations; past this the falloff is invisible. */
const GAUSSIAN_EXTENT = 3;

/** Defines the lights as a group with id `${ctx.id}-${name}`, to be placed with `<use>`. */
export function lightGroup(lights: Light[], name: string, ctx: RenderContext): string {
  const gradients = new Map<string, { id: string; markup: string }>();

  const shapes = lights
    .map((light) => {
      let gradient = gradients.get(light.color);
      if (!gradient) {
        const id = `${ctx.id}-${name}-g${gradients.size}`;
        gradient = {
          id,
          markup: `<radialGradient id="${id}">${gaussianStops(light.color)}</radialGradient>`,
        };
        gradients.set(light.color, gradient);
      }
      return `<ellipse cx="${num(light.x)}" cy="${num(light.y)}" rx="${num(light.sigmaX * GAUSSIAN_EXTENT)}" ry="${num(light.sigmaY * GAUSSIAN_EXTENT)}" fill="url(#${gradient.id})" fill-opacity="${num(light.intensity)}"/>`;
    })
    .join('');

  return (
    [...gradients.values()].map((gradient) => gradient.markup).join('') +
    `<g id="${ctx.id}-${name}">${shapes}</g>`
  );
}

function gaussianStops(color: string): string {
  const steps = 10;
  return Array.from({ length: steps + 1 }, (_, step) => {
    const t = step / steps;
    const opacity = step === steps ? 0 : Math.exp(-((GAUSSIAN_EXTENT * t) ** 2) / 2);
    return `<stop offset="${num(t)}" stop-color="${color}" stop-opacity="${num(opacity)}"/>`;
  }).join('');
}
