<script lang="ts" setup>
  import { formatReadingTime } from '~/writes/reading-time';

  const route = useRoute();

  const { data: post } = await useAsyncData(`writes-${route.path}`, () =>
    queryCollection('writes').path(route.path).first(),
  );

  if (!post.value) {
    throw createError({ status: 404, statusText: 'Post not found', fatal: true });
  }

  usePageSeo(
    computed(() => ({
      title: post.value?.title ?? '',
      description: post.value?.description ?? '',
    })),
  );
</script>

<template>
  <main class="min-h-svh">
    <article class="container-main page">
      <NuxtLink to="/writes" class="btn btn-quiet">
        <Icon name="solar:arrow-left-line-duotone" class="mt-0.5 size-3.5" />
        All posts
      </NuxtLink>

      <template v-if="post">
        <span class="text-caption flex items-center mt-12">
          <p>{{ formatDate(post.date) }}</p>
          <Icon name="ph:dot-outline-fill" class="mt-0.5 mx-1.5" />
          <p>{{ formatReadingTime(post.body) }}</p>
        </span>
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
