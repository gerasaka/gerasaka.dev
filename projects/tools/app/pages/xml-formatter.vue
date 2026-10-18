<script lang="ts" setup>
  import type { FormatResult } from '~/xml-formatter/xml-format';
  import { formatXml, serializeXml } from '~/xml-formatter/xml-format';
  import { EXAMPLE_INPUT } from '~/xml-formatter/example';
  import XmlNodeView from '~/xml-formatter/XmlNodeView.vue';

  const title = 'XML Formatter — Tools';
  const description = 'Unescape and prettify XML copied from logs. Runs entirely in your browser.';

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: 'https://tools.gerasaka.dev/xml-formatter',
  });

  const input = ref('');
  const result = ref<FormatResult | null>(null);
  const pretty = computed(() => (result.value?.ok ? serializeXml(result.value.document) : ''));
  const gutterWidth = computed(() => String(pretty.value.split('\n').length).length);
  const { copy } = useClipboard();
  const { toast } = useToast();

  async function copyOutput() {
    await copy(pretty.value);
    toast('Copied to clipboard');
  }

  function format() {
    result.value = input.value.trim() ? formatXml(input.value) : null;
  }

  function loadExample() {
    input.value = EXAMPLE_INPUT;
    format();
  }

  function clear() {
    input.value = '';
    result.value = null;
  }
</script>

<template>
  <main class="min-h-svh">
    <div class="container-wide page">
      <FadeIn>
        <FadeItem>
          <NuxtLink to="/" class="btn btn-quiet">
            <span aria-hidden="true">&larr;</span>
            Tools
          </NuxtLink>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title mt-12">XML Formatter</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-2">{{ description }}</p>
        </FadeItem>

        <FadeItem>
          <div class="mt-12 grid gap-6 lg:grid-cols-2">
            <section class="flex min-w-0 flex-col gap-3">
              <div class="flex min-h-8 items-center">
                <label for="xml-input" class="text-label">Input</label>
              </div>
              <textarea
                id="xml-input"
                v-model="input"
                spellcheck="false"
                placeholder="Paste XML or a log line containing escaped XML…"
                class="pane field resize-none p-4 font-mono"
                @keydown.meta.enter.prevent="format"
                @keydown.ctrl.enter.prevent="format"
              ></textarea>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="btn" @click="format">Format</button>
                <button type="button" class="btn btn-ghost" @click="loadExample">
                  Load example
                </button>
                <button v-if="input" type="button" class="btn btn-ghost" @click="clear">
                  Clear
                </button>
                <span class="text-caption ml-auto hidden sm:inline">
                  <kbd>⌘</kbd> <kbd>Enter</kbd> to format
                </span>
              </div>
            </section>

            <section class="flex min-w-0 flex-col gap-3">
              <div class="flex min-h-8 items-center justify-between gap-4">
                <span class="text-label">Output</span>
                <button
                  v-if="result?.ok"
                  type="button"
                  class="btn btn-outline btn-sm"
                  @click="copyOutput"
                >
                  Copy
                </button>
              </div>

              <div
                class="pane overflow-auto rounded-md border border-line font-mono text-sm whitespace-pre"
                role="region"
                aria-label="Formatted XML"
              >
                <div
                  v-if="result?.ok"
                  class="xml-lines"
                  :style="{ '--gutter': `${gutterWidth}ch` }"
                >
                  <div v-if="result.document.declaration" class="text-muted">
                    {{ result.document.declaration }}
                  </div>
                  <XmlNodeView
                    v-for="(node, index) in result.document.nodes"
                    :key="index"
                    :node="node"
                  />
                </div>
                <div v-else-if="result" class="p-4">
                  <p class="callout callout-danger font-mono whitespace-pre-wrap" role="alert">
                    {{ result.error }}
                  </p>
                </div>
                <p v-else class="p-4 font-sans whitespace-normal text-muted">
                  Formatted XML shows up here. Nothing leaves your browser.
                </p>
              </div>
            </section>
          </div>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>

<style scoped>
  .pane {
    height: 60vh;
  }

  /* Lines come from nested XmlNodeView fragments, but they all render as direct children here. */
  .xml-lines {
    counter-reset: line;
    width: max-content;
    min-width: 100%;
    padding-block: 1rem;
    padding-right: 1rem;
  }

  .xml-lines > :deep(div) {
    counter-increment: line;
  }

  .xml-lines > :deep(div)::before {
    content: counter(line);
    position: sticky;
    left: 0;
    display: inline-block;
    box-sizing: content-box;
    width: var(--gutter);
    padding-inline: 1rem 1.5ch;
    text-align: right;
    color: var(--color-line-strong);
    background: var(--color-surface);
  }
</style>
