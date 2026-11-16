<script lang="ts" setup>
  import { LABS_SORTED, LAB_KIND_LABELS } from '~/labs/labs';

  definePageMeta({ layout: 'section', section: 'labs' });

  const title = 'Labs';
  const description =
    'Experiments in progress: new UI ideas, animations I admire and rebuild, and APIs I poke at.';

  usePageSeo({ title, description });
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

        <ul class="mt-12 flex flex-col gap-10">
          <FadeItem v-for="lab in LABS_SORTED" :key="lab.slug">
            <li>
              <NuxtLink :to="`/labs/${lab.slug}`" class="group block">
                <div class="flex items-center gap-2">
                  <span class="badge badge-accent">{{ LAB_KIND_LABELS[lab.kind] }}</span>
                  <span v-if="lab.status === 'wip'" class="badge badge-warning">WIP</span>
                </div>
                <h2
                  class="text-heading mt-2 transition-colors duration-fast ease-glide group-hover:text-accent-strong"
                >
                  {{ lab.name }}
                </h2>
                <p class="text-body mt-2">{{ lab.description }}</p>
              </NuxtLink>
            </li>
          </FadeItem>
        </ul>

        <FadeItem v-if="!LABS_SORTED.length">
          <p class="mt-12 text-muted">Nothing brewing yet. Check back soon.</p>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
