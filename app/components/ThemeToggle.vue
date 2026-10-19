<script lang="ts" setup>
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
</script>

<template>
  <button
    type="button"
    class="btn btn-ghost btn-icon fixed top-4 right-4 z-50"
    :aria-label="`Theme: ${LABELS[theme]}. Switch to ${LABELS[next]}.`"
    :title="`Theme: ${LABELS[theme]}`"
    @click="theme = next"
  >
    <Icon :name="ICONS[theme]" size="18" />
  </button>
</template>
