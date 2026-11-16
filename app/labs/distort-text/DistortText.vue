<script lang="ts" setup>
  const text = 'Move closer to bend the letters';
  const RADIUS = 140;

  const root = useTemplateRef<HTMLElement>('root');

  function update(clientX: number, clientY: number) {
    if (!root.value) return;
    for (const char of root.value.querySelectorAll<HTMLElement>('.char')) {
      const rect = char.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const falloff = Math.max(0, 1 - distance / RADIUS);
      // Unit vector from the cursor toward the letter, so letters are pushed away.
      const nx = distance === 0 ? 0 : -dx / distance;
      const ny = distance === 0 ? 0 : -dy / distance;
      char.style.setProperty('--f', falloff.toFixed(3));
      char.style.setProperty('--nx', nx.toFixed(3));
      char.style.setProperty('--ny', ny.toFixed(3));
    }
  }

  function onPointerMove(event: PointerEvent) {
    update(event.clientX, event.clientY);
  }

  function reset() {
    root.value?.querySelectorAll<HTMLElement>('.char').forEach((char) => {
      char.style.setProperty('--f', '0');
    });
  }
</script>

<template>
  <p
    ref="root"
    class="distort-text text-title"
    :aria-label="text"
    @pointermove="onPointerMove"
    @pointerleave="reset"
  >
    <span v-for="(char, i) in text" :key="i" class="char" aria-hidden="true">{{
      char === ' ' ? '\u00A0' : char
    }}</span>
  </p>
</template>

<style scoped>
  @reference "#base/app/assets/styles/index.css";

  .distort-text {
    @apply flex flex-wrap py-12;
  }

  .char {
    --f: 0;
    --nx: 0;
    --ny: 0;

    display: inline-block;
    transform-origin: 50% 100%;
    transform: translate(calc(var(--nx) * var(--f) * 12px), calc(var(--ny) * var(--f) * 12px))
      scale(calc(1 + var(--f) * 0.3)) skewX(calc(var(--nx) * var(--f) * -15deg));
    color: color-mix(in oklab, var(--color-foreground), var(--color-accent) calc(var(--f) * 100%));
    transition: transform var(--transition-duration-fast) var(--ease-snap);
  }

  @media (prefers-reduced-motion: reduce) {
    .char {
      transition: none;
    }
  }
</style>
