<script lang="ts" setup>
  const { data: posts } = await useAsyncData('writes-list', () =>
    queryCollection('writes').order('date', 'DESC').all(),
  );

  useSeoMeta({
    title: 'Writes · Gerry Julio',
    // TODO: Update description
    description: '',
  });
</script>

<template>
  <main class="bg-surface min-h-svh">
    <div class="flex flex-col mx-auto p-8 py-20 md:p-20 max-w-4xl">
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
          <h1 class="text-title mt-12">Writes</h1>
        </FadeItem>
        <FadeItem>
          <!-- TODO: Update description -->
          <p class="text-muted font-extralight text-xl mt-2"></p>
        </FadeItem>

        <ul class="mt-12 flex flex-col gap-10">
          <FadeItem v-for="post in posts" :key="post.path">
            <li>
              <NuxtLink :to="post.path" class="group block">
                <p class="text-muted text-sm">{{ formatDate(post.date) }}</p>
                <h2
                  class="font-serif font-normal text-2xl mt-1 group-hover:text-primary-600 transition-colors duration-300"
                >
                  {{ post.title }}
                </h2>
                <p class="mt-2">{{ post.description }}</p>
              </NuxtLink>
            </li>
          </FadeItem>
        </ul>

        <FadeItem v-if="!posts?.length">
          <p class="text-muted mt-12">No posts yet. Check back soon.</p>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
