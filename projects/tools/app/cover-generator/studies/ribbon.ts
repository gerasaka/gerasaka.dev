/**
 * A thick, out-of-focus ribbon drawn along a classic curve:
 *
 * - Prolate cycloid: the path of a point on a rolling wheel's spoke that reaches past the rim,
 *   x = t − b·sin t, y = −b·cos t, which folds into a loop on every turn.
 * - Lissajous figure: the trace of two perpendicular oscillations, x = sin(at + δ), y = sin(bt).
 * - Logarithmic spiral: r = e^(kθ), the curve that keeps its shape as it grows.
 */
import type { Random } from '../random';
import type { Layer, Paint, RenderContext } from '../svg';
import { blurFilter, COVER_HEIGHT, COVER_WIDTH, gradientStops, num, polyline } from '../svg';

export type RibbonCurve =
  | {
      type: 'cycloid';
      /** Spoke length relative to the wheel radius. Above 1 the curve loops. */
      spoke: number;
      /** Rolling angle where the ribbon starts, and how far it rolls. */
      from: number;
      span: number;
      mirror: boolean;
    }
  | {
      type: 'lissajous';
      /** Frequencies of the horizontal and vertical oscillations. */
      a: number;
      b: number;
      phase: number;
    }
  | {
      type: 'spiral';
      /** Growth per radian. */
      growth: number;
      turns: number;
    };

export type RibbonStudy = Paint & {
  kind: 'ribbon';
  curve: RibbonCurve;
  rotation: number;
  scale: number;
  x: number;
  y: number;
  thickness: number;
};

const SAMPLES = 160;

type Range = [number, number];

/**
 * Size of each curve's bounding box as a fraction of the frame, and stroke thickness as a fraction
 * of its height. Cycloids run out of the frame; closed figures and spirals sit mostly inside it.
 */
const FIT: Record<RibbonCurve['type'], { width: Range; height: Range; thickness: Range }> = {
  cycloid: { width: [1.1, 1.5], height: [1.3, 1.8], thickness: [0.1, 0.16] },
  lissajous: { width: [0.7, 1.05], height: [0.8, 1.2], thickness: [0.07, 0.1] },
  spiral: { width: [0.7, 1.05], height: [0.8, 1.2], thickness: [0.1, 0.16] },
};

export type RibbonCurveType = RibbonCurve['type'];

export const RIBBON_CURVES: RibbonCurveType[] = ['cycloid', 'lissajous', 'spiral'];

export type RibbonOptions = {
  curve?: RibbonCurveType;
};

export function generateRibbon(random: Random, paint: Paint, options: RibbonOptions = {}): RibbonStudy {
  const drawn = random.pick(['cycloid', 'cycloid', 'lissajous', 'spiral'] as const);
  const type = options.curve ?? drawn;
  const curve = generateCurve(type, random);
  const rotation = curve.type === 'spiral' ? random.next() * Math.PI * 2 : random.between(-0.6, 0.6);
  const points = trace(curve).map(([x, y]) => rotate(x, y, rotation));
  const width = spread(points.map(([x]) => x));
  const height = spread(points.map(([, y]) => y));
  const fit = FIT[curve.type];
  const scale = Math.min(
    (random.between(...fit.width) * COVER_WIDTH) / width,
    (random.between(...fit.height) * COVER_HEIGHT) / height,
  );

  return {
    kind: 'ribbon',
    ...paint,
    curve,
    rotation,
    scale,
    x: random.between(0.42, 0.58) * COVER_WIDTH,
    y: random.between(0.42, 0.58) * COVER_HEIGHT,
    thickness: random.between(...fit.thickness) * COVER_HEIGHT,
  };
}

function generateCurve(type: RibbonCurve['type'], random: Random): RibbonCurve {
  switch (type) {
    case 'cycloid':
      return {
        type,
        spoke: random.between(1.8, 3.2),
        from: random.next() * Math.PI * 2,
        span: random.between(0.9, 1.3) * Math.PI * 2,
        mirror: random.chance(0.5),
      };
    case 'lissajous':
      // A 1:2 figure eight. Richer ratios knot into a blob once blurred, and phases near π/2
      // collapse the eight onto a single retraced arc.
      return { type, a: 1, b: 2, phase: random.between(0, 0.35) };
    case 'spiral':
      return { type, growth: random.between(0.12, 0.2), turns: random.between(1.6, 2.4) };
    default: {
      const unhandled: never = type;
      throw new Error(`Unknown ribbon curve: ${unhandled}`);
    }
  }
}

