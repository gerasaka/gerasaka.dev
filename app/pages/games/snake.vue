<script lang="ts" setup>
  import SnakeGame from '~/games/snake/SnakeGame.vue';

  definePageMeta({ layout: 'section', section: 'games' });
</script>

<template>
  <main class="min-h-svh">
    <div class="container-main page">
      <FadeIn>
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
