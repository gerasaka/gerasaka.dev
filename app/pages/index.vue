<script lang="ts" setup>
  import { useFavicon } from '@vueuse/core';

  useFavicon().value = '/favicon-light.ico';
</script>

<template>
  <div class="relative">
    <NuxtImg src="/lg.png" class="absolute top-0 right-0 -z-10" role="presentation" />

    <Icon name="grsk:logo" />

    <h1 class="font-dark font-serif font-extrabold text-6xl">Gerry Julio</h1>
    <p class="font-light text-2xl">Frontend Engineer</p>

    <div class="flex gap-4">
      <Icon name="ph:envelope-fill" />
      <Icon name="simple-icons:leetcode" />
      <Icon name="simple-icons:linkedin" />
      <Icon name="simple-icons:github" />
      <Icon name="simple-icons:x" />
    </div>
  </div>
</template>