/** Rolling added past each end of a cycloid, so it runs out of the frame instead of stopping. */
const RUNOUT = Math.PI;

/** Points along the curve in its own units, centered on its bounding box. */
function trace(curve: RibbonCurve, runout = 0): [number, number][] {
  const points = ((): [number, number][] => {
    switch (curve.type) {
      case 'cycloid': {
        const from = curve.from - runout;
        const span = curve.span + runout * 2;
        return sample((i) => {
          const t = from + span * i;
          const y = curve.spoke * Math.cos(t);
          return [t - curve.spoke * Math.sin(t), curve.mirror ? y : -y];
        });
      }
      case 'lissajous':
        return sample((i) => {
          const t = i * Math.PI * 2;
          return [Math.sin(curve.a * t + curve.phase), Math.sin(curve.b * t)];
        });
      case 'spiral':
        return sample((i) => {
          const angle = i * curve.turns * Math.PI * 2;
          const r = Math.exp(curve.growth * angle);
          return [r * Math.cos(angle), r * Math.sin(angle)];
        });
      default: {
        const unhandled: never = curve;
        throw new Error(`Unknown ribbon curve: ${(unhandled as RibbonCurve).type}`);
      }
    }
  })();
  const centerX = middle(points.map(([x]) => x));
  const centerY = middle(points.map(([, y]) => y));
  return points.map(([x, y]) => [x - centerX, y - centerY]);
}

function sample(at: (fraction: number) => [number, number]): [number, number][] {
  return Array.from({ length: SAMPLES + 1 }, (_, index) => at(index / SAMPLES));
}

export function renderRibbon(study: RibbonStudy, ctx: RenderContext): Layer {
  const { id } = ctx;
  const place = (points: [number, number][]) =>
    points.map(([x, y]) => {
      const [rx, ry] = rotate(x, y, study.rotation);
      return [study.x + rx * study.scale, study.y + ry * study.scale] as [number, number];
    });
  const path = polyline(place(trace(study.curve, study.curve.type === 'cycloid' ? RUNOUT : 0)));
  // Spread the colors along the part in view, from where the curve starts to where it ends up.
  const visible = place(trace(study.curve));
  const [startX, startY] = visible[0]!;
  const [endX, endY] = farthest(visible, visible[0]!);
  const stroke = (color: string, width: number, extra: string) =>
    `<path d="${path}" fill="none" stroke="${color}" stroke-width="${num(width)}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

  return {
    defs:
      `<linearGradient id="${id}-flow" gradientUnits="userSpaceOnUse" x1="${num(startX)}" y1="${num(startY)}" x2="${num(endX)}" y2="${num(endY)}">${gradientStops(study.colors)}</linearGradient>` +
      blurFilter(`${id}-halo-blur`, study.thickness * 0.9) +
      blurFilter(`${id}-ribbon-blur`, study.thickness * 0.28),
    body:
      stroke(study.halo, study.thickness * 2.8, `opacity="0.7" filter="url(#${id}-halo-blur)"`) +
      stroke(`url(#${id}-flow)`, study.thickness, `filter="url(#${id}-ribbon-blur)"`),
  };
}

function rotate(x: number, y: number, angle: number): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos];
}

function farthest(points: [number, number][], from: [number, number]): [number, number] {
  return points.reduce((best, point) =>
    Math.hypot(point[0] - from[0], point[1] - from[1]) >
    Math.hypot(best[0] - from[0], best[1] - from[1])
      ? point
      : best,
  );
}

function spread(values: number[]): number {
  return Math.max(...values) - Math.min(...values);
}

function middle(values: number[]): number {
  return (Math.max(...values) + Math.min(...values)) / 2;
}
