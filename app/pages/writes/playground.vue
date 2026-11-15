<script lang="ts" setup>
  useSeoMeta({
    title: 'Writes playground · Gerry Julio',
    robots: 'noindex, nofollow',
  });

  const { data: doc } = await useAsyncData('writes-playground', () =>
    queryCollection('playground').path('/playground').first(),
  );

  if (!doc.value) {
    throw createError({ status: 404, statusText: 'Playground not found', fatal: true });
  }
</script>

<template>
  <main class="min-h-svh">
    <article class="container-main page">
      <h1 class="text-title mt-12">{{ doc?.title }}</h1>
      <ContentRenderer v-if="doc" :value="doc" class="prose-write mt-10" />
    </article>
  </main>
</template>
