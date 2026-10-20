<script lang="ts" setup>
  import type { Tool } from '~/components/ToolCard.vue';

  const tools: Tool[] = [
    {
      name: 'XML Formatter',
      description: 'Unescape and prettify XML copied from logs. Runs entirely in your browser.',
      link: { type: 'internal', to: '/xml-formatter' },
      kind: 'Web',
      stack: ['Vue'],
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
          <a href="https://gerasaka.dev" class="btn btn-quiet">
            <Icon name="solar:arrow-left-line-duotone" class="mt-0.5 size-3.5" />
            Back
          </a>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title mt-12">{{ title }}</h1>
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
