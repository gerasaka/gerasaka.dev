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
          <h1 class="text-title mt-12">Writes</h1>
        </FadeItem>
        <FadeItem>
          <!-- TODO: Update description -->
          <p class="text-subtitle mt-2"></p>
        </FadeItem>

        <ul class="mt-12 flex flex-col gap-10">
          <FadeItem v-for="post in posts" :key="post.path">
            <li>
              <NuxtLink :to="post.path" class="group block">
                <p class="text-caption">{{ formatDate(post.date) }}</p>
                <h2
                  class="text-heading mt-1 transition-colors duration-fast ease-glide group-hover:text-accent-strong"
                >
                  {{ post.title }}
                </h2>
                <p class="text-body mt-2">{{ post.description }}</p>
              </NuxtLink>
            </li>
          </FadeItem>
        </ul>

        <FadeItem v-if="!posts?.length">
          <p class="mt-12 text-muted">No posts yet. Check back soon.</p>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>
