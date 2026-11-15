<script lang="ts" setup generic="T extends string | boolean">
  const { label, options } = defineProps<{
    label: string;
    options: { value: T; label: string }[];
  }>();

  /** Undefined leaves the choice to the seed. */
  const model = defineModel<T | undefined>();
</script>

<template>
  <fieldset class="flex flex-col gap-2">
    <legend class="text-label mb-2">{{ label }}</legend>
    <div class="flex flex-wrap gap-1.5">
      <button
        type="button"
        class="chip chip-sm"
        :aria-pressed="model === undefined"
        @click="model = undefined"
      >
        Auto
      </button>
      <button
        v-for="option in options"
        :key="String(option.value)"
        type="button"
        class="chip chip-sm"
        :aria-pressed="model === option.value"
        @click="model = option.value"
      >
        {{ option.label }}
      </button>
    </div>
  </fieldset>
</template>
