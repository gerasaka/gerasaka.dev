<script lang="ts" setup>
  import { LABS } from '~/labs/labs';
  import DistortText from '~/labs/distort-text/DistortText.vue';

  definePageMeta({ layout: 'section', section: 'labs' });

  const lab = LABS.find((l) => l.slug === 'distort-text')!;

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
          <div class="mt-10 card">
            <DistortText />
          </div>
        </FadeItem>

        <FadeItem>
          <div class="mt-12">
            <h2 class="text-heading">How it works</h2>
            <p class="text-body mt-2">
              Each letter is its own element. On pointer move, the page measures every letter's
              centre and writes two values into CSS variables: how close the cursor is (0 to 1)
              and the direction away from it. Letters are pushed and leaned away from the cursor,
              and the colour shifts with closeness.
            </p>
          </div>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
