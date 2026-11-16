<script lang="ts" setup>
  import { LABS } from '~/labs/labs';
  import SpotlightCards from '~/labs/spotlight-cards/SpotlightCards.vue';

  definePageMeta({ layout: 'section', section: 'labs' });

  const lab = LABS.find((l) => l.slug === 'spotlight-cards')!;

  usePageSeo({ title: `${lab.name} - Labs`, description: lab.description });
</script>

<template>
  <main class="min-h-svh">
    <div class="container-main page">
      <FadeIn>
        <FadeItem>
          <NuxtLink to="/labs" class="text-caption hover:text-foreground">&larr; Labs</NuxtLink>
        </FadeItem>
        <FadeItem>
          <h1 class="text-title mt-4">{{ lab.name }}</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-2">{{ lab.description }}</p>
        </FadeItem>

        <FadeItem>
          <div class="mt-10">
            <SpotlightCards />
          </div>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
