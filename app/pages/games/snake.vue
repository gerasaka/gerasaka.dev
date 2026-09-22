<script lang="ts" setup>
  import SnakeGame from '~/games/snake/SnakeGame.vue';
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
          <h1 class="text-title font-pixel mt-12">Snake</h1>
        </FadeItem>

        <FadeItem class="mt-10 mx-auto">
          <SnakeGame />
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
