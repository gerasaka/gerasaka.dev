import { describe, expect, it } from 'vitest';
import { population, step } from './life';

function board(rows: string[]) {
  return Uint8Array.from(rows.join(''), (c) => (c === '#' ? 1 : 0));
}

function advance(rows: string[]) {
  const width = rows[0]!.length;
  const current = board(rows);
  const next = new Uint8Array(current.length);
  step(current, next, width, rows.length);
  return next;
}

describe('step', () => {
  it('keeps a block still', () => {
    const block = ['....', '.##.', '.##.', '....'];
    expect(advance(block)).toEqual(board(block));
  });

  it('flips a blinker between horizontal and vertical', () => {
    expect(advance(['.....', '.....', '.###.', '.....', '.....'])).toEqual(
      board(['.....', '..#..', '..#..', '..#..', '.....']),
    );
  });

  it('does not wrap neighbors across edges', () => {
    // wrapping would give the left-edge cell 3 neighbors and bring it to life
    expect(advance(['...#', '...#', '...#'])).toEqual(board(['....', '..##', '....']));
  });

  it('dies out to zero population', () => {
    expect(population(advance(['...', '.#.', '...']))).toBe(0);
  });
});
