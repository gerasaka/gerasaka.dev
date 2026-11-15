import { describe, expect, it } from 'vitest';
import { COVER_HEIGHT, COVER_STUDIES, COVER_WIDTH, generateCover, renderCoverSvg } from './cover';

const seeds = Array.from({ length: 400 }, (_, index) => `seed-${index}`);

describe('cover', () => {
  it('renders the same svg for the same seed', () => {
    expect(renderCoverSvg(generateCover('hello-world'))).toBe(
      renderCoverSvg(generateCover('hello-world')),
    );
  });

  it('renders different covers for different seeds', () => {
    expect(renderCoverSvg(generateCover('hello-world'))).not.toBe(
      renderCoverSvg(generateCover('hello-there')),
    );
  });

  it('uses every study', () => {
    const kinds = new Set(seeds.map((seed) => generateCover(seed).subject.kind));
    expect([...kinds].sort()).toEqual([...COVER_STUDIES].sort());
  });

  it('keeps the echo stack inside the frame', () => {
    for (const seed of seeds) {
      const { subject } = generateCover(seed);
      if (subject.kind !== 'echo') continue;
      const reach = (subject.count - 1) * subject.step + subject.radius;
      const crownX = subject.x + reach * Math.cos(subject.direction);
      const crownY = subject.y + reach * Math.sin(subject.direction);
      expect(crownX).toBeGreaterThan(0);
      expect(crownX).toBeLessThan(COVER_WIDTH);
      expect(crownY).toBeGreaterThan(0);
      expect(crownY).toBeLessThan(COVER_HEIGHT);
    }
  });

  it('keeps palette colors valid hex', () => {
    for (const seed of seeds) {
      const { palette } = generateCover(seed);
      const colors = [palette.ground, palette.halo, ...palette.tints, ...palette.subject, ...palette.accent];
      for (const color of colors) expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('keeps the palette when the subject is fixed', () => {
    for (const seed of seeds.slice(0, 40)) {
      const free = generateCover(seed);
      const fixed = generateCover(seed, { subject: 'eclipse' });
      expect(fixed.subject.kind).toBe('eclipse');
      expect(fixed.palette).toEqual(free.palette);
      expect(fixed.ground).toEqual(free.ground);
    }
  });

  it('keeps the subject shape when the colors are fixed', () => {
    for (const seed of seeds.slice(0, 40)) {
      const free = generateCover(seed);
      const fixed = generateCover(seed, { hue: 200, mode: 'night', scheme: 'triadic' });
      expect({ ...fixed.subject, colors: [], halo: '' }).toEqual({
        ...free.subject,
        colors: [],
        halo: '',
      });
    }
  });

  it('toggles the companion without moving it', () => {
    const on = generateCover('hello-world', { companion: true });
    const off = generateCover('hello-world', { companion: false });
    expect(on.companion).toBeDefined();
    expect(off.companion).toBeUndefined();
    expect(generateCover('another', { companion: true }).companion).toBeDefined();
  });

  it('applies fixed study options', () => {
    const ribbon = generateCover('hello-world', { subject: 'ribbon', ribbon: { curve: 'spiral' } });
    expect(ribbon.subject.kind === 'ribbon' && ribbon.subject.curve.type).toBe('spiral');
    const echo = generateCover('hello-world', {
      subject: 'echo',
      echo: { trail: 'left', shape: 'disc' },
    });
    expect(echo.subject.kind === 'echo' && echo.subject.shape).toBe('disc');
  });

  it('prefixes ids so several covers can share a page', () => {
    for (const seed of seeds.slice(0, 40)) {
      const svg = renderCoverSvg(generateCover(seed), 'a');
      expect(svg).not.toMatch(/id="(?!a-)/);
    }
  });
});
