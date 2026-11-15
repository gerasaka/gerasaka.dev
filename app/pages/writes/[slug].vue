<script lang="ts" setup>
  import ReadingProgressBar from '~/writes/ReadingProgressBar.vue';
  import { formatReadingTime } from '~/writes/reading-time';

  definePageMeta({ layout: 'section', section: 'writes' });

  const route = useRoute();
  const site = useAppConfig().site;

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
      image: post.value?.cover
        ? { url: `${site.url}${post.value.cover}`, alt: `Cover image for ${post.value.title}` }
        : undefined,
    })),
  );
</script>

<template>
  <main class="min-h-svh [timeline-scope:--article]">
    <article class="container-main page">
      <FadeIn v-if="post">
        <FadeItem v-if="post.cover">
          <img
            :src="post.cover"
            alt=""
            width="1200"
            height="630"
            fetchpriority="high"
            class="mt-12 block aspect-1200/630 w-full rounded-md object-cover"
          />
        </FadeItem>
        <FadeItem>
          <span class="text-caption flex items-center" :class="post.cover ? 'mt-10' : 'mt-12'">
            <p>{{ formatDate(post.date) }}</p>
            <Icon name="ph:dot-outline-fill" class="mt-0.5 mx-1.5" />
            <p>{{ formatReadingTime(post.body) }}</p>
          </span>
        </FadeItem>
        <FadeItem>
          <h1 class="text-title mt-2">
            {{ post.title }}
          </h1>
        </FadeItem>
        <FadeItem v-if="post.tags?.length">
          <ul class="mt-4 flex flex-wrap gap-2">
            <li v-for="tag in post.tags" :key="tag" class="badge">{{ tag }}</li>
          </ul>
        </FadeItem>

        <FadeItem>
          <ContentRenderer :value="post" class="prose-write mt-10 [view-timeline:--article]" />
        </FadeItem>
      </FadeIn>
    </article>
    <ReadingProgressBar />
  </main>
</template>
