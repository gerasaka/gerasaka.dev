<script lang="ts" setup>
  import { Comment, Fragment, computed, ref, useSlots } from 'vue';
  import type { VNode } from 'vue';

  const slots = useSlots();

  function flatten(nodes: VNode[]): VNode[] {
    return nodes.flatMap((node) => {
      if (node.type === Comment) return [];
      if (node.type === Fragment && Array.isArray(node.children)) {
        return flatten(node.children as VNode[]);
      }
      return [node];
    });
  }

  const panels = computed(() =>
    flatten(slots.default?.() ?? []).map((vnode, index) => {
      const props = (vnode.props ?? {}) as { filename?: string; language?: string };
      return { vnode, label: props.filename ?? props.language ?? `Tab ${index + 1}` };
    }),
  );

  const active = ref(0);
</script>

<template>
  <div class="not-prose my-6 overflow-hidden rounded-md border border-line">
    <div role="tablist" class="flex gap-1 border-b border-line bg-surface-subtle px-2">
      <button
        v-for="(panel, index) in panels"
        :key="index"
        type="button"
        role="tab"
        :aria-selected="active === index"
        class="text-caption -mb-px border-b-2 px-3 py-2"
        :class="active === index ? 'border-foreground text-foreground' : 'border-transparent'"
        @click="active = index"
      >
        {{ panel.label }}
      </button>
    </div>
    <div role="tabpanel" class="[&_pre]:m-0 [&_pre]:rounded-none [&_pre]:border-0">
      <component :is="panels[active]?.vnode" />
    </div>
  </div>
</template>
