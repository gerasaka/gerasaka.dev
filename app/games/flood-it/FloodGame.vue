<script lang="ts" setup>
  import { createBoard, flood, isSolved, type Board } from './flood';

  type GameState = 'playing' | 'won' | 'lost';

  const SIZE = 14;
  const MAX_MOVES = 25;
  const BOARD_PX = 448; // matches max-w-md (28rem) so canvas maps 1:1 to CSS pixels
  const PALETTE = [
    { name: 'Blue', hex: '#4285d5' },
    { name: 'Coral', hex: '#e07a5f' },
    { name: 'Mustard', hex: '#e9c46a' },
    { name: 'Sage', hex: '#81b29a' },
    { name: 'Plum', hex: '#9b72aa' },
    { name: 'Navy', hex: '#3d405b' },
  ];

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
  const state = ref<GameState>('playing');
  const moves = ref(0);
  // created on mount: a random board rendered on the server wouldn't match the client's
  const board = shallowRef<Board | null>(null);
  const current = computed(() => board.value?.[0]);

  function draw() {
    const ctx = canvas.value?.getContext('2d');
    if (!ctx || !board.value) return;

    const cell = ctx.canvas.width / SIZE;
    for (let i = 0; i < board.value.length; i++) {
      ctx.fillStyle = PALETTE[board.value[i]!]!.hex;
      ctx.fillRect((i % SIZE) * cell, Math.floor(i / SIZE) * cell, cell, cell);
    }
  }

  function pick(color: number) {
    if (state.value !== 'playing' || !board.value) return;
    const next = flood(board.value, SIZE, color);
    if (next === board.value) return;

    board.value = next;
    moves.value++;
    if (isSolved(next)) state.value = 'won';
    else if (moves.value >= MAX_MOVES) state.value = 'lost';
  }

  function restart() {
    board.value = createBoard(SIZE, PALETTE.length);
    moves.value = 0;
    state.value = 'playing';
  }

  onMounted(() => {
    const dpr = window.devicePixelRatio || 1;
    if (canvas.value) {
      canvas.value.width = BOARD_PX * dpr;
      canvas.value.height = BOARD_PX * dpr;
    }

    restart();
  });

  watch(board, draw);
</script>

<template>
  <div class="w-full max-w-md">
    <div class="flex items-baseline justify-between">
      <p class="text-muted text-sm">Moves</p>
      <p class="font-pixel text-3xl leading-none" aria-live="polite">
        {{ moves }}<span class="text-muted"> / {{ MAX_MOVES }}</span>
      </p>
    </div>

    <div class="relative mt-3 aspect-square w-full">
      <canvas ref="canvas" class="block h-full w-full" role="img" aria-label="Flood-It board" />

      <div
        v-if="state !== 'playing'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/80 text-center"
      >
        <p class="font-pixel text-3xl">{{ state === 'won' ? 'Flooded!' : 'Out of moves' }}</p>
        <p class="text-muted text-sm">
          {{ state === 'won' ? `Solved in ${moves} moves` : 'The board beat you this time' }}
        </p>
        <button
          type="button"
          class="mt-2 cursor-pointer italic text-muted transition-colors duration-150 hover:text-foreground"
          @click="restart"
        >
          New game
        </button>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-3">
      <button
        v-for="(color, index) in PALETTE"
        :key="color.name"
        type="button"
        :aria-label="color.name"
        :disabled="state !== 'playing' || index === current"
        class="size-9 cursor-pointer transition-[transform,opacity] duration-150 ease-out active:scale-90 disabled:cursor-default disabled:opacity-30"
        :style="{ backgroundColor: color.hex }"
        @click="pick(index)"
      />
      <button
        type="button"
        class="ml-auto cursor-pointer italic text-muted transition-colors duration-150 hover:text-foreground"
        @click="restart"
      >
        New game
      </button>
    </div>
  </div>
</template>
