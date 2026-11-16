<script lang="ts" setup>
  const cards = [
    { title: 'Realtime', body: 'Changes sync across every client in milliseconds.' },
    { title: 'Typed', body: 'End-to-end types from the database to the component.' },
    { title: 'Edge', body: 'Runs close to users on Cloudflare Workers.' },
    { title: 'Themeable', body: 'Light, dark and sepia from one set of tokens.' },
    { title: 'Accessible', body: 'Keyboard, focus and reduced-motion friendly.' },
    { title: 'Tiny', body: 'Two CSS variables and a pointer listener.' },
  ];

  function onPointerMove(event: PointerEvent) {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--y', `${event.clientY - rect.top}px`);
  }
</script>

<template>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="card in cards" :key="card.title" class="spotlight" @pointermove="onPointerMove">
      <div class="spotlight-body">
        <h3 class="text-heading">{{ card.title }}</h3>
        <p class="text-muted mt-2">{{ card.body }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped>
  @reference "#base/app/assets/styles/index.css";

  .spotlight {
    --x: 50%;
    --y: 50%;
    --radius: 14rem;
    --glow: color-mix(in oklab, var(--color-accent) 22%, transparent);

    @apply relative isolate overflow-hidden rounded-md border border-line;
  }

  /* Surface glow */
  .spotlight::before,
  /* Border highlight: same gradient, clipped to the 1px edge */
  .spotlight::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-duration-base) var(--ease-glide);
  }

  .spotlight::before {
    background: radial-gradient(var(--radius) circle at var(--x) var(--y), var(--glow), transparent 70%);
  }

  .spotlight::after {
    padding: 1px;
    background: radial-gradient(
      calc(var(--radius) * 0.8) circle at var(--x) var(--y),
      var(--color-accent),
      transparent 70%
    );
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    z-index: 1;
  }

  .spotlight-body {
    @apply p-5;
  }

  @media (hover: hover) and (pointer: fine) {
    .spotlight:hover::before,
    .spotlight:hover::after {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spotlight::before,
    .spotlight::after {
      transition: none;
    }
  }
</style>
