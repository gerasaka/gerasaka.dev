<script lang="ts" setup>
  import type { NuxtError } from '#app';

  const route = useRoute();
  const { error } = defineProps<{ error: NuxtError }>();

  const is404 = computed(() => error.status === 404);
  const heading = computed(() =>
    is404.value ? 'This page was never written.' : 'Something broke mid-sentence.',
  );
  const message = computed(() =>
    is404.value
      ? 'The address leads nowhere. The link may be old, or the page may only ever have been an idea.'
      : 'An unexpected error interrupted things. Trying again in a moment usually helps.',
  );

  useSeoMeta({
    title: () => `${error.status} · Gerry Julio`,
    robots: 'noindex',
  });

  function goHome() {
    clearError({ redirect: '/' });
  }
</script>

<template>
  <main class="min-h-svh">
    <div class="container-main page relative flex min-h-svh flex-col justify-center">
      <FadeIn>
        <FadeItem>
          <p
            class="w-fit max-w-full truncate font-mono text-sm text-muted line-through decoration-line-strong decoration-1"
            :title="route.fullPath"
          >
            {{ route.fullPath }}
          </p>
        </FadeItem>

        <FadeItem>
          <h1 class="text-title mt-6 max-w-xl italic">{{ heading }}</h1>
        </FadeItem>

        <FadeItem>
          <p class="text-body mt-8 max-w-md">{{ message }}</p>
        </FadeItem>

        <FadeItem class="mt-12">
          <button type="button" class="link w-fit" @click="goHome">Return home</button>
        </FadeItem>
      </FadeIn>

      <p class="absolute right-0 bottom-8 font-serif text-sm italic text-muted" aria-hidden="true">
        p. {{ error.status }}
      </p>
    </div>

    <ThemeToggle />
    <Toaster />
  </main>
</template>
