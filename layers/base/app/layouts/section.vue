<script lang="ts" setup>
  const route = useRoute();
</script>

<template>
  <div class="section-layout lg:flex">
    <aside
      class="container-main pt-page lg:sticky lg:top-0 lg:m-0 lg:flex lg:h-svh lg:w-sidebar lg:max-w-none lg:shrink-0 lg:items-center lg:pt-0 lg:pr-0"
    >
      <SiteNavigation :active="route.meta.section" />
    </aside>

    <div class="section-content min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>

<style>
  @reference "#base/app/assets/styles/index.css";

  .section-layout {
    @variant lg {
      margin-inline: auto;
      max-width: calc(var(--spacing-sidebar) + 64rem + 2 * var(--spacing-gutter));
    }
  }

  .section-layout:has(.section-content > main > .container-wide) > aside {
    --container-size: 64rem;
  }

  .section-content > main > :is(.container-main, .container-wide) {
    @variant lg {
      margin-inline: 0;
    }
  }
</style>
