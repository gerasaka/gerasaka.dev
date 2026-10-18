<script lang="ts" setup>
  /** `pattern` is a 3×3 neighborhood of `#` (alive) and `.` (dead); the center cell is the subject. */
  const { pattern, becomes } = defineProps<{ pattern: string[]; becomes: boolean }>();

  const cells = computed(() => pattern.join('').split(''));
  const CENTER = 4;
</script>

<template>
  <div class="flex shrink-0 items-center gap-2" aria-hidden="true">
    <div class="grid grid-cols-3 gap-0.5 border border-line p-0.5">
      <span
        v-for="(cell, i) in cells"
        :key="i"
        class="size-3"
        :class="
          cell !== '#' ? 'bg-surface-subtle' : i === CENTER ? 'bg-accent' : 'bg-foreground'
        "
      />
    </div>

    <span class="text-caption">&rarr;</span>

    <div class="grid grid-cols-3 gap-0.5 border border-line p-0.5">
      <span
        v-for="(cell, i) in cells"
        :key="i"
        class="size-3"
        :class="
          i === CENTER
            ? becomes
              ? 'bg-accent'
              : 'bg-surface-subtle'
            : cell === '#'
              ? 'bg-foreground/20'
              : 'bg-surface-subtle'
        "
      />
    </div>
  </div>
</template>
