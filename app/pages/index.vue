<script lang="ts" setup>
  import { useFavicon } from '@vueuse/core';
  import '~/assets/misc/oneko';
  import '~/assets/misc/ascii-art';

  useFavicon().value = '/favicon-light.ico';
</script>

<template>
  <div class="relative bg-base h-svh">
    <img
      srcset="
        ~/assets/images/sm.png  640w,
        ~/assets/images/md.png  768w,
        ~/assets/images/lg.png 1024w
      "
      sizes="(max-width: 640px) 100vw, (max-width: 1023px) 800px, 1000px"
      src="~/assets/images/sm.png"
      role="presentation"
      class="absolute top-0 right-0"
    />

    <div class="flex flex-col justify-center h-5/6 mx-auto px-8 md:px-20 lg:px-32 lg:max-w-5xl">
      <Icon name="grsk:logo" class="w-20 h-20" />

      <h1 class="text-dark font-serif font-extrabold text-6xl mt-16 md:mt-24">Gerry Julio</h1>
      <p class="text-light text-2xl mt-4">Frontend Engineer</p>

      <div class="flex items-center gap-4 mt-8 md:mt-12 text-dark">
        <NuxtLink to="https://github.com/gerasaka/">
          <Icon name="simple-icons:github" class="w-6 h-6 hover:text-primary-500" />
        </NuxtLink>
        <NuxtLink to="https://www.linkedin.com/in/gerryjulio/">
          <Icon name="simple-icons:linkedin" class="w-6 h-6 hover:text-primary-500" />
        </NuxtLink>
        <NuxtLink to="https://leetcode.com/u/gerasaka/">
          <Icon name="simple-icons:leetcode" class="w-6 h-6 hover:text-primary-500" />
        </NuxtLink>
        <NuxtLink to="https://x.com/gerasaka/">
          <Icon name="simple-icons:x" class="w-6 h-6 hover:text-primary-500" />
        </NuxtLink>
        <NuxtLink to="mailto:gerryjulioo@gmail.com">
          <Icon name="ph:envelope-fill" class="w-7 h-7 hover:text-primary-500" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
