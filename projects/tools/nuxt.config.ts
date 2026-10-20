import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['../../layers/base'],
  appConfig: {
    site: {
      url: 'https://tools.gerasaka.dev',
    },
  },
  compatibilityDate: '2026-08-30',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
});
