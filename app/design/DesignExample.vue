<script lang="ts" setup>
  const { name, note = undefined } = defineProps<{ name: string; note?: string }>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="font-mono text-sm text-muted">{{ name }}</p>
    <slot />
    <p v-if="note" class="text-caption max-w-prose">{{ note }}</p>
  </div>
</template>
