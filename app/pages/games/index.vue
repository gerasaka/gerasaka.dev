<script lang="ts" setup>
  import { GAMES } from '~/games/games';
  import GameCard from '~/games/GameCard.vue';

  const title = 'Games';
  const description = 'Collection of games I make for fun.';

  usePageSeo({ title, description });
</script>

<template>
  <main class="min-h-svh">
    <div class="container-main page">
      <FadeIn>
        <FadeItem>
          <NuxtLink to="/" class="btn btn-quiet">
            <Icon name="solar:arrow-left-line-duotone" class="mt-0.5 size-3.5" />
            Back
          </NuxtLink>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title mt-12">{{ title }}</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-2">{{ description }}</p>
        </FadeItem>

        <FadeItem>
          <ul class="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <li v-for="game in GAMES" :key="game.name">
              <GameCard :game="game" />
            </li>
          </ul>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
