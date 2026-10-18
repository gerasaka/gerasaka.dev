<script lang="ts" setup>
  const { copy, copied } = useClipboard({ copiedDuring: 2000 });

  const title = 'Gerry Julio — Software Engineer';
  const description =
    'Software Engineer turning ideas into immersive web experiences. Blending thoughtful design with solid engineering.';
  const ogImage = 'https://gerasaka.dev/og-image.png';
  const ogImageAlt = 'Personal website of Gerry Julio';
  const email = 'gerryjulioo@gmail.com';

  const socials = [
    {
      label: 'linkedin',
      url: 'https://www.linkedin.com/in/gerryjulio/',
      icon: 'grsk:linkedin',
      brand: '#0077B5',
    },
    {
      label: 'github',
      url: 'https://github.com/gerasaka/',
      icon: 'grsk:github',
    },
    {
      label: 'bluesky',
      url: 'https://bsky.app/profile/gerasaka.dev',
      icon: 'grsk:bluesky',
      brand: '#1185FE',
    },
    {
      label: 'x',
      url: 'https://x.com/gerasaka/',
      icon: 'grsk:x-square',
    },
  ];

  const sections = [
    { label: 'Writes', url: '/writes' },
    { label: 'Games', url: '/games' },
    { label: 'Tools', url: 'https://tools.gerasaka.dev' },
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
  <main class="min-h-svh">
    <BrushGradient
      class="fixed top-0 right-0 w-full md:w-200 lg:w-250 translate-x-1/3 -translate-y-1/4"
    />

    <div class="container-main page relative">
      <FadeIn>
        <FadeItem>
          <Icon name="grsk:logo" class="text-accent" size="56" />
        </FadeItem>

        <div>
          <FadeItem>
            <h1
              class="text-title font-semibold mt-16 inline-block text-transparent bg-clip-text bg-linear-to-r from-foreground from-60% via-accent-strong via-90% to-accent"
            >
              Gerry Julio
            </h1>
          </FadeItem>
          <FadeItem>
            <p class="text-subtitle">Software Engineer</p>
          </FadeItem>

          <FadeItem>
            <p class="text-body mt-10">
              I'm a software engineer who cares about simplifying complexity and elevating every
              aspect of the user experience.
            </p>
          </FadeItem>

          <FadeItem>
            <p class="text-body mt-4">
              I'm currently building quote and order software for global telecommunication
              companies. Previously, I built high-performance payment systems that people rely on
              every day.
            </p>
          </FadeItem>

          <FadeItem>
            <p class="text-body mt-4">
              Outside of work, I'm usually side-questing - fumbling through guitar practice, playing
              casual games for fun, or exploring new places with friends. I read whatever sparks my
              curiosity and write when an idea won't leave me alone.
            </p>
          </FadeItem>

          <FadeItem class="mt-12">
            <div class="flex gap-4">
              <NuxtLink
                v-for="section in sections"
                :key="section.url"
                :to="section.url"
                class="btn btn-quiet"
              >
                {{ section.label }} <span aria-hidden="true">&rarr;</span>
              </NuxtLink>
            </div>
          </FadeItem>

          <FadeItem>
            <div class="flex items-center gap-4 mt-8 text-muted">
              <span class="social">
                <button
                  type="button"
                  aria-label="Copy email address"
                  class="social-link tooltip"
                  :data-tooltip="copied ? 'Copied!' : 'Copy email'"
                  :data-tooltip-open="copied || undefined"
                  @click="copy(email)"
                >
                  <MailMorphIcon :open="copied" :size="28" />
                </button>
                <span class="reflection" aria-hidden="true">
                  <MailMorphIcon :open="copied" :size="28" />
                </span>
                <span role="status" class="sr-only">{{ copied ? 'Email copied' : '' }}</span>
              </span>

              <span
                v-for="{ label, url, icon, brand } in socials"
                :key="label"
                class="social"
                :style="brand ? { '--brand': brand } : undefined"
              >
                <NuxtLink :to="url" :aria-label="label" class="social-link">
                  <Icon :name="icon" size="28" />
                </NuxtLink>
                <span class="reflection" aria-hidden="true">
                  <Icon :name="icon" size="28" />
                </span>
              </span>
            </div>
          </FadeItem>
        </div>
      </FadeIn>
    </div>
  </main>
</template>

<style scoped>
  @reference "#base/app/assets/styles/index.css";

  h1 {
    padding-bottom: 0.15em;
    word-spacing: 0.15em;
    background-size: 200% auto;
  }

  h1.fade-in {
    animation-name: fade-in, gradient-slide;
    animation-duration: var(--transition-duration-slow), 5s;
    animation-timing-function: var(--ease-glide), var(--ease-sweep);
    animation-fill-mode: both;
  }

  @keyframes gradient-slide {
    from {
      background-position: 0% 50%;
    }
    to {
      background-position: 100% 50%;
    }
  }

  .social {
    --brand: var(--color-foreground);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .social-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition-property: scale, color;
    transition-duration: var(--transition-duration-fast);
    transition-timing-function: var(--ease-glide);

    &:active {
      scale: 0.95;
    }
  }

  .reflection {
    display: flex;
    transform: scaleY(-1) perspective(20px) rotateX(-30deg) scaleX(1.2);
    opacity: 0.35;
    filter: blur(0.5px);
    mask-image: linear-gradient(to top, black, transparent 80%);
    pointer-events: none;
    transition: color var(--transition-duration-fast) var(--ease-glide);
  }

  .social:has(.social-link:hover) :is(.social-link, .reflection) {
    color: var(--brand);
  }
</style>
