<script lang="ts" setup>
  import { createGame, step, turn, type Point } from './snake';

  type GameState = 'idle' | 'playing' | 'paused' | 'over';

  const GRID = 10;
  const TICK_MS = 130;
  const BOARD_PX = 448; // matches max-w-md (28rem) so canvas maps 1:1 to CSS pixels
  const DIRECTIONS: Record<string, Point> = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
  const state = ref<GameState>('idle');
  const game = ref(createGame(GRID));
  const score = computed(() => game.value.score);

  const colors = { snake: '#000000', food: '#4285d5' };
  let timer: ReturnType<typeof setInterval> | null = null;

  function tick() {
    game.value = step(game.value, GRID);
    if (game.value.dead) state.value = 'over';
    draw();
  }

  function draw() {
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cell = BOARD_PX / GRID;
    // scale all drawing by dpr so squares stay crisp on retina/HiDPI screens
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, BOARD_PX, BOARD_PX);

    const { snake, food } = game.value;
    ctx.fillStyle = colors.food;
    ctx.fillRect(food.x * cell, food.y * cell, cell, cell);

    ctx.fillStyle = colors.snake;
    for (const { x, y } of snake) {
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }

  function startLoop() {
    stopLoop();
    timer = setInterval(tick, TICK_MS);
  }

  function stopLoop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restart() {
    game.value = createGame(GRID);
    draw();
    state.value = 'playing';
  }

  function onKeydown(event: KeyboardEvent) {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const next = DIRECTIONS[key];

    if (key === ' ') {
      if (state.value === 'playing' || state.value === 'paused') {
        event.preventDefault();
        state.value = state.value === 'playing' ? 'paused' : 'playing';
      }
      return;
    }

    if (state.value === 'over' && (next || key === 'Enter')) {
      event.preventDefault();
      restart();
      if (next) game.value = turn(game.value, next);
      return;
    }

    if (!next) return;
    event.preventDefault();

    if (state.value === 'idle') state.value = 'playing';
    if (state.value === 'playing') game.value = turn(game.value, next);
  }

  onMounted(() => {
    const styles = getComputedStyle(document.documentElement);
    colors.snake = styles.getPropertyValue('--color-foreground').trim() || colors.snake;
    colors.food = styles.getPropertyValue('--color-primary-500').trim() || colors.food;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.value) {
      canvas.value.width = BOARD_PX * dpr;
      canvas.value.height = BOARD_PX * dpr;
    }

    draw();
  });

  onBeforeUnmount(stopLoop);

  watch(state, (value) => {
    if (value === 'playing') startLoop();
    else stopLoop();
  });

  const visibility = useDocumentVisibility();
  watch(visibility, (value) => {
    if (value === 'hidden' && state.value === 'playing') state.value = 'paused';
  });

  useEventListener(window, 'keydown', onKeydown);
</script>

<template>
  <div class="w-full max-w-md">
    <div class="flex items-baseline justify-between">
      <p class="text-muted text-sm">Score</p>
      <p class="font-pixel text-3xl leading-none" aria-live="polite">{{ score }}</p>
    </div>

    <div
      class="relative mt-3 aspect-square w-full border border-muted/30 cursor-pointer"
      @click="state === 'over' && restart()"
    >
      <canvas ref="canvas" class="block h-full w-full" role="img" aria-label="Snake game board" />

      <div
        v-if="state !== 'playing'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/80 text-center"
      >
        <template v-if="state === 'idle'">
          <p class="font-pixel text-2xl">Press an arrow key to start</p>
          <p class="text-muted text-sm">Arrow keys or WASD to move · Space to pause</p>
        </template>
        <template v-else-if="state === 'paused'">
          <p class="font-pixel text-3xl">Paused</p>
          <p class="text-muted text-sm">Space to resume</p>
        </template>
        <template v-else>
          <p class="font-pixel text-3xl">{{ game.won ? 'You win!' : 'Game over' }}</p>
          <p class="text-muted text-sm">Score: {{ score }} — press an arrow key to play again</p>
        </template>
      </div>
    </div>
  </div>
</template>
