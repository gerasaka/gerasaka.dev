<script lang="ts" setup>
  /** `pattern` is a 3×3 neighborhood of `#` (alive) and `.` (dead); the center cell is the subject. */
  const { pattern, becomes } = defineProps<{ pattern: string[]; becomes: boolean }>();

  const cells = computed(() => pattern.join('').split(''));
  const CENTER = 4;
</script>

<template>
  <div class="flex shrink-0 items-center gap-2" aria-hidden="true">
    <div class="grid grid-cols-3 gap-0.5 border border-muted/30 p-0.5">
      <span
        v-for="(cell, i) in cells"
        :key="i"
        class="size-3"
        :class="
          cell !== '#' ? 'bg-muted/10' : i === CENTER ? 'bg-primary-500' : 'bg-foreground'
        "
      />
    </div>

    <span class="text-muted text-sm">&rarr;</span>

    <div class="grid grid-cols-3 gap-0.5 border border-muted/30 p-0.5">
      <span
        v-for="(cell, i) in cells"
        :key="i"
        class="size-3"
        :class="
          i === CENTER
            ? becomes
              ? 'bg-primary-500'
              : 'bg-muted/10'
            : cell === '#'
              ? 'bg-foreground/20'
              : 'bg-muted/10'
        "
      />
    </div>
  </div>
</template>
