<template>
  <div
    class="reading-progress-bar pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-0.5 origin-left scale-x-0 bg-accent supports-[animation-timeline:view()]:block"
    aria-hidden="true"
  />
</template>

<style>
  .reading-progress-bar {
    animation: reading-progress linear both;
    animation-timeline: --article;
    animation-range: contain;
  }

  @keyframes reading-progress {
    to {
      scale: 1;
    }
  }
</style>
