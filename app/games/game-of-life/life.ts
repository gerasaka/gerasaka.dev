export type Cells = Uint8Array;

export function createBoard(
  width: number,
  height: number,
  density: number,
  random: () => number = Math.random,
): Cells {
  const cells = new Uint8Array(width * height);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = random() < density ? 1 : 0;
  }
  return cells;
}

/** Writes the next generation of `current` into `next`. Cells outside the board count as dead. */
export function step(current: Cells, next: Cells, width: number, height: number): void {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if ((dx === 0 && dy === 0) || nx < 0 || nx >= width) continue;
          neighbors += current[ny * width + nx]!;
        }
      }

      const i = y * width + x;
      next[i] = neighbors === 3 || (neighbors === 2 && current[i] === 1) ? 1 : 0;
    }
  }
}

export function population(cells: Cells): number {
  let count = 0;
  for (const cell of cells) count += cell;
  return count;
}
