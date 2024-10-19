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
  ],
  tailwindcss: {
    cssPath: ['~/assets/styles/index.scss', { injectPosition: 'first' }],
    configPath: '~~/tailwind.config',
  },
});
