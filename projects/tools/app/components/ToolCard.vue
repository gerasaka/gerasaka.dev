<script lang="ts">
  type ToolLink =
    | { type: 'internal'; to: string }
    | { type: 'mounted'; path: string }
    | { type: 'external'; url: string }
    | { type: 'repo'; url: string; install?: string };

  export type Tool = {
    name: string;
    description: string;
    link: ToolLink;
    kind: 'web' | 'cli' | 'extension';
    stack: string[];
    status?: 'live' | 'wip';
  };
</script>

<script lang="ts" setup>
  const { tool } = defineProps<{ tool: Tool }>();

  const wrapper = computed(() => {
    const { link } = tool;
    switch (link.type) {
      case 'internal':
        return { is: resolveComponent('NuxtLink'), props: { to: link.to } };
      case 'mounted':
        // Served by another Worker, so it needs a full page load instead of client-side routing.
        return { is: 'a', props: { href: link.path } };
      case 'external':
      case 'repo':
        return {
          is: 'a',
          props: { href: link.url, target: '_blank', rel: 'noopener noreferrer' },
        };
      default: {
        const unhandled: never = link;
        throw new Error(`Unhandled tool link: ${JSON.stringify(unhandled)}`);
      }
    }
  });
</script>

<template>
  <component :is="wrapper.is" v-bind="wrapper.props" class="card card-link flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <h2 class="font-mono text-xl">{{ tool.name }}</h2>
      <span v-if="tool.status === 'wip'" class="badge badge-warning">WIP</span>
    </div>

    <p class="text-muted">{{ tool.description }}</p>

    <code
      v-if="tool.link.type === 'repo' && tool.link.install"
      class="w-fit rounded-sm bg-surface-subtle px-2 py-1 font-mono text-sm"
    >
      {{ tool.link.install }}
    </code>

    <ul class="meta text-caption flex flex-wrap">
      <li>{{ tool.kind }}</li>
      <li v-for="tech in tool.stack" :key="tech">{{ tech }}</li>
    </ul>
  </component>
</template>

<style scoped>
  .meta > li + li::before {
    content: '·';
    margin-inline: 0.5em;
  }
</style>
