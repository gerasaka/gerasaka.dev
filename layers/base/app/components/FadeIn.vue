<script lang="ts" setup>
  import { provide } from 'vue';

  const {
    step = 70,
    base = 0,
    max = 490,
  } = defineProps<{ step?: number; base?: number; max?: number }>();

  let index = 0;

  provide(FadeInKey, {
    next: () => Math.min(base + index++ * step, max),
  });
</script>

<template>
  <slot />
</template>
