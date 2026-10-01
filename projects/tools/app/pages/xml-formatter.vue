<script lang="ts" setup>
  import type { FormatResult } from '~/tools/xml-formatter/xml-format';
  import { formatXml, serializeXml } from '~/tools/xml-formatter/xml-format';
  import { EXAMPLE_INPUT } from '~/tools/xml-formatter/example';
  import XmlNodeView from '~/tools/xml-formatter/XmlNodeView.vue';

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
  const { copy, copied } = useClipboard({ copiedDuring: 2000 });

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
  <main class="bg-surface min-h-svh">
    <div class="mx-auto flex max-w-7xl flex-col p-8 py-20 md:p-12 md:py-20">
      <FadeIn>
        <FadeItem>
          <NuxtLink
            to="/"
            class="group inline-flex w-fit items-center gap-1.5 text-muted transition-colors duration-150 hover:text-foreground italic"
          >
            <span
              aria-hidden="true"
              class="transition-transform duration-150 ease-elegant group-hover:-translate-x-0.75"
            >
              &larr;
            </span>
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
              <label for="xml-input" class="text-sm text-muted">Input</label>
              <textarea
                id="xml-input"
                v-model="input"
                spellcheck="false"
                placeholder="Paste XML or a log line containing escaped XML…"
                class="h-[60vh] w-full resize-none rounded-md border border-[#e5e5e5] bg-[#f6f8fa] p-4 font-mono text-sm outline-none focus:border-primary-400"
                @keydown.meta.enter.prevent="format"
                @keydown.ctrl.enter.prevent="format"
              ></textarea>
              <div class="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm text-surface transition-transform duration-150 active:scale-97"
                  @click="format"
                >
                  Format
                  <kbd class="ml-2 font-sans text-xs opacity-60">⌘/Ctrl ↵</kbd>
                </button>
                <button
                  type="button"
                  class="cursor-pointer px-2 py-2 text-sm text-muted transition-colors duration-150 hover:text-foreground"
                  @click="loadExample"
                >
                  Load example
                </button>
                <button
                  v-if="input"
                  type="button"
                  class="cursor-pointer px-2 py-2 text-sm text-muted transition-colors duration-150 hover:text-foreground"
                  @click="clear"
                >
                  Clear
                </button>
              </div>
            </section>

            <section class="flex min-w-0 flex-col gap-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">
                  Output
                  <template v-if="result?.ok">
                    · {{ result.unescaped ? 'Unescaped JSON string' : 'Formatted as-is' }}
                  </template>
                </span>
                <button
                  v-if="result?.ok"
                  type="button"
                  class="cursor-pointer text-muted transition-colors duration-150 hover:text-foreground"
                  @click="copy(pretty)"
                >
                  {{ copied ? 'Copied!' : 'Copy' }}
                </button>
              </div>

              <div
                class="h-[60vh] overflow-auto rounded-md border border-[#e5e5e5] font-mono text-sm whitespace-pre"
                role="region"
                aria-label="Formatted XML"
              >
                <div v-if="result?.ok" class="xml-lines" :style="{ '--gutter': `${gutterWidth}ch` }">
                  <div v-if="result.document.declaration" class="text-[#6a737d]">{{ result.document.declaration }}</div>
                  <XmlNodeView
                    v-for="(node, index) in result.document.nodes"
                    :key="index"
                    :node="node"
                  />
                </div>
                <p v-else-if="result" class="p-4 whitespace-pre-wrap text-red-600">{{ result.error }}</p>
                <p v-else class="p-4 font-sans text-muted italic">
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
    color: #b0b0b0;
    background: var(--color-surface);
  }
</style>
