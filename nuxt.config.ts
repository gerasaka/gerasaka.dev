import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-30',
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    sharedPrerenderData: false,
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
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/content'],
  routeRules: {
    '/writes': { prerender: true },
    '/games': { prerender: true },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/writes', '/games', '/design'],
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },
  image: {
    dir: 'assets/images',
  },
});
