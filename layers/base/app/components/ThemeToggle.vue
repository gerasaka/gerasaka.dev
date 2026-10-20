<script lang="ts" setup>
  import { useMounted } from '@vueuse/core';

  const ICONS: Record<Theme, string> = {
    light: 'mage:sun-fill',
    dark: 'mage:moon-fill',
    sepia: 'mage:cup-hot-fill',
  };

  const LABELS: Record<Theme, string> = {
    light: 'Light',
    dark: 'Dark',
    sepia: 'Sepia',
  };

  const theme = useTheme();
  const next = computed(() => nextTheme(theme.value));

  const mounted = useMounted();
  const title = computed(() => (mounted.value ? `Theme: ${LABELS[theme.value]}` : 'Theme'));
</script>

<template>
  <button
    type="button"
    class="btn btn-ghost btn-icon fixed top-4 right-4 z-50"
    :title="title"
    @click="theme = next"
  >
    <Icon
      v-for="(icon, name) in ICONS"
      :key="name"
      :name="icon"
      :data-theme-icon="name"
      size="18"
    />
  </button>
</template>

<style scoped>
  [data-theme-icon] {
    display: none;
  }

  :root:not([data-theme]) [data-theme-icon='light'],
  :root[data-theme='light'] [data-theme-icon='light'],
  :root[data-theme='dark'] [data-theme-icon='dark'],
  :root[data-theme='sepia'] [data-theme-icon='sepia'] {
    display: inline-block;
  }
</style>
