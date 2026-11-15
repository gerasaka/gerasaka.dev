/**
 * A shape repeated along a line, each copy a fainter afterimage of the one before.
 *
 * The afterimages fade exponentially, Iₖ = qᵏ, the way a phosphor or a retina lets go of a bright
 * shape. Each copy carries the colors from its leading edge back to a trailing edge that dissolves.
 */
import type { Random } from '../random';
import type { Layer, Paint, RenderContext } from '../svg';
import { blurFilter, COVER_HEIGHT, COVER_WIDTH, num } from '../svg';

export type EchoStudy = Paint & {
  kind: 'echo';
  shape: 'dome' | 'disc';
  count: number;
  radius: number;
  /** Stretch across the direction of travel. */
  stretch: number;
  /** Distance between consecutive copies. */
  step: number;
  /** Direction the afterimages trail off in, in radians. */
  direction: number;
  /** Center of the brightest copy. */
  x: number;
  y: number;
  /** Brightness kept by each successive afterimage. */
  decay: number;
};

export type EchoTrail = 'up' | 'left' | 'right';
export type EchoShape = EchoStudy['shape'];

export const ECHO_TRAILS: EchoTrail[] = ['up', 'left', 'right'];
export const ECHO_SHAPES: EchoShape[] = ['dome', 'disc'];

export type EchoOptions = {
  trail?: EchoTrail;
  shape?: EchoShape;
};

const TRAIL_ANGLES: Record<EchoTrail, number> = { up: -Math.PI / 2, left: Math.PI, right: 0 };

export function generateEcho(random: Random, paint: Paint, options: EchoOptions = {}): EchoStudy {
  // Draw every choice even when it's overridden, so fixing one leaves the others as they were.
  const drawnTrail: EchoTrail = random.chance(0.4) ? (random.chance(0.5) ? 'right' : 'left') : 'up';
  const drawnShape = random.pick(ECHO_SHAPES);
  const lean = random.between(-0.12, 0.12);
  const trail = options.trail ?? drawnTrail;
  const horizontal = trail !== 'up';
  const direction = TRAIL_ANGLES[trail] + lean;
  // Stacked vertically, discs merge into a single pill; they only read as a trail sideways.
  const shape = options.shape ?? (horizontal ? drawnShape : 'dome');
  const count = horizontal ? random.pick([4, 5, 6]) : 3;
  const radius = (horizontal ? random.between(0.22, 0.28) : random.between(0.24, 0.28)) * COVER_HEIGHT;
  const along = horizontal ? 0.88 * COVER_WIDTH : 0.96 * COVER_HEIGHT;
  // Stacked vertically, domes need a full radius between them or their bases band together.
  const spacing = horizontal ? random.between(0.8, 1) : random.between(1, 1.1);
  // Fit the stack, from the first copy's dissolving edge to the last copy's crown, in the frame.
  const step = Math.min(spacing * radius, (along - radius * 1.3) / (count - 1));
  const extent = (count - 1) * step + radius * 1.2;
  const back = extent / 2 - radius * 0.2;

  return {
    kind: 'echo',
    ...paint,
    shape,
    count,
    radius,
    stretch: random.between(1, 1.15),
    step,
    direction,
    x: COVER_WIDTH * random.between(0.45, 0.55) - Math.cos(direction) * back,
    y: COVER_HEIGHT * random.between(0.47, 0.53) - Math.sin(direction) * back,
    decay: random.between(0.6, 0.75),
  };
}

export function renderEcho(study: EchoStudy, ctx: RenderContext): Layer {
  const { id } = ctx;
  const { radius, colors } = study;
  const leading = study.shape === 'dome' ? 0.72 : 1;
  const stops =
    colors
      .map(
        (color, index) =>
          `<stop offset="${num((index / Math.max(1, colors.length - 1)) * leading)}" stop-color="${color}"/>`,
      )
      .join('') +
    (study.shape === 'dome'
      ? `<stop offset="1" stop-color="${colors[colors.length - 1]}" stop-opacity="0"/>`
      : '');

  const rx = radius * study.stretch;
  // Shapes are drawn crown-up, then turned so the crown leads in the direction of travel.
  const shape =
    study.shape === 'dome'
      ? `<path d="M${num(-rx)} 0A${num(rx)} ${num(radius)} 0 0 1 ${num(rx)} 0Z"`
      : `<ellipse rx="${num(rx)}" ry="${num(radius)}"`;
  const degrees = ((study.direction + Math.PI / 2) * 180) / Math.PI;
  const copies = Array.from({ length: study.count }, (_, k) => {
    const x = study.x + k * study.step * Math.cos(study.direction);
    const y = study.y + k * study.step * Math.sin(study.direction);
    return `${shape} transform="translate(${num(x)} ${num(y)}) rotate(${num(degrees)})" fill="url(#${id}-shape)" opacity="${num(study.decay ** k)}"/>`;
  }).reverse();

  const middle = (study.count - 1) / 2;
  const haloX = study.x + middle * study.step * Math.cos(study.direction);
  const haloY = study.y + middle * study.step * Math.sin(study.direction);
  const horizontal = Math.abs(Math.cos(study.direction)) > 0.5;

  return {
    defs:
      `<linearGradient id="${id}-shape" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>` +
      blurFilter(`${id}-halo-blur`, radius * 0.6) +
      blurFilter(`${id}-shape-blur`, radius * 0.13),
    body:
      `<ellipse cx="${num(haloX)}" cy="${num(haloY)}" rx="${num(horizontal ? radius * 3 : rx * 1.6)}" ry="${num(horizontal ? radius * 1.4 : radius * 2)}" fill="${study.halo}" opacity="0.6" filter="url(#${id}-halo-blur)"/>` +
      `<g filter="url(#${id}-shape-blur)">${copies.join('')}</g>`,
  };
}
