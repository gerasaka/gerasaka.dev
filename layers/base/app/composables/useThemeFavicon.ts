const FAVICONS = {
  light: '/favicon.png',
  dark: '/favicon-dark.png',
  sepia: '/favicon-sepia.png',
  dev: '/favicon-dev.png',
  game: '/favicon-game.png',
} as const;

type FaviconName = keyof typeof FAVICONS;

const ROUTE_OVERRIDES: { prefix: string; icon: FaviconName }[] = [
  { prefix: '/games', icon: 'game' },
];

export function useThemeFavicon() {
  const theme = useTheme();
  const route = useRoute();

  useHead({
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: () => {
          if (import.meta.dev) return FAVICONS.dev;

          const override = ROUTE_OVERRIDES.find(({ prefix }) => route.path.startsWith(prefix));
          return override ? FAVICONS[override.icon] : FAVICONS[theme.value];
        },
      },
    ],
  });
}
