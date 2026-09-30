<script lang="ts" setup>
  import { createBoard, population, step } from './life';

  type GameState = 'idle' | 'playing' | 'paused' | 'over';

  const GRID = 40;
  const DENSITY = 0.3;
  const TICK_MS = 500;
  const BOARD_PX = 448; // matches max-w-md (28rem) so canvas maps 1:1 to CSS pixels

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
  const state = ref<GameState>('idle');
  const generation = ref(0);
  const alive = ref(0);

  let cells = createBoard(GRID, GRID, DENSITY);
  let buffer = new Uint8Array(cells.length);
  const colors = { cell: '#000000', grid: '#8a8a8a' };
  let timer: ReturnType<typeof setInterval> | null = null;

  function tick() {
    step(cells, buffer, GRID, GRID);
    [cells, buffer] = [buffer, cells];
    generation.value++;
    alive.value = population(cells);
    if (alive.value === 0) state.value = 'over';
    draw();
  }

  function draw() {
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cell = (BOARD_PX * dpr) / GRID;
    // snap cell edges to device pixels; fractional cell sizes otherwise leave seams between neighbors
    const edge = (n: number) => Math.round(n * cell);
    const size = ctx.canvas.width;
    const line = Math.max(1, Math.round(dpr));
    ctx.clearRect(0, 0, size, size);

    // cells are inset by one line width so the grid stays visible between live neighbors
    ctx.fillStyle = colors.cell;
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i]) continue;
      const x = i % GRID;
      const y = Math.floor(i / GRID);
      ctx.fillRect(
        edge(x) + line,
        edge(y) + line,
        edge(x + 1) - edge(x) - line,
        edge(y + 1) - edge(y) - line,
      );
    }

    // one path so crossings aren't painted twice, which would darken them under globalAlpha
    ctx.beginPath();
    for (let k = 0; k <= GRID; k++) {
      const at = Math.min(edge(k), size - line);
      ctx.rect(at, 0, line, size);
      ctx.rect(0, at, size, line);
    }
    ctx.fillStyle = colors.grid;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function startLoop() {
    stopLoop();
    timer = setInterval(tick, TICK_MS);
  }

  function stopLoop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function reseed() {
    cells = createBoard(GRID, GRID, DENSITY);
    generation.value = 0;
    alive.value = population(cells);
    draw();
  }

  function restart() {
    reseed();
    state.value = 'playing';
  }

  function togglePause() {
    if (state.value === 'playing') state.value = 'paused';
    else if (state.value === 'paused') state.value = 'playing';
  }

  onMounted(() => {
    const styles = getComputedStyle(document.documentElement);
    colors.cell = styles.getPropertyValue('--color-foreground').trim() || colors.cell;
    colors.grid = styles.getPropertyValue('--color-muted').trim() || colors.grid;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.value) {
      canvas.value.width = BOARD_PX * dpr;
      canvas.value.height = BOARD_PX * dpr;
    }

    reseed();
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
</script>

<template>
  <div class="w-full max-w-md">
    <div class="flex items-baseline justify-between">
      <p class="text-muted text-sm">Generation</p>
      <p class="font-pixel text-3xl leading-none">{{ generation }}</p>
    </div>

    <div
      class="relative mt-3 aspect-square w-full"
      :class="{ 'cursor-pointer': state === 'idle' }"
      @click="state === 'idle' && (state = 'playing')"
    >
      <canvas
        ref="canvas"
        class="block h-full w-full"
        role="img"
        aria-label="Conway's Game of Life board"
      />

      <div
        v-if="state !== 'playing'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/80 text-center"
      >
        <p v-if="state === 'idle'" class="font-pixel text-2xl">Click to start</p>
        <template v-else-if="state === 'paused'">
          <p class="font-pixel text-3xl">Paused</p>
          <p class="text-muted text-sm">Press Resume to continue</p>
        </template>
        <template v-else>
          <p class="font-pixel text-3xl">All cells died</p>
          <p class="text-muted text-sm">Lasted {{ generation }} generations</p>
          <button
            type="button"
            class="mt-2 cursor-pointer italic text-muted transition-colors duration-150 hover:text-foreground"
            @click="restart"
          >
            Restart
          </button>
        </template>
      </div>
    </div>

    <div class="mt-4 flex items-baseline gap-6">
      <button
        type="button"
        class="cursor-pointer italic text-muted transition-colors duration-150 hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:text-muted"
        :disabled="state === 'idle' || state === 'over'"
        @click="togglePause"
      >
        {{ state === 'paused' ? 'Resume' : 'Pause' }}
      </button>
      <button
        type="button"
        class="cursor-pointer italic text-muted transition-colors duration-150 hover:text-foreground"
        @click="restart"
      >
        Restart
      </button>
      <p class="ml-auto text-muted text-sm tabular-nums">{{ alive }} alive</p>
    </div>
  </div>
</template>
