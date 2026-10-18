<script lang="ts" setup>
  import { GAMES } from '~/games/games';
  import GameCard from '~/games/GameCard.vue';
</script>

<template>
  <main class="min-h-svh">
    <div class="container-main page">
      <FadeIn>
        <FadeItem>
          <NuxtLink
            to="/"
            class="btn btn-quiet"
          >
            <span aria-hidden="true">&larr;</span>
            Back
          </NuxtLink>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title mt-12">Games</h1>
        </FadeItem>
        <FadeItem>
          <!-- TODO: Update description -->
          <p class="text-subtitle mt-2"></p>
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
