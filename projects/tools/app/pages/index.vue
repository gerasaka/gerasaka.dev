<script lang="ts" setup>
  import { TOOLS } from '~/tools/tools';
  import ToolCard from '~/tools/ToolCard.vue';

  const title = 'Tools — Gerry Julio';
  const description = 'Small tools I built and use every day.';

  useSeoMeta({
    robots: 'index, follow',
    title,
    description,
    ogUrl: 'https://tools.gerasaka.dev/',
    ogType: 'website',
    ogSiteName: 'Gerry Julio',
    ogTitle: title,
    ogDescription: description,
  });
</script>

<template>
  <main class="bg-surface min-h-svh">
    <div class="main-container">
      <FadeIn>
        <FadeItem>
          <a
            href="https://gerasaka.dev"
            class="group inline-flex w-fit items-center gap-1.5 text-muted transition-colors duration-150 hover:text-foreground italic"
          >
            <span
              aria-hidden="true"
              class="transition-transform duration-150 ease-elegant group-hover:-translate-x-0.75"
            >
              &larr;
            </span>
            gerasaka.dev
          </a>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title mt-12">Tools</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-2">{{ description }}</p>
        </FadeItem>

        <FadeItem>
          <ul v-if="TOOLS.length" class="mt-12 flex flex-col gap-2">
            <li v-for="tool in TOOLS" :key="tool.name">
              <ToolCard :tool="tool" />
            </li>
          </ul>
          <p v-else class="mt-12 text-muted italic">Nothing here yet. Still sharpening.</p>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
