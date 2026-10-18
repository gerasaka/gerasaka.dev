<script lang="ts" setup>
  import { formatReadingTime } from '~/writes/reading-time';

  const route = useRoute();

  const { data: post } = await useAsyncData(`writes-${route.path}`, () =>
    queryCollection('writes').path(route.path).first(),
  );

  if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
  }

  useSeoMeta({
    title: () => `${post.value?.title} · Gerry Julio`,
    description: () => post.value?.description,
  });
</script>

<template>
  <main class="min-h-svh">
    <article class="container-main page">
      <NuxtLink to="/writes" class="btn btn-quiet">
        <span aria-hidden="true">&larr;</span>
        All posts
      </NuxtLink>

      <template v-if="post">
        <p class="text-caption mt-12">
          {{ formatDate(post.date) }}
          <span aria-hidden="true"> · </span>
          {{ formatReadingTime(post.body) }}
        </p>
        <h1 class="text-title mt-2">
          {{ post.title }}
        </h1>
        <ul v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <li v-for="tag in post.tags" :key="tag" class="badge">{{ tag }}</li>
        </ul>

        <ContentRenderer :value="post" class="prose-write mt-10" />
      </template>
    </article>
  </main>
</template>