<script lang="ts" setup>
  useHead({
    link: [{ rel: 'icon', href: import.meta.dev ? '/favicon.ico' : '/favicon.ico' }],
    script: [{ src: '/theme-init.js' }],
  });
</script>

<template>
  <div>
    <NuxtPage />
    <ThemeToggle />
    <Toaster />
  </div>
</template>
