<script lang="ts" setup>
  definePageMeta({ layout: 'section', section: 'writes' });

  const { data: posts } = await useAsyncData('writes-list', () =>
    queryCollection('writes').order('date', 'DESC').all(),
  );

  const title = 'Writes';
  const description = 'Thoughts on software, design, and whatever else sparks my curiosity.';

  usePageSeo({ title, description });
</script>

<template>
  <main class="min-h-svh">
    <div class="container-main page">
      <FadeIn>
        <FadeItem>
          <h1 class="text-title">{{ title }}</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-2">{{ description }}</p>
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
