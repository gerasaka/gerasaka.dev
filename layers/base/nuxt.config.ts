import { createResolver } from '@nuxt/kit';
import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  modules: ['@nuxt/fonts', '@nuxt/icon', '@vueuse/nuxt'],
  alias: {
    '#base': resolve('./'),
  },
  css: [resolve('./app/assets/styles/index.css')],
  vite: {
    plugins: [tailwindcss()],
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
      { name: 'Plus Jakarta Sans', provider: 'google', weights: [200, 400, 500, 600, 700] },
      { name: 'Libre Bodoni', provider: 'google', weights: [400, 600] },
      { name: 'Jersey 15', provider: 'google', weights: [400] },
      { name: 'Cascadia Code', provider: 'google', weights: [400, 700] },
    ],
  },
  icon: {
    customCollections: [
      {
        prefix: 'grsk',
        dir: resolve('./app/assets/icons'),
      },
    ],
  },
});
