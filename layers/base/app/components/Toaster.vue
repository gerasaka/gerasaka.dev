<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  /*
   * Mount once per app. Toasts stack like a deck and fan out on hover or focus,
   * pausing their timers. Lives in the top layer so it sits above open dialogs;
   * re-showing on each new toast moves it back above anything opened since.
   */
  const GAP = 8;
  const PEEK = 10;
  const VISIBLE = 3;

  const { toasts, dismiss, pause, resume } = useToast();
  const region = ref<HTMLElement>();
  const heights = ref<Record<number, number>>({});
  const expanded = ref(false);

  const newestFirst = computed(() => [...toasts.value].reverse());
  const frontHeight = computed(() => heights.value[newestFirst.value[0]?.id ?? -1] ?? 0);

  function offsetOf(index: number) {
    let offset = 0;
    for (const item of newestFirst.value.slice(0, index)) offset += (heights.value[item.id] ?? 0) + GAP;
    return offset;
  }

  const listHeight = computed(() => {
    const count = newestFirst.value.length;
    if (!count) return 0;
    if (expanded.value) return offsetOf(count - 1) + (heights.value[newestFirst.value[count - 1]!.id] ?? 0);
    return frontHeight.value + Math.min(count - 1, VISIBLE - 1) * PEEK;
  });

  function indexOf(id: number) {
    return newestFirst.value.findIndex((item) => item.id === id);
  }

  function styleOf(id: number) {
    const index = indexOf(id);
    const hidden = index >= VISIBLE;
    return {
      zIndex: newestFirst.value.length - index,
      height: `${expanded.value || index === 0 ? (heights.value[id] ?? 0) : frontHeight.value}px`,
      transform: expanded.value
        ? `translateY(-${offsetOf(index)}px)`
        : `translateY(-${index * PEEK}px) scale(${1 - index * 0.05})`,
      opacity: hidden ? 0 : 1,
      pointerEvents: hidden ? ('none' as const) : undefined,
    };
  }

  const observer = import.meta.client
    ? new ResizeObserver((entries) => {
      const next = { ...heights.value };
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        next[Number(el.dataset.id)] = el.offsetHeight;
      }
      heights.value = next;
    })
    : undefined;

  function measure(el: unknown) {
    if (el instanceof HTMLElement) observer?.observe(el);
  }

  function setExpanded(value: boolean) {
    if (expanded.value === value) return;
    expanded.value = value;
    if (value) pause();
    else resume();
  }

  function onFocusOut(event: FocusEvent) {
    if (!region.value?.contains(event.relatedTarget as Node | null)) setExpanded(false);
  }

  function raise() {
    if (!region.value) return;
    if (region.value.matches(':popover-open')) region.value.hidePopover();
    region.value.showPopover();
  }

  onMounted(raise);
  onBeforeUnmount(() => observer?.disconnect());
  watch(
    () => toasts.value.length,
    (length, previous) => {
      if (length > previous) nextTick(raise);
      if (!length) setExpanded(false);
    },
  );
</script>

<template>
  <section
    ref="region"
    popover="manual"
    aria-label="Notifications"
    class="inset-x-4 top-auto bottom-4 m-0 overflow-visible border-0 bg-transparent p-0 sm:left-auto sm:w-88"
    @pointerenter="setExpanded(true)"
    @pointerleave="setExpanded(false)"
    @focusin="setExpanded(true)"
    @focusout="onFocusOut"
  >
    <TransitionGroup
      tag="ol"
      role="status"
      aria-live="polite"
      class="relative transition-[height] duration-slow ease-out"
      :style="{ height: `${listHeight}px` }"
      enter-from-class="opacity-0 [translate:0_100%]"
      leave-to-class="opacity-0 [translate:0_50%]"
    >
      <li
        v-for="item in toasts"
        :key="item.id"
        class="toast absolute inset-x-0 bottom-0 origin-top overflow-hidden transition-[transform,translate,opacity,height] duration-slow ease-out"
        :style="styleOf(item.id)"
      >
        <div
          :ref="measure"
          :data-id="item.id"
          class="flex items-start gap-3 p-4 transition-opacity duration-base ease-out"
          :class="{ 'opacity-0': !expanded && indexOf(item.id) > 0 }"
        >
          <div class="min-w-0 flex-1">
            <p class="text-label">{{ item.title }}</p>
            <p v-if="item.description" class="text-caption mt-0.5">{{ item.description }}</p>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-icon btn-sm -m-1.5 text-muted"
            aria-label="Dismiss"
            @click="dismiss(item.id)"
          >
            &times;
          </button>
        </div>
      </li>
    </TransitionGroup>
  </section>
</template>
