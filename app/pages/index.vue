<script lang="ts" setup>
  import { oneko } from '~/assets/misc/oneko';
  import '~/assets/misc/ascii-art';

  onMounted(() => oneko());
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
      class="absolute top-0 right-0 z-10"
    />

    <div
      class="flex flex-col justify-center h-5/6 mx-auto px-8 md:px-20 lg:px-32 lg:max-w-5xl relative z-20"
    >
      <Icon name="grsk:logo" class="w-20 h-20" />

      <div>
        <h1 class="heading">Gerry Julio</h1>
        <p class="text-light text-2xl mt-2">Frontend Engineer</p>
      </div>

      <div class="flex items-center gap-4 mt-8 text-light">
        <NuxtLink to="mailto:gerryjulioo@gmail.com">
          <Icon
            name="ph:envelope-fill"
            class="transition-colors duration-300 w-7 h-7 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://www.linkedin.com/in/gerryjulio/">
          <Icon
            name="simple-icons:linkedin"
            class="transition-colors duration-300 w-6 h-6 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://github.com/gerasaka/">
          <Icon
            name="simple-icons:github"
            class="transition-colors duration-300 w-6 h-6 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://leetcode.com/u/gerasaka/">
          <Icon
            name="simple-icons:leetcode"
            class="transition-colors duration-300 w-6 h-6 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://x.com/gerasaka/">
          <Icon
            name="simple-icons:x"
            class="transition-colors duration-300 w-6 h-6 hover:text-dark"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .heading {
    @apply font-serif font-extrabold text-6xl leading-[5rem] inline-block mt-12 md:mt-20 text-transparent bg-clip-text bg-gradient-to-r from-dark from-30% via-primary-800 via-60% to-primary-500;
  }
</style>
