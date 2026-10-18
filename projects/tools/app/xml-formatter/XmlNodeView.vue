<script lang="ts" setup>
  import type { XmlAttribute, XmlNode } from './xml-format';
  import { escapeAttribute, escapeText, INDENT, isInline } from './xml-format';

  const { node, depth = 0 } = defineProps<{ node: XmlNode; depth?: number }>();

  const pad = computed(() => INDENT.repeat(depth));
  const inlineText = computed(() => {
    if (node.type !== 'element' || !isInline(node)) return null;
    const [child] = node.children;
    if (child?.type === 'text') return { cdata: false, value: escapeText(child.value) };
    if (child?.type === 'cdata') return { cdata: true, value: child.value };
    return null;
  });

  function attributes(list: XmlAttribute[]) {
    return list.map(({ name, value }) => ({ name, value: escapeAttribute(value) }));
  }
</script>

<!-- The output is `white-space: pre`: keep text-only lines on one line so template whitespace doesn't show. -->
<template>
  <template v-if="node.type === 'element'">
    <div>
      <span>{{ pad }}</span>
      <span class="xml-punct">&lt;</span>
      <span class="xml-tag">{{ node.name }}</span>
      <template v-for="attr in attributes(node.attributes)" :key="attr.name">
        <span class="xml-attr">{{ ' ' + attr.name }}</span>
        <span class="xml-punct">=</span>
        <span class="xml-value">"{{ attr.value }}"</span>
      </template>
      <template v-if="!node.children.length">
        <span class="xml-punct">/&gt;</span>
      </template>
      <template v-else-if="inlineText">
        <span class="xml-punct">&gt;</span>
        <span v-if="inlineText.cdata" class="xml-comment">&lt;![CDATA[</span>
        <span class="xml-text">{{ inlineText.value }}</span>
        <span v-if="inlineText.cdata" class="xml-comment">]]&gt;</span>
        <span class="xml-punct">&lt;/</span>
        <span class="xml-tag">{{ node.name }}</span>
        <span class="xml-punct">&gt;</span>
      </template>
      <span v-else class="xml-punct">&gt;</span>
    </div>
    <template v-if="node.children.length && !inlineText">
      <XmlNodeView
        v-for="(child, index) in node.children"
        :key="index"
        :node="child"
        :depth="depth + 1"
      />
      <div>
        <span>{{ pad }}</span>
        <span class="xml-punct">&lt;/</span>
        <span class="xml-tag">{{ node.name }}</span>
        <span class="xml-punct">&gt;</span>
      </div>
    </template>
  </template>
  <div v-else-if="node.type === 'text'" class="xml-text">{{ pad + escapeText(node.value) }}</div>
  <div v-else-if="node.type === 'cdata'">
    <span>{{ pad }}</span>
    <span class="xml-comment">&lt;![CDATA[</span>
    <span class="xml-text">{{ node.value }}</span>
    <span class="xml-comment">]]&gt;</span>
  </div>
  <div v-else-if="node.type === 'comment'" class="xml-comment">{{ `${pad}<!--${node.value}-->` }}</div>
  <div v-else-if="node.type === 'instruction'" class="xml-punct">{{ `${pad}<?${node.target} ${node.value}?>` }}</div>
</template>

<!-- GitHub's light and dark syntax palettes, matching the prose code blocks. -->
<style scoped>
  .xml-punct {
    color: light-dark(#6a737d, #8b949e);
  }

  .xml-tag {
    color: light-dark(#22863a, #7ee787);
  }

  .xml-attr {
    color: light-dark(#6f42c1, #d2a8ff);
  }

  .xml-value {
    color: light-dark(#032f62, #a5d6ff);
  }

  .xml-text {
    color: var(--color-foreground);
  }

  .xml-comment {
    color: light-dark(#6a737d, #8b949e);
    font-style: italic;
  }
</style>
