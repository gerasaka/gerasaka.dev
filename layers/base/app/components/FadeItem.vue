<script lang="ts">
  import type { SlotsType, VNode } from 'vue';
  import { cloneVNode, Comment, defineComponent, inject } from 'vue';

  export default defineComponent({
    slots: Object as SlotsType<{ default: () => VNode[] }>,
    setup(_, { slots }) {
      const fadeIn = inject(FadeInKey);
      const delay = fadeIn ? fadeIn.next() : 0;

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

        return cloneVNode(vnode, {
          class: 'fade-in',
          style: { animationDelay: `${delay}ms` },
        });
      };
    },
  });
</script>
