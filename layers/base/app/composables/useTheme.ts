import { createSharedComposable, useColorMode } from '@vueuse/core';
import { computed, nextTick } from 'vue';

export const THEMES = ['light', 'dark', 'sepia'] as const;
export type Theme = (typeof THEMES)[number];

const COOKIE_NAME = 'theme';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function cookieDomainAttr(): string {
  const host = window.location.hostname;
  return host === 'gerasaka.dev' || host.endsWith('.gerasaka.dev') ? '; domain=.gerasaka.dev' : '';
}

const cookieStorage = {
  getItem(key: string): string | null {
    if (typeof document === 'undefined') return null;

    const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
    return match ? decodeURIComponent(match[1]!) : null;
  },
  setItem(key: string, value: string): void {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax${cookieDomainAttr()}`;
  },
  removeItem(key: string): void {
    document.cookie = `${key}=; path=/; max-age=0${cookieDomainAttr()}`;
  },
};

const useSharedColorMode = createSharedComposable(() =>
  useColorMode<Theme>({
    attribute: 'data-theme',
    storage: cookieStorage,
    storageKey: COOKIE_NAME,
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
