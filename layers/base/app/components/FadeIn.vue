<script lang="ts" setup>
  import { provide } from 'vue';

  const { step = 70, base = 0 } = defineProps<{ step?: number; base?: number }>();

  let index = 0;

  provide(FadeInKey, {
    next: () => base + index++ * step,
  });
</script>

<template>
  <slot />
</template>
