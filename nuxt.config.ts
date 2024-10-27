import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    // normalizeComponentNames: false,
    defaults: {
      useAsyncData: {
        deep: true,
      },
    },
  },
  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false,
    },
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxthub/core',
  ],
  fonts: {
    families: [
      { name: 'Lato', provider: 'google', weights: [100, 300, 400, 700, 900] },
      { name: 'Playfair Display', provider: 'google', weights: [400, 500, 600, 700, 800, 900] },
    ],
  },
  tailwindcss: {
    cssPath: ['~/assets/styles/index.scss', { injectPosition: 'first' }],
    configPath: '~~/tailwind.config',
  },
  image: {
    dir: 'assets/images',
  },
  icon: {
    customCollections: [
      {
        prefix: 'grsk',
        dir: './app/assets/icons',
      },
    ],
  },
});
