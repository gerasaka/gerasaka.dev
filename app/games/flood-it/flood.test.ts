import { describe, expect, it } from 'vitest';
import { flood, isSolved } from './flood';

function board(rows: string[]) {
  return Uint8Array.from(rows.join(''), Number);
}

describe('flood', () => {
  it('recolors only the region connected to the top-left cell', () => {
    // the 0 at the bottom-right isn't connected to the top-left region
    expect(flood(board(['001', '011', '110']), 3, 2)).toEqual(board(['221', '211', '110']));
  });

  it('does not connect cells diagonally', () => {
    expect(flood(board(['01', '10']), 2, 2)).toEqual(board(['21', '10']));
  });

  it('returns the same board when picking the current color', () => {
    const b = board(['01', '10']);
    expect(flood(b, 2, 0)).toBe(b);
  });
});

describe('isSolved', () => {
  it('is solved once every cell shares one color', () => {
    expect(isSolved(board(['22', '22']))).toBe(true);
    expect(isSolved(board(['22', '21']))).toBe(false);
  });
});
