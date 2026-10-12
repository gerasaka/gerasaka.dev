<script lang="ts" setup>
  import { provide } from 'vue';

  /*
   * Staggers <FadeItem> children on the first page load. `max` caps the delay
   * so long lists don't keep the last items hidden; stagger is decorative.
   */
  const { step = 60, base = 0, max = 480 } = defineProps<{ step?: number; base?: number; max?: number }>();

  let index = 0;

  provide(FadeInKey, {
    next: () => Math.min(base + index++ * step, max),
  });
</script>

<template>
  <slot />
</template>
