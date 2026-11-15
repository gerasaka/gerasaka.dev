<script lang="ts" setup>
  useThemeFavicon();

  const route = useRoute();
  const hasRail = computed(() => route.meta.layout === 'section');
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ThemeToggle v-if="!hasRail" class="fixed top-4 right-4 z-50" />
    <Toaster />
  </div>
</template>
