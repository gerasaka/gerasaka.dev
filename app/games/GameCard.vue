<script lang="ts" setup>
  import type { Game } from '~/games/games';

  const { game } = defineProps<{ game: Game }>();
  const isExternal = computed(() => game.link.type === 'external');
  const wrapperElType = computed(() => (isExternal.value ? 'a' : resolveComponent('NuxtLink')));
  const wrapperProps = computed(() =>
    game.link.type === 'external'
      ? { href: game.link.url, target: '_blank', rel: 'noopener noreferrer' }
      : { to: game.link.to },
  );
</script>

<template>
  <component :is="wrapperElType" v-bind="wrapperProps" class="card flex flex-col gap-4">
    <div
      class="relative aspect-3/2 w-full rounded-br-[30%] overflow-hidden border border-[#f1f1f1]"
    >
      <div
        v-if="game.status === 'wip'"
        class="absolute top-0 left-0 z-10 rounded-br-[30%] bg-amber-500 text-white inline p-2"
      >
        WIP
      </div>

      <NuxtImg
        :src="game.preview.src"
        :alt="game.preview.alt"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>
    <div>
      <h2 class="font-pixel text-4xl">{{ game.name }}</h2>
      <p class="text-muted">{{ game.description }}</p>
    </div>
  </component>
</template>
