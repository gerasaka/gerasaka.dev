<script lang="ts">
  type ToolLink =
    | { type: 'internal'; to: string }
    | { type: 'external'; url: string }
    | { type: 'repo'; url: string };

  export type Tool = {
    name: string;
    description: string;
    link: ToolLink;
    kind: 'Web' | 'CLI' | 'Extension';
    stack: string[];
    wip?: boolean;
  };
</script>

<script lang="ts" setup>
  const { tool } = defineProps<{ tool: Tool }>();

  const wrapper = computed(() => {
    const { link } = tool;
    switch (link.type) {
      case 'internal':
        return { is: resolveComponent('NuxtLink'), props: { to: link.to } };
      default:
        return {
          is: 'a',
          props: { href: link.url, target: '_blank', rel: 'noopener noreferrer' },
        };
    }
  });
</script>

<template>
  <component
    :is="wrapper.is"
    v-bind="wrapper.props"
    class="card card-link flex flex-col gap-2 relative overflow-hidden"
  >
    <span
      v-if="tool.wip"
      class="absolute top-0 right-0 px-4 py-1 bg-ochre-500 text-white rounded-bl-sm"
    >
      WIP
    </span>

    <div class="flex items-center gap-3">
      <h2 class="font-mono text-xl">{{ tool.name }}</h2>
    </div>

    <p class="text-muted">{{ tool.description }}</p>

    <div class="flex items-center gap-2">
      <div class="badge">{{ tool.kind }}</div>
      <div v-for="tech in tool.stack" :key="tech" class="badge">{{ tech }}</div>
    </div>
  </component>
</template>
