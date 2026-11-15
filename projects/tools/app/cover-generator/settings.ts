import type {
  CoverOptions,
  CoverStudyKind,
  EchoShape,
  EchoTrail,
  GroundMode,
  RibbonCurveType,
  Scheme,
} from './cover';
import {
  COLOR_SCHEMES,
  COVER_STUDIES,
  ECHO_SHAPES,
  ECHO_TRAILS,
  GROUND_MODES,
  RIBBON_CURVES,
} from './cover';

export type CoverSettings = {
  seed: string;
  options: CoverOptions;
};

export const DEFAULT_SEED = 'untitled';

type Query = Record<string, string | null | (string | null)[] | undefined>;

/** Settings as URL query parameters, leaving out anything left on auto. */
export function settingsToQuery({ seed, options }: CoverSettings): Record<string, string> {
  const query: Record<string, string> = { seed };
  if (options.subject) query.subject = options.subject;
  if (options.ribbon?.curve) query.curve = options.ribbon.curve;
  if (options.echo?.trail) query.trail = options.echo.trail;
  if (options.echo?.shape) query.shape = options.echo.shape;
  if (options.companion !== undefined) query.companion = options.companion ? 'on' : 'off';
  if (options.mode) query.mode = options.mode;
  if (options.scheme) query.scheme = options.scheme;
  if (options.hue !== undefined) query.hue = String(Math.round(options.hue));
  if (options.grain !== undefined) query.grain = String(Math.round(options.grain * 100));
  return query;
}

/** Reads settings from URL query parameters, ignoring anything it doesn't recognize. */
export function settingsFromQuery(query: Query): CoverSettings {
  const read = (key: string) => {
    const value = query[key];
    return (Array.isArray(value) ? value[0] : value) ?? undefined;
  };
  const oneOf = <T extends string>(key: string, values: readonly T[]) => {
    const value = read(key);
    return values.includes(value as T) ? (value as T) : undefined;
  };
  const number = (key: string, min: number, max: number) => {
    const value = Number(read(key));
    return read(key) !== undefined && Number.isFinite(value) && value >= min && value <= max
      ? value
      : undefined;
  };
  const companion = read('companion');
  const grain = number('grain', 0, 100);

  return {
    seed: read('seed') || DEFAULT_SEED,
    options: prune({
      subject: oneOf<CoverStudyKind>('subject', COVER_STUDIES),
      ribbon: pruneNested({ curve: oneOf<RibbonCurveType>('curve', RIBBON_CURVES) }),
      echo: pruneNested({
        trail: oneOf<EchoTrail>('trail', ECHO_TRAILS),
        shape: oneOf<EchoShape>('shape', ECHO_SHAPES),
      }),
      companion: companion === 'on' ? true : companion === 'off' ? false : undefined,
      mode: oneOf<GroundMode>('mode', GROUND_MODES),
      scheme: oneOf<Scheme>('scheme', COLOR_SCHEMES),
      hue: number('hue', 0, 360),
      grain: grain === undefined ? undefined : grain / 100,
    }),
  };
}

/** Drops keys left undefined. */
function prune<T extends object>(value: T): T {
  const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);
  return Object.fromEntries(entries) as T;
}

/** Like `prune`, but an object left empty becomes undefined. */
function pruneNested<T extends object>(value: T): T | undefined {
  const pruned = prune(value);
  return Object.keys(pruned).length ? pruned : undefined;
}

/** File name for a seed, so a post's slug used as the seed names its cover. */
export function coverFileName(seed: string, extension: string): string {
  const slug = seed
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'cover'}.${extension}`;
}
