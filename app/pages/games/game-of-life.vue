<script lang="ts" setup>
  import LifeGame from '~/games/game-of-life/LifeGame.vue';
  import RuleDiagram from '~/games/game-of-life/RuleDiagram.vue';

  const rules = [
    {
      text: 'A live cell with fewer than two live neighbors dies, as if by underpopulation.',
      pattern: ['...', '.#.', '..#'],
      becomes: false,
    },
    {
      text: 'A live cell with two or three live neighbors lives on.',
      pattern: ['#..', '.#.', '..#'],
      becomes: true,
    },
    {
      text: 'A live cell with more than three live neighbors dies, as if by overpopulation.',
      pattern: ['#.#', '.#.', '#.#'],
      becomes: false,
    },
    {
      text: 'A dead cell with exactly three live neighbors comes alive, as if by reproduction.',
      pattern: ['#..', '...', '#.#'],
      becomes: true,
    },
  ];
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
          <h1 class="text-title font-pixel mt-12">Game of Life</h1>
        </FadeItem>

        <FadeItem class="mt-10 mx-auto">
          <LifeGame />
        </FadeItem>

        <FadeItem class="mt-16 mx-auto w-full max-w-md">
          <section>
            <h2 class="font-pixel text-2xl">Rules</h2>
            <p class="text-muted mt-2">
              Every cell looks at its eight neighbors. Cells past the edge of the board count as
              dead. Each generation:
            </p>
            <ol class="mt-6 flex flex-col gap-5 text-body">
              <li
                v-for="rule in rules"
                :key="rule.text"
                class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5"
              >
                <RuleDiagram :pattern="rule.pattern" :becomes="rule.becomes" />
                <p>{{ rule.text }}</p>
              </li>
            </ol>
          </section>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
