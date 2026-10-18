<script lang="ts" setup>
  import { useColorMode } from '@vueuse/core';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import DesignExample from '~/design/DesignExample.vue';
  import DesignSection from '~/design/DesignSection.vue';
  import {
    BASE_COLORS,
    CONTAINERS,
    CORNERS,
    DURATIONS,
    EASINGS,
    ELEVATION,
    FONTS,
    PALETTE,
    RADII,
    SEMANTIC_COLOR_GROUPS,
    SEMANTIC_COLORS,
    SPACING,
    SPACING_DEMO,
    TYPE_STYLES,
    paletteVar,
  } from '~/design/tokens';
  import { useCssVars } from '~/design/useCssVars';
  import type { SemanticColor } from '~/design/tokens';
  import type { Scheme } from '~/design/useThemeColors';
  import { SCHEMES, contrastRatio, useThemeColors } from '~/design/useThemeColors';

  useSeoMeta({
    title: 'Design system · Gerry Julio',
    robots: 'noindex, nofollow',
  });

  const GROUPS = [
    {
      name: 'Foundations',
      sections: [
        { id: 'color', title: 'Color' },
        { id: 'typography', title: 'Typography' },
        { id: 'layout', title: 'Layout' },
        { id: 'shape', title: 'Shape' },
        { id: 'elevation', title: 'Elevation' },
        { id: 'motion', title: 'Motion' },
      ],
    },
    {
      name: 'Components',
      sections: [
        { id: 'actions', title: 'Actions' },
        { id: 'inputs', title: 'Inputs' },
        { id: 'feedback', title: 'Feedback' },
        { id: 'overlays', title: 'Overlays' },
        { id: 'navigation', title: 'Navigation' },
        { id: 'display', title: 'Display' },
        { id: 'disclosure', title: 'Disclosure' },
      ],
    },
  ];
  const SECTIONS = GROUPS.flatMap((group) => group.sections);

  /* The section crossing a band near the top of the viewport is the one being read. */
  const activeSection = ref<string>();
  let sectionObserver: IntersectionObserver | undefined;

  onMounted(() => {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) activeSection.value = entry.target.id;
      },
      { rootMargin: '-20% 0px -75% 0px' },
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    }
  });

  onBeforeUnmount(() => sectionObserver?.disconnect());

  function numberOf(id: string) {
    return String(SECTIONS.findIndex((section) => section.id === id) + 1).padStart(2, '0');
  }

  const paletteVars = PALETTE.flatMap((ramp) => ramp.steps.map((step) => paletteVar(ramp, step)));
  const vars = useCssVars([
    ...paletteVars,
    ...FONTS.map(({ token }) => `--font-${token}`),
    ...RADII.map(({ token }) => `--radius-${token}`),
    ...CORNERS.map(({ token }) => `--corner-${token}`),
    ...DURATIONS.map(({ token }) => `--transition-duration-${token}`),
    ...EASINGS.map(({ token }) => `--ease-${token}`),
  ]);

  const themeColors = useThemeColors(
    SEMANTIC_COLORS.map(({ token }) => token),
    [...BASE_COLORS, ...paletteVars],
  );

  function contrastOf(color: SemanticColor, scheme: Scheme) {
    if (!color.contrast) return undefined;
    const fg = themeColors.value[scheme][color.token]?.rgb;
    const bg = themeColors.value[scheme][color.contrast.on]?.rgb;
    if (!fg || !bg) return undefined;
    const ratio = contrastRatio(fg, bg);
    return { ratio: ratio.toFixed(1), pass: ratio >= color.contrast.min };
  }

  const THEME_MODES = ['auto', 'light', 'dark'] as const;
  const { store: themeMode } = useColorMode({ attribute: 'data-theme', storageKey: null });

  function familyOf(token: string) {
    return vars.value[`--font-${token}`]?.split(',')[0]?.replace(/['"]/g, '').trim();
  }

  const moved = ref(false);

  const chipPressed = ref(true);
  const sliderValue = ref(40);

  const copied = ref(false);
  function flashCopied() {
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  }

  const confirmDialog = ref<HTMLDialogElement>();
  const drawer = ref<HTMLDialogElement>();
  const { toast } = useToast();
  const TOAST_EXAMPLES = [
    { title: 'Copied to clipboard' },
    { title: 'Formatted', description: '128 lines, indented with 2 spaces.' },
    {
      title: 'Settings saved',
      description: 'Your preferences apply to every tool on this device.',
    },
  ];
  let toastCount = 0;

  function showToast() {
    const { title, description } = TOAST_EXAMPLES[toastCount++ % TOAST_EXAMPLES.length]!;
    toast(title, { description });
  }

  const TABS = ['Preview', 'Code', 'Notes'] as const;
  const activeTab = ref<(typeof TABS)[number]>('Preview');

  const PAGE_COUNT = 12;
  const page = ref(2);

  const TOOL_ROWS = [
    { name: 'XML Formatter', kind: 'web', runs: 1284, size: '18 KB' },
    { name: 'JSON Diff', kind: 'web', runs: 342, size: '24 KB' },
    { name: 'Log Grep', kind: 'cli', runs: 97, size: '6 KB' },
  ];
</script>

<template>
  <main class="min-h-svh">
    <div class="container-wide page">
      <FadeIn>
        <FadeItem>
          <NuxtLink to="/" class="btn btn-quiet"
            ><span aria-hidden="true">&larr;</span> Back</NuxtLink
          >
        </FadeItem>
        <FadeItem>
          <p class="text-overline mt-16">Gerasaka · Brand &amp; interface guidelines</p>
        </FadeItem>
        <FadeItem>
          <h1 class="hero-title mt-4 font-serif tracking-display text-balance">Design system</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-6 max-w-xl">
            Foundations and components shared across my projects. Every component is a utility class
            on plain HTML, so it works anywhere Tailwind does.
          </p>
        </FadeItem>
        <FadeItem>
          <nav
            class="sticky top-0 z-20 -mx-gutter mt-16 bg-surface px-gutter"
            aria-label="Sections"
          >
            <ol class="tabs">
              <li v-for="section in SECTIONS" :key="section.id">
                <a
                  :href="`#${section.id}`"
                  :aria-current="activeSection === section.id ? 'location' : undefined"
                  class="tab"
                >
                  <span class="font-mono text-xs">{{ numberOf(section.id) }}</span>
                  {{ section.title }}
                </a>
              </li>
            </ol>
          </nav>
        </FadeItem>

        <FadeItem>
          <div>
            <p class="text-overline mt-section">Foundations</p>

            <DesignSection
              id="color"
              :number="numberOf('color')"
              title="Color"
              description="Ink is the primary; blue is the single accent. Components only use semantic tokens, which point into the raw palette and resolve per theme. Each swatch shows light on the left, dark on the right."
            >
              <div
                class="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Theme preview"
              >
                <span class="text-caption mr-2">Preview</span>
                <button
                  v-for="mode in THEME_MODES"
                  :key="mode"
                  type="button"
                  class="chip capitalize"
                  :aria-pressed="themeMode === mode"
                  @click="themeMode = mode"
                >
                  {{ mode === 'auto' ? 'System' : mode }}
                </button>
              </div>

              <div v-for="group in SEMANTIC_COLOR_GROUPS" :key="group.name">
                <h3 class="text-overline border-b border-line pb-3">{{ group.name }}</h3>
                <ul class="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3">
                  <li v-for="color in group.colors" :key="color.token" class="flex flex-col gap-3">
                    <span
                      class="grid h-24 grid-cols-2 overflow-hidden rounded-md border border-line"
                    >
                      <span
                        v-for="scheme in SCHEMES"
                        :key="scheme"
                        :style="{
                          colorScheme: scheme,
                          background: `linear-gradient(var(--color-${color.token}), var(--color-${color.token})), var(--color-surface)`,
                        }"
                      />
                    </span>
                    <span class="flex min-w-0 flex-col">
                      <span class="font-mono text-sm">{{ color.token }}</span>
                      <span class="flex flex-wrap gap-x-3 font-mono text-xs text-muted">
                        <span v-for="scheme in SCHEMES" :key="scheme">
                          {{ themeColors[scheme][color.token]?.label ?? '…' }}
                          <span
                            v-if="contrastOf(color, scheme)"
                            :class="
                              contrastOf(color, scheme)?.pass ? 'text-success' : 'text-danger'
                            "
                          >
                            {{ contrastOf(color, scheme)?.ratio }}
                          </span>
                        </span>
                      </span>
                      <span class="text-caption">{{ color.usage }}</span>
                    </span>
                  </li>
                </ul>
              </div>

              <p class="text-caption max-w-prose">
                Contrast ratios are measured live against surface (on-foreground against
                foreground). Green meets WCAG AA: 4.5 for text, 3 for marks and outlines.
              </p>

              <div class="flex flex-col gap-5">
                <h3 class="text-overline border-b border-line pb-3">Palette</h3>
                <div v-for="ramp in PALETTE" :key="ramp.name" class="flex flex-col gap-2">
                  <span class="flex items-baseline gap-3">
                    <span class="font-mono text-sm">{{ ramp.name }}</span>
                    <span class="text-caption">{{ ramp.role }}</span>
                  </span>
                  <ul class="grid grid-cols-11 overflow-hidden rounded-md border border-line">
                    <li
                      v-for="step in ramp.steps"
                      :key="step"
                      class="h-10"
                      :title="`${ramp.name}-${step} · ${vars[paletteVar(ramp, step)] ?? ''}`"
                      :style="{ background: `var(${paletteVar(ramp, step)})` }"
                    />
                  </ul>
                  <ul class="grid grid-cols-11 font-mono text-xs text-muted">
                    <li v-for="step in ramp.steps" :key="step" class="flex flex-col">
                      <span class="text-foreground">{{ step }}</span>
                      <span class="hidden xl:inline">{{
                        vars[paletteVar(ramp, step)]?.slice(1)
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </DesignSection>

            <DesignSection
              id="typography"
              :number="numberOf('typography')"
              title="Typography"
              description="A small set of named styles. The serif is for editorial moments: page titles and section headings. Interface text, including UI headings, uses the sans. Title and heading scale fluidly from phone to desktop; resize to see it."
            >
              <ul class="grid gap-x-6 gap-y-12 sm:grid-cols-2">
                <li
                  v-for="font in FONTS"
                  :key="font.token"
                  class="flex flex-col border-t border-line pt-4"
                >
                  <span class="flex items-baseline justify-between gap-4">
                    <span class="text-label">{{ familyOf(font.token) ?? font.token }}</span>
                    <span class="font-mono text-xs text-muted">{{ font.utility }}</span>
                  </span>
                  <span :class="font.utility" class="mt-6 text-8xl leading-none" aria-hidden="true"
                    >Aa</span
                  >
                  <span :class="font.utility" class="text-caption mt-6 break-all">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                  </span>
                  <span class="text-caption mt-2">{{ font.usage }}</span>
                </li>
              </ul>

              <ul class="flex flex-col divide-y divide-line border-t border-line">
                <li
                  v-for="style in TYPE_STYLES"
                  :key="style.utility"
                  class="flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:gap-8"
                >
                  <span class="flex w-40 shrink-0 flex-col gap-1">
                    <span class="font-mono text-sm">{{ style.utility }}</span>
                    <span class="text-caption">{{ style.usage }}</span>
                  </span>
                  <span :class="style.utility">{{ style.sample }}</span>
                </li>
              </ul>

              <DesignExample
                name="hr · kbd · ::selection"
                note="Plain elements, styled by default with no class. Inline code is styled only inside prose-write, where articles live."
              >
                <hr />
                <p class="text-body">
                  Press <kbd>⌘</kbd> <kbd>Enter</kbd> to format, or <kbd>Esc</kbd> to close. Select
                  this text to see the selection color.
                </p>
              </DesignExample>

              <DesignExample
                name="prose-write"
                note="Long-form content from Markdown. Every color the typography plugin uses is remapped to theme tokens, so articles follow dark mode."
              >
                <div class="prose-write">
                  <h3>A heading inside an article</h3>
                  <p>
                    Body text runs a step softer than headings, so <strong>bold</strong> and
                    <em>emphasis</em> still stand out. Inline <code>code</code> sits on a subtle
                    tint, and <a href="#typography">links</a> use the accent.
                  </p>
                  <blockquote>A quote is set apart with a rule, not a box.</blockquote>
                </div>
              </DesignExample>
            </DesignSection>

            <DesignSection
              id="layout"
              :number="numberOf('layout')"
              title="Layout"
              description="Tailwind's 4px scale for components, plus three fluid steps for page rhythm that grow between 375px and 1024px viewports. Containers set the content width; gutters sit outside it."
            >
              <div>
                <h3 class="text-overline border-b border-line pb-3">Spacing</h3>
                <div class="mt-8 rounded-md border border-line p-5 sm:p-6" aria-hidden="true">
                  <div v-for="(row, index) in SPACING_DEMO" :key="index" class="spacing-row">
                    <template v-if="row.kind === 'gap'">
                      <span class="block bg-accent/20" :style="{ height: row.size }" />
                      <span
                        class="flex h-0 items-center font-mono text-xs leading-none whitespace-nowrap text-accent-strong"
                      >
                        {{ row.label }}
                      </span>
                    </template>
                    <template v-else>
                      <span
                        v-if="row.kind === 'label'"
                        class="block h-2.5 w-20 rounded-sm bg-foreground/60"
                      />
                      <span
                        v-else-if="row.kind === 'field'"
                        class="block h-9 rounded-md border border-line-strong"
                      />
                      <span
                        v-else-if="row.kind === 'card'"
                        class="block h-11 rounded-md border border-line bg-surface-subtle"
                      />
                      <span
                        v-else-if="row.kind === 'heading'"
                        class="block h-4 w-2/5 rounded-sm bg-foreground/80"
                      />
                      <span v-else class="flex flex-col gap-1.5">
                        <span class="block h-2 rounded-sm bg-foreground/25" />
                        <span class="block h-2 w-4/5 rounded-sm bg-foreground/25" />
                      </span>
                      <span />
                    </template>
                  </div>
                </div>

                <table class="data-table mt-8">
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Phone</th>
                      <th>Desktop</th>
                      <th class="hidden sm:table-cell">Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="space in SPACING" :key="space.utility">
                      <td class="font-mono">{{ space.utility }}</td>
                      <td class="font-mono text-muted">{{ space.phone }}</td>
                      <td
                        class="font-mono"
                        :class="{ 'text-muted': space.phone === space.desktop }"
                      >
                        {{ space.desktop }}
                      </td>
                      <td class="text-caption hidden sm:table-cell">{{ space.usage }}</td>
                    </tr>
                  </tbody>
                </table>
                <p class="text-caption mt-4 max-w-prose">
                  Tinted bands are the gaps, drawn at their real size. The three named steps grow
                  with the viewport, highlighted where they change. The * stands for any spacing
                  utility: mt-section, py-page, px-gutter.
                </p>
              </div>

              <div>
                <h3 class="text-overline border-b border-line pb-3">Containers</h3>
                <div class="mt-6 flex flex-col gap-2">
                  <div
                    v-for="container in [...CONTAINERS].reverse()"
                    :key="container.utility"
                    class="flex"
                    :style="{ width: container.ratio }"
                  >
                    <span class="w-4 shrink-0 bg-accent/20 sm:w-6" aria-hidden="true" />
                    <span
                      class="flex flex-1 items-baseline justify-between gap-4 border border-foreground px-3 py-2"
                    >
                      <span class="font-mono text-sm">{{ container.utility }}</span>
                      <span class="font-mono text-xs text-muted">{{ container.width }}</span>
                    </span>
                    <span class="w-4 shrink-0 bg-accent/20 sm:w-6" aria-hidden="true" />
                  </div>
                </div>
                <dl class="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <div
                    v-for="container in [...CONTAINERS].reverse()"
                    :key="container.utility"
                    class="flex flex-col gap-0.5"
                  >
                    <dt class="font-mono text-sm">{{ container.utility }}</dt>
                    <dd class="text-caption">{{ container.usage }}</dd>
                  </div>
                </dl>
                <p class="text-caption mt-4 max-w-prose">
                  Drawn to scale. Each centers itself; the tinted bands are the gutters, 32px on
                  phones to 80px on desktop, added outside the content width and never under a
                  phone's notch. Pair a container with page for the vertical padding.
                </p>
              </div>
            </DesignSection>

            <DesignSection
              id="shape"
              :number="numberOf('shape')"
              title="Shape"
              description="Corners are near-square everywhere: two radii cover every component. A single squircle corner is the signature shape, used rarely enough to stay special."
            >
              <div>
                <h3 class="text-overline border-b border-line pb-3">Radius</h3>
                <ul class="mt-8 grid grid-cols-2 gap-4">
                  <li v-for="radius in RADII" :key="radius.token" class="flex flex-col gap-3">
                    <span
                      class="relative h-16 border border-line bg-surface-subtle"
                      :style="{ borderRadius: `var(--radius-${radius.token})` }"
                    >
                      <span
                        class="absolute top-2 right-2 size-10 overflow-hidden rounded-sm border border-line bg-surface"
                      >
                        <span
                          class="absolute top-0 right-0 block size-24 border border-line-strong bg-surface-subtle"
                          :style="{ borderRadius: `calc(var(--radius-${radius.token}) * 8)` }"
                        />
                        <span
                          class="zoom-label absolute bottom-0.5 left-1 font-mono leading-none text-muted"
                          >8×</span
                        >
                      </span>
                    </span>
                    <span class="flex flex-col">
                      <span class="font-mono text-sm">
                        rounded-{{ radius.token }} · {{ vars[`--radius-${radius.token}`] }}
                      </span>
                      <span class="text-caption">{{ radius.usage }}</span>
                    </span>
                  </li>
                </ul>
                <p class="text-caption mt-4 max-w-prose">
                  The radius is felt more than seen. The inset magnifies each corner 8×: sm is half
                  the curve of md, so small marks and large cards feel equally soft. rounded-full
                  stays for pills and dots.
                </p>
              </div>

              <div>
                <h3 class="text-overline border-b border-line pb-3">
                  Signature corner · accent only
                </h3>
                <ul class="mt-8 grid grid-cols-3 gap-4">
                  <li v-for="corner in CORNERS" :key="corner.token" class="flex flex-col gap-3">
                    <span class="flex items-end gap-3">
                      <span
                        class="aspect-3/2 flex-1 border border-line bg-surface-subtle"
                        :class="corner.utility"
                      />
                      <span
                        class="size-10 shrink-0 border border-line bg-surface-subtle"
                        :class="corner.utility"
                      />
                    </span>
                    <span class="flex flex-col">
                      <span class="font-mono text-sm"
                        >{{ corner.utility }} · {{ vars[`--corner-${corner.token}`] }}</span
                      >
                      <span class="text-caption">{{ corner.usage }}</span>
                    </span>
                  </li>
                </ul>
                <p class="text-caption mt-4 max-w-prose">
                  The one soft shape on a square grid, so it only works if it's rare: one per page,
                  on a featured image or cover card. Never on buttons, fields, or repeated cards.
                  Sized relative to the element, so it reads as intentional at any size. squircle
                  applies the same corner shape to an element's existing radius.
                </p>
              </div>
            </DesignSection>

            <DesignSection
              id="elevation"
              :number="numberOf('elevation')"
              title="Elevation"
              description="Three levels of height. Flat is the default; raise something only when it should stand forward. Each level pairs a surface with a shadow, so dark mode stays legible: surfaces get lighter as they rise."
            >
              <ul class="grid gap-6 sm:grid-cols-3">
                <li v-for="level in ELEVATION" :key="level.name" class="flex flex-col gap-4">
                  <div
                    class="flex h-36 flex-col justify-between rounded-md p-5"
                    :class="level.className"
                  >
                    <span class="font-mono text-xs text-muted">Level {{ level.level }}</span>
                    <span class="text-subheading">{{ level.name }}</span>
                  </div>
                  <span class="flex flex-col gap-1">
                    <span class="font-mono text-sm">{{ level.utility }}</span>
                    <span class="text-caption">{{ level.usage }}</span>
                  </span>
                </li>
              </ul>

              <div>
                <h3 class="text-overline border-b border-line pb-3">Stacking</h3>
                <div class="relative mt-8 h-80 sm:h-72" aria-hidden="true">
                  <div class="stack-flat card absolute flex h-44 flex-col gap-2">
                    <span class="font-mono text-xs text-muted">Level 0 · flat</span>
                    <span class="text-caption">On the page. No shadow.</span>
                  </div>
                  <div
                    class="stack-raised elevation-raised absolute flex h-40 flex-col justify-between rounded-md p-5"
                  >
                    <span class="font-mono text-xs text-muted">Level 1 · raised</span>
                    <span class="text-caption max-w-48"
                      >Stands forward and casts a soft shadow.</span
                    >
                  </div>
                  <div
                    class="elevation-overlay absolute top-36 right-0 w-44 rounded-md p-1 sm:w-52"
                  >
                    <span class="block px-2.5 pt-1.5 pb-1 font-mono text-xs text-muted"
                      >Level 2 · overlay</span
                    >
                    <span class="menu-item">Duplicate</span>
                    <span class="menu-item">Copy link</span>
                    <span class="menu-item text-danger">Delete</span>
                  </div>
                </div>
                <p class="text-caption mt-4 max-w-prose">
                  Higher levels always sit on top, and each casts a deeper shadow than the one
                  below. In dark mode the page is gray-900 rather than black, so there's room for
                  shadows to show.
                </p>
              </div>
            </DesignSection>

            <DesignSection
              id="motion"
              :number="numberOf('motion')"
              title="Motion"
              description="Three durations and three easings, with no ease-in: it delays the first frames, the moment people watch most. Exits are always faster than their entrance. Under reduced motion, movement goes; fades and color changes stay."
            >
              <DesignExample
                name="duration-* · ease-*"
                note="Same start signal on every track. Durations share ease-glide; easings share a slowed 1s step so the curve shows."
              >
                <ul class="flex flex-col gap-4">
                  <li
                    v-for="duration in DURATIONS"
                    :key="duration.token"
                    class="flex flex-col gap-2"
                  >
                    <span class="flex flex-wrap items-baseline gap-x-3">
                      <span class="font-mono text-sm">duration-{{ duration.token }}</span>
                      <span class="text-caption">
                        {{ vars[`--transition-duration-${duration.token}`] }} · {{ duration.usage }}
                      </span>
                    </span>
                    <span class="track" :data-moved="moved || undefined" aria-hidden="true">
                      <span
                        class="track-dot bg-foreground"
                        :style="{
                          transitionDuration: `var(--transition-duration-${duration.token})`,
                          transitionTimingFunction: 'var(--ease-glide)',
                        }"
                      />
                    </span>
                  </li>
                  <li v-for="easing in EASINGS" :key="easing.token" class="flex flex-col gap-2">
                    <span class="flex flex-wrap items-baseline gap-x-3">
                      <span class="font-mono text-sm">ease-{{ easing.token }}</span>
                      <span class="text-caption">{{ easing.usage }}</span>
                    </span>
                    <span class="track" :data-moved="moved || undefined" aria-hidden="true">
                      <span
                        class="track-dot bg-accent duration-1000"
                        :style="{ transitionTimingFunction: `var(--ease-${easing.token})` }"
                      />
                    </span>
                  </li>
                </ul>
                <div>
                  <button type="button" class="btn btn-outline btn-sm" @click="moved = !moved">
                    {{ moved ? 'Reset' : 'Play' }}
                  </button>
                </div>
              </DesignExample>

              <DesignExample
                name="motion-pop · motion-backdrop · motion-collapse · fade-in"
                note="Behaviors built on the tokens, all CSS. Pop and backdrop drive dialogs and popovers: scale from 0.96, fade, exit faster than enter. Collapse animates details open and shut. Fade-in staggers page content once on first load."
              >
                <div class="flex flex-wrap gap-2">
                  <a href="#overlays" class="chip">See overlays</a>
                  <a href="#disclosure" class="chip">See disclosure</a>
                </div>
              </DesignExample>
            </DesignSection>

            <p class="text-overline mt-section">Components</p>

            <DesignSection
              id="actions"
              :number="numberOf('actions')"
              title="Actions"
              description="Things people click. Buttons do something, links go somewhere, chips filter, select, or remove."
            >
              <DesignExample name="btn · btn-outline · btn-ghost · btn-quiet">
                <div class="flex flex-wrap items-center gap-3">
                  <button type="button" class="btn">Save</button>
                  <button type="button" class="btn btn-outline">Cancel</button>
                  <button type="button" class="btn btn-ghost">Skip</button>
                  <button type="button" class="btn btn-quiet">Restart</button>
                </div>
              </DesignExample>

              <DesignExample
                name="btn-accent · btn-danger"
                note="Tones shared with badge, callout, and progress. A solid accent button is the screen's primary action."
              >
                <div class="flex flex-wrap items-center gap-3">
                  <button type="button" class="btn btn-accent">Continue</button>
                  <button type="button" class="btn btn-outline btn-accent">Continue</button>
                  <button type="button" class="btn btn-ghost btn-accent">Continue</button>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <button type="button" class="btn btn-danger">Delete</button>
                  <button type="button" class="btn btn-outline btn-danger">Delete</button>
                  <button type="button" class="btn btn-ghost btn-danger">Delete</button>
                </div>
              </DesignExample>

              <DesignExample name="btn-sm · btn-lg · btn-icon">
                <div class="flex flex-wrap items-center gap-3">
                  <button type="button" class="btn btn-sm">Small</button>
                  <button type="button" class="btn">Default</button>
                  <button type="button" class="btn btn-lg">Large</button>
                  <button type="button" class="btn btn-outline btn-icon" aria-label="Add">
                    <Icon name="mage:plus" />
                  </button>
                  <button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Close">
                    <Icon name="mage:multiply" />
                  </button>
                </div>
              </DesignExample>

              <DesignExample name="aria-busy · disabled">
                <div class="flex flex-wrap items-center gap-3">
                  <button type="button" class="btn" aria-busy="true">Saving</button>
                  <button type="button" class="btn btn-outline" aria-busy="true">Loading</button>
                  <button type="button" class="btn" disabled>Disabled</button>
                  <button type="button" class="btn btn-quiet" disabled>Pause</button>
                </div>
              </DesignExample>

              <DesignExample
                name="link"
                note="Inline links outside prose. Always underlined: color alone doesn't mark a link."
              >
                <p class="text-body">
                  Read the <a href="#actions" class="link">release notes</a> before you upgrade.
                </p>
              </DesignExample>

              <DesignExample
                name="chip · chip-sm · aria-pressed · checkbox · remove"
                note="Labels people act on. Read-only status stays a badge."
              >
                <div class="flex flex-wrap items-center gap-2">
                  <a href="#actions" class="chip">Link</a>
                  <button
                    type="button"
                    class="chip"
                    :aria-pressed="chipPressed"
                    @click="chipPressed = !chipPressed"
                  >
                    Toggle
                  </button>
                  <label class="chip">
                    <input type="checkbox" checked />
                    Checkbox
                  </label>
                  <span class="chip">
                    vue
                    <button type="button" aria-label="Remove vue">
                      <span aria-hidden="true">&#x2715;</span>
                    </button>
                  </span>
                  <button type="button" class="chip" disabled>Disabled</button>
                  <button type="button" class="chip chip-sm">Small</button>
                </div>
              </DesignExample>
            </DesignSection>

            <DesignSection
              id="inputs"
              :number="numberOf('inputs')"
              title="Inputs"
              description="Native controls, restyled. Every one keeps its built-in keyboard behavior and works in a plain form."
            >
              <DesignExample
                name="form-item · field · form-error"
                note="16px text on small screens stops iOS zooming in on focus. Link hints and errors with aria-describedby."
              >
                <div class="grid gap-6 sm:grid-cols-2">
                  <div class="form-item">
                    <label for="demo-name" class="text-label">Name</label>
                    <input
                      id="demo-name"
                      type="text"
                      class="field"
                      placeholder="Ada Lovelace"
                      aria-describedby="demo-name-hint"
                    />
                    <span id="demo-name-hint" class="text-caption">Shown on your profile.</span>
                  </div>
                  <div class="form-item">
                    <label for="demo-email" class="text-label">Email</label>
                    <input
                      id="demo-email"
                      type="email"
                      class="field"
                      value="ada@"
                      aria-invalid="true"
                      aria-describedby="demo-email-error"
                    />
                    <span id="demo-email-error" class="form-error"
                      >Enter a full email address.</span
                    >
                  </div>
                  <div class="form-item">
                    <label for="demo-format" class="text-label">Format</label>
                    <select id="demo-format" class="field">
                      <option>XML</option>
                      <option>JSON</option>
                      <option>YAML</option>
                    </select>
                  </div>
                  <div class="form-item">
                    <label for="demo-disabled" class="text-label">Disabled</label>
                    <input
                      id="demo-disabled"
                      type="text"
                      class="field"
                      value="Read only"
                      disabled
                    />
                  </div>
                  <div class="form-item sm:col-span-2">
                    <label for="demo-notes" class="text-label">Notes</label>
                    <textarea
                      id="demo-notes"
                      class="field h-24 resize-y"
                      placeholder="Anything else?"
                    />
                  </div>
                </div>
              </DesignExample>

              <DesignExample name="checkbox · radio · switch">
                <div class="grid gap-6 sm:grid-cols-3">
                  <fieldset class="flex flex-col gap-3">
                    <legend class="text-caption mb-3">Checkbox</legend>
                    <label class="text-label flex items-center gap-2">
                      <input type="checkbox" class="checkbox" checked /> Wrap lines
                    </label>
                    <label class="text-label flex items-center gap-2">
                      <input type="checkbox" class="checkbox" /> Sort keys
                    </label>
                    <label class="text-label flex items-center gap-2">
                      <input type="checkbox" class="checkbox" :indeterminate="true" /> Some selected
                    </label>
                  </fieldset>
                  <fieldset class="flex flex-col gap-3">
                    <legend class="text-caption mb-3">Radio</legend>
                    <label class="text-label flex items-center gap-2">
                      <input type="radio" name="demo-indent" class="radio" checked /> 2 spaces
                    </label>
                    <label class="text-label flex items-center gap-2">
                      <input type="radio" name="demo-indent" class="radio" /> 4 spaces
                    </label>
                    <label class="text-label flex items-center gap-2">
                      <input type="radio" name="demo-indent" class="radio" disabled /> Tabs
                    </label>
                  </fieldset>
                  <fieldset class="flex flex-col gap-3">
                    <legend class="text-caption mb-3">Switch</legend>
                    <label class="text-label flex items-center gap-2">
                      <input type="checkbox" role="switch" class="switch" checked /> Auto format
                    </label>
                    <label class="text-label flex items-center gap-2">
                      <input type="checkbox" role="switch" class="switch" /> Minify
                    </label>
                  </fieldset>
                </div>
              </DesignExample>

              <DesignExample
                name="slider"
                note="Firefox fills the track up to the value on its own; other browsers read --slider-fill, set from the value."
              >
                <div class="form-item max-w-sm">
                  <span class="flex items-baseline justify-between">
                    <label for="demo-volume" class="text-label">Volume</label>
                    <span class="text-caption tabular-nums">{{ sliderValue }}%</span>
                  </span>
                  <input
                    id="demo-volume"
                    v-model.number="sliderValue"
                    type="range"
                    class="slider"
                    :style="{ '--slider-fill': `${sliderValue}%` }"
                  />
                </div>
              </DesignExample>
            </DesignSection>

            <DesignSection
              id="feedback"
              :number="numberOf('feedback')"
              title="Feedback"
              description="How the interface reports back: messages that stay, labels for state, progress while something loads, and confirmations that come and go."
            >
              <DesignExample
                name="callout · callout-danger · callout-warning · callout-success · callout-info"
                note="Each carries an icon so meaning never rides on the tint alone. Messages that come and go, like Copied, are toasts, not callouts."
              >
                <ul class="flex flex-col gap-2">
                  <li class="callout callout-danger">Couldn't parse the XML. Check line 4.</li>
                  <li class="callout callout-warning">Large input, formatting may be slow.</li>
                  <li class="callout callout-success">All 12 files are valid.</li>
                  <li class="callout callout-info">
                    <strong class="font-medium">Runs in your browser</strong>
                    <span class="text-muted"
                      >Formatting happens locally. Nothing you paste is uploaded or stored.</span
                    >
                  </li>
                </ul>
              </DesignExample>

              <DesignExample
                name="badge · badge-accent · badge-danger · badge-warning · badge-success · badge-info"
                note="Read-only labels for state and counts. If people can click it, it's a chip."
              >
                <div class="flex flex-wrap items-center gap-2">
                  <span class="badge">Draft</span>
                  <span class="badge badge-accent">New</span>
                  <span class="badge badge-danger">Failed</span>
                  <span class="badge badge-warning">Beta</span>
                  <span class="badge badge-success">Live</span>
                  <span class="badge badge-info">3 updates</span>
                </div>
              </DesignExample>

              <DesignExample
                name="progress · progress-accent · progress-success · progress-danger · spinner"
                note="A progress element with a value fills to it; without one it sweeps. The spinner takes its size and color from the text around it."
              >
                <div class="flex max-w-md flex-col gap-4">
                  <progress class="progress" value="60" max="100" aria-label="Upload progress" />
                  <progress
                    class="progress progress-accent"
                    value="35"
                    max="100"
                    aria-label="Sync progress"
                  />
                  <progress
                    class="progress progress-success"
                    value="100"
                    max="100"
                    aria-label="Build complete"
                  />
                  <progress
                    class="progress progress-danger"
                    value="80"
                    max="100"
                    aria-label="Storage used"
                  />
                  <progress class="progress" aria-label="Loading" />
                </div>
                <div class="flex flex-wrap items-center gap-6">
                  <span role="status" class="text-caption inline-flex items-center gap-2">
                    <span class="spinner" /> Loading posts
                  </span>
                  <span role="status" class="text-heading inline-flex items-center gap-3">
                    <span class="spinner" /> Larger
                  </span>
                </div>
              </DesignExample>

              <DesignExample
                name="skeleton · skeleton-text"
                note="Placeholders in the shape of what's loading. Hide them from assistive tech and mark the region aria-busy."
              >
                <div class="card flex max-w-md gap-4" aria-hidden="true">
                  <span class="skeleton size-12 shrink-0" />
                  <span class="flex flex-1 flex-col">
                    <span class="skeleton-text" />
                    <span class="skeleton-text" />
                    <span class="skeleton-text" />
                  </span>
                </div>
              </DesignExample>

              <DesignExample
                name="useToast() · <Toaster />"
                note="Short confirmations of something that just happened. New toasts stack like a deck; hover or focus the stack to fan it out and pause the timers. Announced politely to screen readers. Mount the Toaster once per app."
              >
                <div>
                  <button type="button" class="btn btn-outline" @click="showToast">
                    Show toast
                  </button>
                </div>
              </DesignExample>
            </DesignSection>

            <DesignSection
              id="overlays"
              :number="numberOf('overlays')"
              title="Overlays"
              description="Layers above the page, built on native dialog and popover. Focus, Escape, and outside clicks come from the browser, not script."
            >
              <DesignExample
                name="dialog"
                note="Open with showModal(); close with a button in a method=dialog form. closedby=any also closes it on a backdrop click."
              >
                <div>
                  <button type="button" class="btn btn-danger" @click="confirmDialog?.showModal()">
                    Delete file
                  </button>
                </div>
                <dialog
                  ref="confirmDialog"
                  class="dialog"
                  closedby="any"
                  aria-labelledby="demo-dialog-title"
                >
                  <h3 id="demo-dialog-title" class="text-subheading">Delete config.xml?</h3>
                  <p class="text-body mt-2 text-muted">
                    This removes the file from your workspace. You can't undo this.
                  </p>
                  <form method="dialog" class="mt-6 flex justify-end gap-2">
                    <button class="btn btn-ghost">Cancel</button>
                    <button class="btn btn-danger" @click="toast('config.xml deleted')">
                      Delete
                    </button>
                  </form>
                </dialog>
              </DesignExample>

              <DesignExample
                name="dialog-drawer"
                note="A dialog pinned to the right edge that settles in like a sheet. For navigation, settings, and filters on small screens."
              >
                <div>
                  <button type="button" class="btn btn-outline" @click="drawer?.showModal()">
                    Settings
                  </button>
                </div>
                <dialog
                  ref="drawer"
                  class="dialog-drawer flex-col gap-6 open:flex"
                  closedby="any"
                  aria-labelledby="demo-drawer-title"
                >
                  <div class="flex items-center justify-between">
                    <h3 id="demo-drawer-title" class="text-subheading">Settings</h3>
                    <form method="dialog">
                      <button class="btn btn-ghost btn-icon btn-sm" aria-label="Close">
                        &times;
                      </button>
                    </form>
                  </div>
                  <label class="text-label flex items-center justify-between gap-2">
                    Auto format <input type="checkbox" role="switch" class="switch" checked />
                  </label>
                  <label class="text-label flex items-center justify-between gap-2">
                    Wrap lines <input type="checkbox" role="switch" class="switch" />
                  </label>
                  <hr />
                  <p class="text-caption">Settings are saved in this browser.</p>
                </dialog>
              </DesignExample>

              <DesignExample
                name="popover · menu-item"
                note="Anchors below its trigger and flips above when there's no room; centered where anchor positioning isn't supported."
              >
                <div>
                  <button type="button" class="btn btn-outline" popovertarget="demo-menu">
                    Options
                  </button>
                  <div id="demo-menu" popover class="popover">
                    <button
                      type="button"
                      class="menu-item"
                      popovertarget="demo-menu"
                      @click="toast('Duplicated')"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      class="menu-item"
                      popovertarget="demo-menu"
                      @click="toast('Link copied')"
                    >
                      Copy link
                    </button>
                    <button type="button" class="menu-item" disabled>Move</button>
                    <hr class="my-1" />
                    <button type="button" class="menu-item text-danger" popovertarget="demo-menu">
                      Delete
                    </button>
                  </div>
                </div>
              </DesignExample>

              <DesignExample
                name="tooltip · data-tooltip · data-tooltip-open"
                note="Supplementary only: the element keeps its own accessible name, and touch screens can't hover. Waits before showing on hover; data-tooltip-open holds it open at once, to confirm an action."
              >
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="btn btn-ghost btn-icon tooltip"
                    aria-label="Download"
                    data-tooltip="Download"
                  >
                    &darr;
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-icon tooltip"
                    aria-label="Copy"
                    :data-tooltip="copied ? 'Copied!' : 'Copy'"
                    :data-tooltip-open="copied || undefined"
                    @click="flashCopied"
                  >
                    &#x2398;
                  </button>
                </div>
              </DesignExample>
            </DesignSection>

            <DesignSection
              id="navigation"
              :number="numberOf('navigation')"
              title="Navigation"
              description="Ways to move around: between views on a page, up through a hierarchy, and across long lists. The section bar at the top of this page is tabs."
            >
              <DesignExample
                name="tabs · tab"
                note="Links with aria-current for page or section navigation, like this page's bar. For panels switched in place, use role=tab with aria-selected and add arrow-key handling from script."
              >
                <div>
                  <div class="tabs" role="tablist" aria-label="Example">
                    <button
                      v-for="tab in TABS"
                      :id="`demo-tab-${tab}`"
                      :key="tab"
                      type="button"
                      role="tab"
                      class="tab"
                      :aria-selected="activeTab === tab"
                      :aria-controls="`demo-panel-${tab}`"
                      @click="activeTab = tab"
                    >
                      {{ tab }}
                    </button>
                  </div>
                  <div
                    :id="`demo-panel-${activeTab}`"
                    role="tabpanel"
                    :aria-labelledby="`demo-tab-${activeTab}`"
                    class="text-body pt-4"
                  >
                    {{ activeTab }} panel.
                  </div>
                </div>
              </DesignExample>

              <DesignExample
                name="breadcrumb"
                note="On an ol inside a nav labeled Breadcrumb. The last item is the current page; separators are hidden from screen readers."
              >
                <nav aria-label="Breadcrumb">
                  <ol class="breadcrumb">
                    <li><a href="#navigation">Home</a></li>
                    <li><a href="#navigation">Writes</a></li>
                    <li><span aria-current="page">Declarative isn't about abstraction</span></li>
                  </ol>
                </nav>
              </DesignExample>

              <DesignExample
                name="pagination"
                note="Links or buttons inside a nav labeled Pagination. aria-current marks the page; a plain span is the gap."
              >
                <nav aria-label="Pagination">
                  <div class="pagination">
                    <button type="button" :disabled="page === 1" @click="page--">
                      <span aria-hidden="true">&larr;</span> Prev
                    </button>
                    <button
                      v-for="n in [1, 2, 3]"
                      :key="n"
                      type="button"
                      :aria-current="page === n ? 'page' : undefined"
                      @click="page = n"
                    >
                      {{ n }}
                    </button>
                    <span>…</span>
                    <button
                      type="button"
                      :aria-current="page === PAGE_COUNT ? 'page' : undefined"
                      @click="page = PAGE_COUNT"
                    >
                      {{ PAGE_COUNT }}
                    </button>
                    <button type="button" :disabled="page === PAGE_COUNT" @click="page++">
                      Next <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </nav>
              </DesignExample>
            </DesignSection>

            <DesignSection
              id="display"
              :number="numberOf('display')"
              title="Display"
              description="Containers for content: cards to group it, tables to compare it."
            >
              <DesignExample
                name="card · card-link"
                note="card-link rises from flat to raised on hover, only with a real pointer, so touch screens don't get stuck hovered."
              >
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="card flex flex-col gap-1">
                    <span class="text-subheading">Static card</span>
                    <span class="text-caption">Groups related content. No hover.</span>
                  </div>
                  <a href="#display" class="card card-link flex flex-col gap-1">
                    <span class="text-subheading">Link card</span>
                    <span class="text-caption"
                      >The whole card is clickable. Hover to see it rise.</span
                    >
                  </a>
                </div>
              </DesignExample>

              <DesignExample
                name="data-table"
                note="Named data-table because Tailwind's table sets display. Right-align numbers so digits line up; wrap wide tables in overflow-x-auto."
              >
                <div class="overflow-x-auto">
                  <table class="data-table">
                    <caption>
                      Tools this month
                    </caption>
                    <thead>
                      <tr>
                        <th>Tool</th>
                        <th>Kind</th>
                        <th class="text-right">Runs</th>
                        <th class="text-right">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in TOOL_ROWS" :key="row.name">
                        <td>{{ row.name }}</td>
                        <td class="text-muted">{{ row.kind }}</td>
                        <td class="text-right">{{ row.runs.toLocaleString('en-US') }}</td>
                        <td class="text-right">{{ row.size }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DesignExample>
            </DesignSection>

            <DesignSection
              id="disclosure"
              :number="numberOf('disclosure')"
              title="Disclosure"
              description="Content that opens in place, on native details. Works without script; opening and closing animate with motion-collapse."
            >
              <DesignExample
                name="disclosure"
                note="A single toggle with no layout opinions. Use it inline for show-more content."
              >
                <details class="disclosure">
                  <summary>Show details</summary>
                  <p>Formatting runs in a worker, so large files don't freeze the page.</p>
                </details>
              </DesignExample>

              <DesignExample
                name="accordion"
                note="A stack of disclosures. Give them the same name and opening one closes the others."
              >
                <div class="accordion">
                  <details class="disclosure" name="demo-faq" open>
                    <summary>Is this a Vue component?</summary>
                    <p>
                      No. It's a native details element, so it works without JavaScript and is
                      accessible by default.
                    </p>
                  </details>
                  <details class="disclosure" name="demo-faq">
                    <summary>Can several be open at once?</summary>
                    <p>
                      Only if they don't share a name. Here they do, so opening one closes the
                      other.
                    </p>
                  </details>
                  <details class="disclosure" name="demo-faq">
                    <summary>Does it animate?</summary>
                    <p>Yes, using motion-collapse. Older browsers open it instantly.</p>
                  </details>
                </div>
              </DesignExample>
            </DesignSection>
          </div>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>

<style scoped>
  @reference "#base/app/assets/styles/index.css";

  .hero-title {
    font-size: clamp(3.5rem, 1.6rem + 8vw, 7.5rem);
    line-height: 0.9;
  }

  .spacing-row {
    display: grid;
    grid-template-columns: 1fr 7.5rem;
    align-items: center;
    column-gap: --spacing(4);

    @variant sm {
      grid-template-columns: 1fr 9rem;
    }
  }

  .zoom-label {
    font-size: 10px;
  }

  .stack-flat {
    top: 0;
    left: 0;
    width: 62%;
  }

  .stack-raised {
    top: --spacing(20);
    left: 26%;
    width: 56%;
  }

  .track {
    @apply relative block h-6 rounded-md bg-surface-subtle;
    container-type: inline-size;
  }

  .track-dot {
    @apply absolute inset-y-1 left-1 w-4 rounded-sm;
    transition-property: translate;
  }

  .track[data-moved] .track-dot {
    translate: calc(100cqw - 1.5rem) 0;
  }
</style>
