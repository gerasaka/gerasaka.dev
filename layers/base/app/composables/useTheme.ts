import { createSharedComposable, useColorMode } from '@vueuse/core';
import { computed, nextTick } from 'vue';

export const THEMES = ['light', 'dark', 'sepia'] as const;
export type Theme = (typeof THEMES)[number];

const useSharedColorMode = createSharedComposable(() =>
  useColorMode<Theme>({
    attribute: 'data-theme',
    storageKey: 'theme',
    initialValue: 'light',
  }),
);

export function useTheme() {
  const colorMode = useSharedColorMode();

  return computed<Theme>({
    get: () => {
      const value = colorMode.store.value as Theme;
      return THEMES.includes(value) ? value : 'light';
    },
    set: (value) => {
      const apply = async () => {
        colorMode.store.value = value;
        await nextTick();
      };

      if (!document.startViewTransition) {
        apply();
        return;
      }

      document.startViewTransition(apply);
    },
  });
}

export function nextTheme(theme: Theme): Theme {
  const index = THEMES.indexOf(theme);
  return THEMES[(index + 1) % THEMES.length]!;
}
