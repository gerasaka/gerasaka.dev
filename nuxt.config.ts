import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

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
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/content',
  ],
  routeRules: {
    '/writes': { prerender: true },
    '/games': { prerender: true },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/writes', '/games'],
    },
  },
  css: ['~/assets/styles/index.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light',
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
        styles: ['normal', 'italic'],
      },
      { name: 'Libre Bodoni', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Jersey 15', provider: 'google', weights: [400] },
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
