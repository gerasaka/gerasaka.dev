import { describe, expect, it } from 'vitest';
import type { CoverSettings } from './settings';
import { coverFileName, DEFAULT_SEED, settingsFromQuery, settingsToQuery } from './settings';

describe('cover settings', () => {
  it('round-trips through the query', () => {
    const settings: CoverSettings = {
      seed: 'hello-world',
      options: {
        subject: 'echo',
        echo: { trail: 'left', shape: 'disc' },
        companion: false,
        mode: 'night',
        scheme: 'split',
        hue: 212,
        grain: 0.25,
      },
    };
    expect(settingsFromQuery(settingsToQuery(settings))).toEqual(settings);
  });

  it('leaves auto settings out of the query', () => {
    expect(settingsToQuery({ seed: 'a', options: {} })).toEqual({ seed: 'a' });
  });

  it('ignores values it does not recognize', () => {
    expect(
      settingsFromQuery({ subject: 'square', hue: '999', grain: 'lots', companion: 'maybe' }),
    ).toEqual({ seed: DEFAULT_SEED, options: {} });
  });

  it('names files after the seed', () => {
    expect(coverFileName('Hello World!', 'jpg')).toBe('hello-world.jpg');
    expect(coverFileName('   ', 'svg')).toBe('cover.svg');
  });
});
