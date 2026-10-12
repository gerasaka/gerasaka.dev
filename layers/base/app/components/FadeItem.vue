<script lang="ts">
  import type { SlotsType, VNode } from 'vue';
  import { useNuxtApp } from '#app';
  import { cloneVNode, Comment, defineComponent, inject } from 'vue';

  export default defineComponent({
    slots: Object as SlotsType<{ default: () => VNode[] }>,
    setup(_, { slots }) {
      const fadeIn = inject(FadeInKey);
      /*
       * Only the first load (server render and its hydration) animates.
       * Client navigations get the view-transition crossfade, and items mounted
       * later (filters, v-if) appear immediately instead of animating twice.
       */
      const animate = import.meta.server || useNuxtApp().isHydrating;
      const delay = animate && fadeIn ? fadeIn.next() : 0;

      return () => {
        if (!slots.default) return null;

        const children = slots.default().filter((v) => v.type !== Comment);
        const vnode = children[0];

        if (!vnode) return null;

        if (import.meta.dev && children.length > 1) {
          throw new Error(
            '[FadeItem] Expected exactly one child; wrap siblings in a single element or give each its own <FadeItem>.',
          );
        }

        if (!animate) return vnode;

        return cloneVNode(vnode, {
          class: 'fade-in',
          style: { animationDelay: `${delay}ms` },
        });
      };
    },
  });
</script>
