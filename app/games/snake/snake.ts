export type Point = { x: number; y: number };

export type SnakeGame = {
  snake: Point[];
  direction: Point;
  pendingDirection: Point;
  food: Point;
  score: number;
  dead: boolean;
  won: boolean;
};

function randomPoint(grid: number, random: () => number): Point {
  return { x: Math.floor(random() * grid), y: Math.floor(random() * grid) };
}

function samePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

function placeFood(snake: Point[], grid: number, random: () => number): Point {
  let food = randomPoint(grid, random);
  while (snake.some((s) => samePoint(s, food))) {
    food = randomPoint(grid, random);
  }
  return food;
}

export function createGame(grid: number, random: () => number = Math.random): SnakeGame {
  const mid = Math.floor(grid / 2);
  const direction = { x: 1, y: 0 };
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  return {
    snake,
    direction,
    pendingDirection: direction,
    food: placeFood(snake, grid, random),
    score: 0,
    dead: false,
    won: false,
  };
}

/** Queue a direction change, rejecting 180° turns against the current tick's direction. */
export function turn(game: SnakeGame, next: Point): SnakeGame {
  const { direction } = game;
  if (next.x === -direction.x && next.y === -direction.y) return game;
  return { ...game, pendingDirection: next };
}

export function step(game: SnakeGame, grid: number, random: () => number = Math.random): SnakeGame {
  if (game.dead) return game;

  const direction = game.pendingDirection;
  const head = {
    x: game.snake[0]!.x + direction.x,
    y: game.snake[0]!.y + direction.y,
  };

  const hitWall = head.x < 0 || head.x >= grid || head.y < 0 || head.y >= grid;
  const hitSelf = game.snake.some((s) => samePoint(s, head));
  if (hitWall || hitSelf) return { ...game, direction, dead: true };

  const ate = samePoint(head, game.food);
  const snake = [head, ...game.snake];
  if (!ate) snake.pop();

  if (snake.length === grid * grid) {
    return { ...game, direction, snake, score: game.score + 1, dead: true, won: true };
  }

  return {
    ...game,
    direction,
    snake,
    food: ate ? placeFood(snake, grid, random) : game.food,
    score: game.score + (ate ? 1 : 0),
  };
}
