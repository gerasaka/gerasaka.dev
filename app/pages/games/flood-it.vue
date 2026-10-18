<script lang="ts" setup>
  import FloodGame from '~/games/flood-it/FloodGame.vue';
</script>

<template>
  <main class="bg-surface min-h-svh">
    <div class="main-container">
      <FadeIn>
        <FadeItem>
          <NuxtLink
            to="/games"
            class="group inline-flex w-fit items-center gap-1.5 text-muted transition-colors duration-150 hover:text-foreground italic"
          >
            <span
              aria-hidden="true"
              class="transition-transform duration-150 ease-elegant group-hover:-translate-x-0.75"
            >
              &larr;
            </span>
            All games
          </NuxtLink>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title font-pixel mt-12">Flood-It</h1>
        </FadeItem>

        <FadeItem class="mt-10 mx-auto">
          <FloodGame />
        </FadeItem>

        <FadeItem class="mt-16 mx-auto w-full max-w-md">
          <section>
            <h2 class="font-pixel text-2xl">How to play</h2>
            <p class="text-body mt-2">
              Your flood starts at the top-left corner. Pick a color and the flood turns that
              color, swallowing every touching square that already matches. Fill the whole board
              with one color in 25 moves or fewer.
            </p>

            <h2 class="font-pixel text-2xl mt-10">Harder than it looks</h2>
            <p class="text-body mt-2">
              Finding the fewest possible moves for a Flood-It board is NP-hard, the same family
              of problems as the traveling salesman. Nobody knows a fast way to find the perfect
              solution, so every good move you make is a guess backed by intuition.
            </p>
          </section>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
