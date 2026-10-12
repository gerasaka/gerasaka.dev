<script lang="ts" setup>
  const { id, number, title, description } = defineProps<{
    id: string;
    number: string;
    title: string;
    description: string;
  }>();
</script>

<template>
  <section :id="id" class="mt-section grid grid-cols-4 gap-x-column sm:grid-cols-8 lg:grid-cols-12 scroll-mt-8 border-t-2 border-foreground pt-6">
    <header class="col-span-full lg:sticky lg:top-8 lg:col-span-4 lg:self-start">
      <span class="font-mono text-sm text-muted">{{ number }}</span>
      <h2 class="text-title mt-4 lg:text-5xl">{{ title }}</h2>
      <p class="text-caption mt-4 max-w-md">{{ description }}</p>
    </header>
    <div class="col-span-full mt-12 flex flex-col gap-16 lg:col-span-8 lg:mt-0 lg:pt-1">
      <slot />
    </div>
  </section>
</template>
