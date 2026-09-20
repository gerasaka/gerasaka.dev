<script lang="ts" setup>
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
  <main class="bg-surface min-h-svh">
    <article class="flex flex-col mx-auto px-8 py-20 md:p-20 max-w-4xl">
      <NuxtLink
        to="/writes"
        class="group inline-flex w-fit items-center gap-1.5 text-muted transition-colors duration-150 hover:text-foreground italic"
      >
        <span
          aria-hidden="true"
          class="transition-transform duration-150 ease-elegant group-hover:-translate-x-0.75"
        >
          &larr;
        </span>
        All posts
      </NuxtLink>

      <template v-if="post">
        <p class="text-muted text-sm mt-12">
          {{ formatDate(post.date) }}
          <span aria-hidden="true"> · </span>
          {{ formatReadingTime(post.body) }}
        </p>
        <h1 class="text-title mt-2">
          {{ post.title }}
        </h1>
        <p v-if="post.tags?.length" class="text-muted text-sm mt-4">
          {{ post.tags.join(' · ') }}
        </p>

        <ContentRenderer :value="post" class="prose-write mt-10" />
      </template>
    </article>
  </main>
</template>
