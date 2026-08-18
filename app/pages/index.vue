<script lang="ts" setup>
  const title = 'Gerry Julio — Software Engineer';
  const description =
    'Software Engineer turning ideas into immersive web experiences. Blending thoughtful design with solid engineering.';
  const ogImage = 'https://gerasaka.dev/og-image.png';
  const ogImageAlt = 'Personal website of Gerry Julio';
  const socials = [
    {
      label: 'email',
      url: 'mailto:gerryjulioo@gmail.com',
      icon: 'grsk:mail',
      color: 'hover:text-[#909692]',
    },
    {
      label: 'linkedin',
      url: 'https://www.linkedin.com/in/gerryjulio/',
      icon: 'grsk:linkedin',
      color: 'hover:text-[#0077B5]',
    },
    {
      label: 'github',
      url: 'https://github.com/gerasaka/',
      icon: 'grsk:github',
      color: 'hover:text-[#181717]',
    },
    {
      label: 'bluesky',
      url: 'https://bsky.app/profile/gerasaka.dev',
      icon: 'grsk:bluesky',
      color: 'hover:text-[#1185FE]',
    },
    {
      label: 'x',
      url: 'https://x.com/gerasaka/',
      icon: 'grsk:x-square',
      color: 'hover:text-[#000000]',
    },
  ];

  useSeoMeta({
    robots: 'index, follow',
    title,
    description,

    // Open Graph
    ogUrl: 'https://gerasaka.dev/',
    ogType: 'website',
    ogSiteName: 'Gerry Julio',
    ogLocale: 'en_US',
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt,

    // Twitter
    twitterCard: 'summary_large_image',
    twitterSite: '@gerasaka',
    twitterCreator: '@gerasaka',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    twitterImageAlt: ogImageAlt,
  });

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Gerry Julio',
          url: 'https://gerasaka.dev/',
          jobTitle: 'Software Engineer',
          description,
          sameAs: socials.filter(({ url }) => url.startsWith('https')).map(({ url }) => url),
        }),
      },
    ],
  });
</script>

<template>
  <main class="bg-surface max-h-screen">
    <picture class="fixed top-0 right-0">
      <source media="(max-width: 640px)" type="image/avif" srcset="~/assets/images/sm.avif" />
      <source type="image/avif" srcset="~/assets/images/lg.avif" />

      <img
        src="~/assets/images/lg.avif"
        alt=""
        role="presentation"
        fetchpriority="high"
        class="w-full md:w-200 lg:w-250"
      />
    </picture>

    <div class="flex flex-col min-h-svh mx-auto p-8 py-20 md:p-20 lg:px-32 lg:max-w-5xl relative">
      <Icon name="grsk:logo" class="text-primary-500" size="56" />

      <div>
        <h1
          class="text-title mt-8 leading-tight inline-block text-transparent bg-clip-text bg-linear-to-r from-foreground from-30% via-primary-800 via-60% to-primary-500"
        >
          Gerry Julio
        </h1>
        <p class="text-subtitle">Software Engineer</p>

        <p class="text-body mt-10">
          I'm a software engineer who cares about simplifying complexity and elevating every aspect
          of the user experience.
        </p>

        <p class="text-body mt-4">
          I'm currently building quote and order software for global telecommunication companies.
          Previously, I built high-performance payment systems that people rely on every day.
        </p>

        <p class="text-body mt-4">
          Outside of work, I'm usually side-questing - fumbling through guitar practice, playing
          casual games for fun, or café-hopping with friends. I read most days and write when an
          idea won't leave me alone.
        </p>
      </div>

      <div class="flex items-center gap-4 mt-8 text-muted">
        <NuxtLink
          v-for="{ label, url, icon, color } in socials"
          :key="label"
          :to="url"
          :aria-label="label"
          :class="color"
        >
          <Icon :name="icon" size="28" class="transition-colors duration-300" />
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
