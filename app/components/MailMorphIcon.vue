<script setup lang="ts">
  const props = withDefaults(defineProps<{ open?: boolean; size?: number | string }>(), {
    open: false,
    size: 28,
  });

  const FLAP_CLOSED =
    'M6.75 4.25a3.25 3.25 0 0 0-3.23 2.89l6.85 3.93a3.26 3.26 0 0 0 3.26 0l6.85-3.93a3.26 3.26 0 0 0-3.23-2.89l-10.5 0a0.01 0.01 0 0 0 0 0z';
  const FLAP_OPEN =
    'M13.58 11.91a3.3 3.3 0 0 1-3.25 0l-6.53-3.78a3.25 3.25 0 0 1 1.36-1.41l5.25-2.84a3.2 3.2 0 0 1 3.09 0l5.25 2.84a3.22 3.22 0 0 1 1.4 1.5z';

  const flapPath = computed(() => (props.open ? FLAP_OPEN : FLAP_CLOSED));
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      class="body-path"
      d="M6.75 2.75h10.5A4.76 4.76 0 0 1 22 7.5v9a4.76 4.76 0 0 1-4.75 4.75H6.75A4.75 4.75 0 0 1 2 16.5v-9a4.75 4.75 0 0 1 4.75-4.75z"
      :opacity="open ? 0 : 0.3"
    />
    <path
      fill="currentColor"
      class="body-path"
      d="m21.84 8.561l-.09-.36a5 5 0 0 0-.47-1a4.75 4.75 0 0 0-1.82-1.74l-5.25-2.84a4.8 4.8 0 0 0-4.51 0l-5.25 2.84a4.75 4.75 0 0 0-1.82 1.74a4.3 4.3 0 0 0-.46 1v.14A4.6 4.6 0 0 0 2 9.571v7.62a4.76 4.76 0 0 0 4.75 4.75h10.5a4.75 4.75 0 0 0 4.75-4.75v-7.63a4.8 4.8 0 0 0-.16-1z"
      :opacity="open ? 0.3 : 0"
    />
    <path fill="currentColor" class="morph-path" :d="flapPath" />
  </svg>
</template>

<style scoped>
  .morph-path {
    transition: d 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
  }

  .body-path {
    transition: opacity 0.35s ease;
  }
</style>
