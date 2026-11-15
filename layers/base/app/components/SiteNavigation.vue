<script lang="ts" setup>
  import type { SectionKey, SiteKey } from '#base/app/types/site';

  const props = defineProps<{
    active?: SectionKey;
  }>();

  const site = useAppConfig().site.key as SiteKey;

  const ORIGINS: Record<SiteKey, string> = import.meta.dev
    ? { main: 'http://localhost:3000', tools: 'http://localhost:3001' }
    : { main: 'https://gerasaka.dev', tools: 'https://tools.gerasaka.dev' };

  const SECTIONS: { key: SectionKey; label: string; site: SiteKey; path: string }[] = [
    { key: 'writes', label: 'Writes', site: 'main', path: '/writes' },
    { key: 'games', label: 'Games', site: 'main', path: '/games' },
    { key: 'tools', label: 'Tools', site: 'tools', path: '/' },
  ];

  function resolve(target: SiteKey, path: string) {
    return target === site ? path : `${ORIGINS[target]}${path}`;
  }

  const home = computed(() => resolve('main', '/'));
  const items = computed(() =>
    SECTIONS.map((section) => ({
      ...section,
      to: resolve(section.site, section.path),
      current: section.key === props.active,
    })),
  );
</script>

<template>
  <nav
    aria-label="Site"
    class="site-navigation flex items-center gap-8 lg:flex-col lg:items-start lg:gap-10"
  >
    <NuxtLink
      :to="home"
      aria-label="Home"
      class="flex text-accent transition-[scale] duration-fast ease-glide active:scale-94"
    >
      <Icon name="grsk:logo" size="28" />
    </NuxtLink>

    <ul class="flex items-center gap-5 lg:flex-col lg:items-start lg:gap-3">
      <li v-for="(item, i) in items" :key="item.key" :style="{ '--i': i }">
        <NuxtLink
          :to="item.to"
          :data-current="item.current || undefined"
          class="item relative block text-sm text-muted transition-[color,translate] duration-base ease-snap hover:text-foreground data-current:font-medium data-current:text-foreground lg:hover:translate-x-1 lg:data-current:hover:translate-x-0"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>

    <ThemeToggle
      class="item-toggle ml-auto lg:absolute lg:bottom-8 lg:left-gutter lg:ml-0 lg:-translate-x-2"
      :style="{ '--i': items.length }"
    />
  </nav>
</template>

<style scoped>
  @reference "#base/app/assets/styles/index.css";

  .site-navigation {
    animation: rail-in var(--transition-duration-slow) var(--ease-glide) both;

    li,
    .item-toggle {
      animation: item-in var(--transition-duration-base) var(--ease-snap) both;
      animation-delay: calc(150ms + var(--i) * 60ms);
    }
  }

  .item::before {
    @apply absolute top-full left-0 mt-1 h-px w-0 bg-accent lg:top-1/2 lg:right-full lg:left-auto lg:mt-0 lg:mr-3;
    content: '';
    transition: width var(--transition-duration-base) var(--ease-snap);
  }

  .item[data-current]::before {
    @apply w-4;
  }

  @keyframes rail-in {
    from {
      opacity: 0;
    }
  }

  @keyframes item-in {
    from {
      opacity: 0;
      translate: --spacing(-1) 0;
      filter: blur(2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .site-navigation,
    .site-navigation li,
    .site-navigation .item-toggle {
      animation: none;
    }
  }
</style>
