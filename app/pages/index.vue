<script lang="ts" setup>
  import { oneko } from '~/assets/misc/oneko';
  import '~/assets/misc/ascii-art';

  onMounted(() => oneko());

  useSeoMeta({
    robots: 'index, follow',
    title: 'Gerry Julio',
    description:
      'Software Engineer that currently on a mission to create immersive experiences through the web',

    // Facebook Meta
    ogUrl: 'https://gerasaka.dev/',
    ogType: 'website',
    ogTitle: 'Gerry Julio',
    ogDescription:
      'Software Engineer that currently on a mission to create immersive experiences through the web',
    ogImage: 'https://gerasaka.dev/og-image.png',
    ogImageAlt: 'Personal website of Gerry Julio',

    // Twitter meta
    twitterCard: 'summary_large_image',
    twitterTitle: 'Gerry Julio',
    twitterDescription:
      'Software Engineer that currently on a mission to create immersive experiences through the web',
    twitterImage: 'https://gerasaka.dev/og-image.png',
    twitterImageAlt: 'Personal website of Gerry Julio',
  });
</script>

<template>
  <div class="bg-background h-svh">
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

    <div
      class="flex flex-col justify-center h-5/6 mx-auto px-8 md:px-20 lg:px-32 lg:max-w-5xl relative"
    >
      <Icon name="grsk:logo" class="w-16 h-16" />

      <div>
        <h1 class="heading">Gerry Julio</h1>
        <p class="text-light font-light text-lg md:text-xl mt-2">Frontend Engineer</p>

        <p class="text-dark text-base mt-10">
          I craft user-centric web experiences where form follows function, and focus on delivering
          innovative solutions.
        </p>

        <p class="text-dark text-base mt-4">
          Currently at
          <NuxtLink
            to="https://www.doku.com/en-US"
            target="_blank"
            class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-dark to-[#961912] transition-colors duration-500 hover:text-[#E1251B]"
          >
            DOKU
          </NuxtLink>
          , one of Indonesia's leading payment gateway companies, I build high-performance
          applications that transform payment processes into seamless user experiences, prioritizing
          security and maintainability.
        </p>
      </div>

      <div class="flex items-center gap-4 mt-8 text-light">
        <NuxtLink to="mailto:gerryjulioo@gmail.com">
          <Icon
            name="ph:envelope-fill"
            class="transition-colors duration-300 w-6 h-6 md:w-7 md:h-7 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://www.linkedin.com/in/gerryjulio/">
          <Icon
            name="simple-icons:linkedin"
            class="transition-colors duration-300 w-5 h-5 md:w-6 md:h-6 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://github.com/gerasaka/">
          <Icon
            name="simple-icons:github"
            class="transition-colors duration-300 w-5 h-5 md:w-6 md:h-6 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://x.com/gerasaka/">
          <Icon
            name="simple-icons:x"
            class="transition-colors duration-300 w-5 h-5 md:w-6 md:h-6 hover:text-dark"
          />
        </NuxtLink>
        <NuxtLink to="https://leetcode.com/u/gerasaka/">
          <Icon
            name="simple-icons:leetcode"
            class="transition-colors duration-300 w-5 h-5 md:w-6 md:h-6 hover:text-dark"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .heading {
    @apply font-serif font-extrabold text-5xl leading-[4rem] inline-block mt-12 md:mt-20 text-transparent bg-clip-text bg-gradient-to-r from-dark from-30% via-primary-800 via-60% to-primary-500;
  }
</style>
