<script lang="ts" setup>
  const { type = 'note' } = defineProps<{ type?: 'note' | 'tip' | 'warning' }>();

  const LABELS = { note: 'Note', tip: 'Tip', warning: 'Warning' } as const;
</script>

<template>
  <aside
    class="not-prose my-6 rounded-md border border-line bg-surface-subtle px-4 py-3"
    :data-type="type"
  >
    <p class="text-overline">{{ LABELS[type] }}</p>
    <div class="mt-1 text-foreground-soft [&>p]:my-0">
      <slot />
    </div>
  </aside>
</template>
