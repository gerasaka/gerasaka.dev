/** Row-major grid of color indices; the flooded region grows from the top-left cell. */
export type Board = Uint8Array;

export function createBoard(
  size: number,
  colors: number,
  random: () => number = Math.random,
): Board {
  const board = new Uint8Array(size * size);
  for (let i = 0; i < board.length; i++) {
    board[i] = Math.floor(random() * colors);
  }
  return board;
}

/** Recolors the region connected to the top-left cell. Returns the same board if `color` wouldn't change it. */
export function flood(board: Board, size: number, color: number): Board {
  const from = board[0];
  if (from === color) return board;

  const next = board.slice();
  const stack = [0];
  next[0] = color;
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % size;
    const neighbors = [
      x > 0 ? i - 1 : -1,
      x < size - 1 ? i + 1 : -1,
      i - size,
      i + size,
    ];
    for (const n of neighbors) {
      if (n < 0 || n >= next.length || next[n] !== from) continue;
      next[n] = color;
      stack.push(n);
    }
  }
  return next;
}

export function isSolved(board: Board): boolean {
  return board.every((cell) => cell === board[0]);
}
