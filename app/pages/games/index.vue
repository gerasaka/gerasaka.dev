<script lang="ts" setup>
  import { GAMES } from '~/games/games';
  import GameCard from '~/games/GameCard.vue';
</script>

<template>
  <main class="bg-surface min-h-svh">
    <div class="main-container">
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
            Back
          </NuxtLink>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title mt-12">Games</h1>
        </FadeItem>
        <FadeItem>
          <!-- TODO: Update description -->
          <p class="text-muted font-extralight text-xl mt-2"></p>
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
