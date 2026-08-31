<script lang="ts" setup>
  const title = 'Gerry Julio — Software Engineer';
  const description =
    'Software Engineer turning ideas into immersive web experiences. Blending thoughtful design with solid engineering.';
  const ogImage = 'https://gerasaka.dev/og-image.png';
  const ogImageAlt = 'Personal website of Gerry Julio';
  const email = 'gerryjulioo@gmail.com';
  const copied = ref(false);
  let copiedTimeout: ReturnType<typeof setTimeout>;

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    copied.value = true;
    clearTimeout(copiedTimeout);
    copiedTimeout = setTimeout(() => (copied.value = false), 2000);
  }

  const socials = [
    {
      label: 'linkedin',
      url: 'https://www.linkedin.com/in/gerryjulio/',
      icon: 'grsk:linkedin',
      color: 'hover:text-[#0077B5] peer-hover:text-[#0077B5]',
    },
    {
      label: 'github',
      url: 'https://github.com/gerasaka/',
      icon: 'grsk:github',
      color: 'hover:text-[#181717] peer-hover:text-[#181717]',
    },
    {
      label: 'bluesky',
      url: 'https://bsky.app/profile/gerasaka.dev',
      icon: 'grsk:bluesky',
      color: 'hover:text-[#1185FE] peer-hover:text-[#1185FE]',
    },
    {
      label: 'x',
      url: 'https://x.com/gerasaka/',
      icon: 'grsk:x-square',
      color: 'hover:text-[#000000] peer-hover:text-[#000000]',
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
  <main class="bg-surface">
    <BrushGradient
      class="fixed top-0 right-0 w-full md:w-200 lg:w-250 translate-x-1/3 -translate-y-1/4"
    />

    <div class="flex flex-col min-h-svh mx-auto p-8 py-20 md:p-20 lg:max-w-5xl relative">
      <Icon name="grsk:logo" class="fade-in text-primary-500" size="56" />

      <div class="body">
        <h1
          class="fade-in text-title font-bold [word-spacing:0.5rem] mt-16 leading-tight inline-block text-transparent bg-clip-text bg-linear-to-r from-foreground from-30% via-primary-800 via-60% to-primary-500 bg-size-[200%_auto]"
        >
          Gerry Julio
        </h1>
        <p class="fade-in text-subtitle">Software Engineer</p>

        <p class="fade-in text-body mt-10">
          I'm a software engineer who cares about simplifying complexity and elevating every aspect
          of the user experience.
        </p>

        <p class="fade-in text-body mt-4">
          I'm currently building quote and order software for global telecommunication companies.
          Previously, I built high-performance payment systems that people rely on every day.
        </p>

        <p class="fade-in text-body mt-4">
          Outside of work, I'm usually side-questing - fumbling through guitar practice, playing
          casual games for fun, or café-hopping with friends. I read whatever sparks my curiosity
          and write when an idea won't leave me alone.
        </p>

        <NuxtLink
          to="/writes"
          class="fade-in group mt-12 inline-flex w-fit items-center gap-1.5 text-muted transition-colors duration-150 hover:text-foreground"
        >
          Writes
          <span
            aria-hidden="true"
            class="transition-transform duration-150 ease-elegant group-hover:translate-x-0.75"
          >
            &rarr;
          </span>
        </NuxtLink>

        <div class="fade-in flex items-center gap-4 mt-8 text-muted min-w-7">
          <span class="flex flex-col items-center">
            <button
              type="button"
              aria-label="Copy email address"
              class="group relative cursor-pointer social-link active:scale-95"
              :data-copied="copied || undefined"
              @click="copyEmail"
            >
              <MailMorphIcon :open="copied" :size="28" />
              <span
                role="status"
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-md bg-foreground text-surface text-xs whitespace-nowrap opacity-0 transition-[opacity,transform] duration-150 group-hover:opacity-100 group-data-copied:opacity-100"
              >
                {{ copied ? 'Copied!' : 'Copy email' }}
              </span>
            </button>
            <span class="reflection" aria-hidden="true">
              <MailMorphIcon :open="copied" :size="28" />
            </span>
          </span>

          <span
            v-for="{ label, url, icon, color } in socials"
            :key="label"
            class="flex flex-col items-center"
          >
            <NuxtLink
              :to="url"
              :aria-label="label"
              :class="color"
              class="peer social-link active:scale-95"
            >
              <Icon :name="icon" size="28" />
            </NuxtLink>
            <span
              :class="color"
              class="reflection transition-colors duration-150 ease-elegant"
              aria-hidden="true"
            >
              <Icon :name="icon" size="28" />
            </span>
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  @reference "~/assets/styles/index.css";

  .fade-in {
    animation: fade-in 500ms var(--ease-elegant) both;
  }

  .reflection {
    display: flex;
    transform: scaleY(-1) perspective(20px) rotateX(-30deg) scaleX(1.2);
    opacity: 0.35;
    filter: blur(0.5px);
    mask-image: linear-gradient(to top, black, transparent 80%);
    pointer-events: none;
  }

  .body > .fade-in {
    animation-delay: calc(sibling-index() * 70ms);
  }

  h1.fade-in {
    animation-name: fade-in, gradient-slide;
    animation-duration: 500ms, 5s;
    animation-timing-function: var(--ease-elegant), ease-in-out;
    animation-fill-mode: both;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(3px);
      filter: blur(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }

  @keyframes gradient-slide {
    from {
      background-position: 0% 50%;
    }
    to {
      background-position: 100% 50%;
    }
  }

  .social-link {
    display: flex;
    align-items: center;
    transition:
      transform 160ms var(--ease-out),
      color 150ms ease;
  }
</style>
