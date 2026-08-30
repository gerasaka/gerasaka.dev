import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
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
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/content',
  ],
  nitro: {
    preset: 'cloudflare-module',
  },
  css: ['~/assets/styles/index.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
        },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  fonts: {
    families: [
      {
        name: 'Plus Jakarta Sans',
        provider: 'google',
        weights: [200, 300, 400, 500, 600, 700, 800],
      },
      { name: 'Libre Bodoni', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Cascadia Code', provider: 'google', weights: [400, 700] },
    ],
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
