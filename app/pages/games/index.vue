<script lang="ts" setup>
  const games = [
    {
      name: 'Snake',
      path: '/games/snake',
      description: "The classic. Eat, grow, don't hit the walls.",
    },
  ];

  useSeoMeta({
    title: 'Games',
    description: 'Small games built for fun.',
  });
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
          <p class="text-muted font-extralight text-xl mt-2">
            Small games, built for fun. More coming soon.
          </p>
        </FadeItem>

        <ul class="mt-12 flex flex-col gap-10">
          <FadeItem v-for="game in games" :key="game.path">
            <li>
              <NuxtLink :to="game.path" class="group block">
                <h2
                  class="font-pixel font-normal text-3xl group-hover:text-primary-600 transition-colors duration-300"
                >
                  {{ game.name }}
                </h2>
                <p class="mt-2">{{ game.description }}</p>
              </NuxtLink>
            </li>
          </FadeItem>
        </ul>
      </FadeIn>
    </div>
  </main>
</template>
