/**
 * Deterministic cover art: soft, out-of-focus subjects over a tinted ground, finished with film
 * grain. Each seed picks a color harmony, the washes of the ground, a main subject, and sometimes
 * a smaller companion behind it. Options can fix any of those choices.
 *
 * The same seed and options always produce the same scene.
 */
import { generateGround, renderGround } from './ground';
import type { Light } from './light';
import type { Palette, PaletteOptions } from './palette';
import { generatePalette } from './palette';
import type { Random } from './random';
import { createRandom, hash } from './random';
import type { Layer, Paint, RenderContext } from './svg';
import { coverSvg, DEFAULT_GRAIN } from './svg';
import type { BloomStudy } from './studies/bloom';
import { generateBloom, generateOrb, renderBloom } from './studies/bloom';
import type { EchoOptions, EchoStudy } from './studies/echo';
import { generateEcho, renderEcho } from './studies/echo';
import type { EclipseStudy } from './studies/eclipse';
import { generateEclipse, renderEclipse } from './studies/eclipse';
import type { PillarsStudy } from './studies/pillars';
import { generatePillars, renderPillars } from './studies/pillars';
import type { RibbonOptions, RibbonStudy } from './studies/ribbon';
import { generateRibbon, renderRibbon } from './studies/ribbon';

export { COVER_HEIGHT, COVER_WIDTH, DEFAULT_GRAIN } from './svg';
export { COLOR_SCHEMES, GROUND_MODES } from './palette';
export type { GroundMode, Palette, Scheme } from './palette';
export { ECHO_SHAPES, ECHO_TRAILS } from './studies/echo';
export type { EchoShape, EchoTrail } from './studies/echo';
export { RIBBON_CURVES } from './studies/ribbon';
export type { RibbonCurveType } from './studies/ribbon';

export type CoverOptions = PaletteOptions & {
  subject?: CoverStudyKind;
  ribbon?: RibbonOptions;
  echo?: EchoOptions;
  companion?: boolean;
  /** Opacity of the film grain, from 0 to 1. */
  grain?: number;
};

export type CoverStudy = BloomStudy | RibbonStudy | EchoStudy | EclipseStudy | PillarsStudy;
export type CoverStudyKind = CoverStudy['kind'];

export const COVER_STUDIES: CoverStudyKind[] = ['bloom', 'ribbon', 'echo', 'eclipse', 'pillars'];

export type CoverScene = {
  seed: number;
  palette: Palette;
  ground: Light[];
  subject: CoverStudy;
  /** A smaller, softer bloom behind the subject. */
  companion?: BloomStudy;
  grain: number;
};

const COMPANION_CHANCE = 0.45;

/** Pillars are the most graphic subject, so they come up least. */
const STUDY_DRAW: CoverStudyKind[] = [
  ...['bloom', 'ribbon', 'echo', 'eclipse'].flatMap((kind) => [kind, kind] as CoverStudyKind[]),
  'pillars',
];

export function generateCover(seedText: string, options: CoverOptions = {}): CoverScene {
  // Each part draws from its own stream, so fixing one part leaves the others as they were.
  const stream = (part: string) => createRandom(hash(`${seedText}:${part}`));
  const palette = generatePalette(stream('palette'), options);
  const ground = generateGround(stream('ground'), palette);

  const subjectRandom = stream('subject');
  const kind = subjectRandom.pick(STUDY_DRAW);
  const subject = generateStudy(options.subject ?? kind, subjectRandom, options, {
    colors: palette.subject,
    halo: palette.halo,
  });

  const companionRandom = stream('companion');
  const hasCompanion = companionRandom.chance(COMPANION_CHANCE);
  const orb = generateOrb(companionRandom, { colors: palette.accent, halo: palette.halo });

  return {
    seed: hash(seedText),
    palette,
    ground,
    subject,
    companion: (options.companion ?? hasCompanion) ? orb : undefined,
    grain: options.grain ?? DEFAULT_GRAIN,
  };
}

function generateStudy(
  kind: CoverStudyKind,
  random: Random,
  options: CoverOptions,
  paint: Paint,
): CoverStudy {
  switch (kind) {
    case 'bloom':
      return generateBloom(random, paint);
    case 'ribbon':
      return generateRibbon(random, paint, options.ribbon);
    case 'echo':
      return generateEcho(random, paint, options.echo);
    case 'eclipse':
      return generateEclipse(random, paint);
    case 'pillars':
      return generatePillars(random, paint);
    default: {
      const unhandled: never = kind;
      throw new Error(`Unknown cover study: ${unhandled}`);
    }
  }
}

export function renderCoverSvg(scene: CoverScene, id = `cover-${scene.seed.toString(36)}`): string {
  const ctx: RenderContext = { id, seed: scene.seed, palette: scene.palette, grain: scene.grain };
  const layers = [renderGround(scene.ground, ctx)];
  if (scene.companion) layers.push(renderStudy(scene.companion, { ...ctx, id: `${id}-companion` }));
  layers.push(renderStudy(scene.subject, { ...ctx, id: `${id}-subject` }));
  return coverSvg(layers, ctx);
}

function renderStudy(study: CoverStudy, ctx: RenderContext): Layer {
  switch (study.kind) {
    case 'bloom':
      return renderBloom(study, ctx);
    case 'ribbon':
      return renderRibbon(study, ctx);
    case 'echo':
      return renderEcho(study, ctx);
    case 'eclipse':
      return renderEclipse(study, ctx);
    case 'pillars':
      return renderPillars(study, ctx);
    default: {
      const unhandled: never = study;
      throw new Error(`Unknown cover study: ${(unhandled as CoverStudy).kind}`);
    }
  }
}

/** One-line summary of the choices behind a cover. */
export function describeCover(scene: CoverScene): string {
  const { subject, palette } = scene;
  const detail = (() => {
    switch (subject.kind) {
      case 'bloom':
        return `stretch ${subject.stretch.toFixed(2)}`;
      case 'ribbon':
        return subject.curve.type;
      case 'echo':
        return `${subject.count} ${subject.shape}s · decay ${subject.decay.toFixed(2)}`;
      case 'eclipse':
        return `separation ${subject.separation.toFixed(2)}`;
      case 'pillars':
        return `${subject.count} · mode ${subject.mode}`;
      default: {
        const unhandled: never = subject;
        throw new Error(`Unknown cover study: ${(unhandled as CoverStudy).kind}`);
      }
    }
  })();
  const companion = scene.companion ? ' + orb' : '';
  return `${subject.kind} (${detail})${companion} · ${palette.mode} ${palette.scheme}`;
}
