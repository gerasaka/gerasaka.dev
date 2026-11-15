<script lang="ts" setup>
  import type { Tool } from '~/components/ToolCard.vue';

  definePageMeta({ layout: 'section', section: 'tools' });

  const tools: Tool[] = [
    {
      name: 'XML Formatter',
      description: 'Unescape and prettify XML copied from logs. Runs entirely in your browser.',
      link: { type: 'internal', to: '/xml-formatter' },
      kind: 'Web',
      stack: ['Vue'],
    },
    {
      name: 'Cover Generator',
      description:
        'Blog post cover generator, for personal use. Exports a JPEG for the page and social previews.',
      link: { type: 'internal', to: '/cover-generator' },
      kind: 'Web',
      stack: ['Vue', 'SVG'],
    },
  ];

  const title = 'Tools';
  const description = 'Tools I built to make my everyday tasks easier.';

  usePageSeo({ title, description });
  useSeoMeta({ robots: 'index, follow' });
</script>

<template>
  <main class="min-h-svh">
    <div class="container-main page">
      <FadeIn>
        <FadeItem>
          <h1 class="text-title">{{ title }}</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-2">{{ description }}</p>
        </FadeItem>

        <FadeItem>
          <ul v-if="tools.length" class="mt-12 flex flex-col gap-2">
            <li v-for="tool in tools" :key="tool.name">
              <ToolCard :tool="tool" />
            </li>
          </ul>
          <p v-else class="mt-12 text-muted">Nothing here yet. Still sharpening.</p>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
