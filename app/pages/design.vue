<script lang="ts" setup>
  import { useColorMode } from '@vueuse/core';
  import { ref } from 'vue';
  import DesignSection from '~/design/DesignSection.vue';
  import {
    BASE_COLORS,
    CONTAINERS,
    CORNERS,
    DURATIONS,
    EASINGS,
    ELEVATION,
    FONTS,
    GRID_COMPOSITIONS,
    PALETTE,
    RADII,
    SEMANTIC_COLOR_GROUPS,
    SEMANTIC_COLORS,
    SPACING,
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

  const SECTIONS = [
    { id: 'color', title: 'Color' },
    { id: 'typography', title: 'Typography' },
    { id: 'layout', title: 'Layout & spacing' },
    { id: 'elevation', title: 'Elevation & radius' },
    { id: 'motion', title: 'Motion' },
    { id: 'components', title: 'Components' },
  ];

  function sectionNumber(index: number) {
    return String(index + 1).padStart(2, '0');
  }

  function spanOf(cell: string, breakpoint: 'sm' | 'lg') {
    return cell
      .split(' ')
      .filter((name) => name.startsWith(`${breakpoint}:`))
      .map((name) => name.slice(breakpoint.length + 1))
      .join(' ');
  }

  function numberOf(id: string) {
    return sectionNumber(SECTIONS.findIndex((section) => section.id === id));
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
  const dialog = ref<HTMLDialogElement>();
  const confirmDialog = ref<HTMLDialogElement>();
  const drawer = ref<HTMLDialogElement>();
  const { toast } = useToast();
  const TOAST_EXAMPLES = [
    { title: 'Copied to clipboard' },
    { title: 'Formatted', description: '128 lines, indented with 2 spaces.' },
    { title: 'Settings saved', description: 'Your preferences apply to every tool on this device.' },
  ];
  let toastCount = 0;

  function showToast() {
    const { title, description } = TOAST_EXAMPLES[toastCount++ % TOAST_EXAMPLES.length]!;
    toast(title, { description });
  }
</script>

<template>
  <main class="bg-surface text-foreground min-h-svh">
    <div class="container-wide page">
      <FadeIn>
        <FadeItem>
          <NuxtLink to="/" class="btn btn-quiet"><span aria-hidden="true">&larr;</span> Back</NuxtLink>
        </FadeItem>
        <FadeItem>
          <p class="text-overline mt-16">Gerasaka · Brand &amp; interface guidelines</p>
        </FadeItem>
        <FadeItem>
          <h1
            class="mt-4 font-serif text-[clamp(3.5rem,1.6rem+8vw,7.5rem)] leading-[0.9] tracking-display text-balance"
          >
            Design system
          </h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-6 max-w-xl">Foundations and components shared across my projects.</p>
        </FadeItem>
        <FadeItem>
          <nav class="mt-16" aria-label="Sections">
            <ol class="grid border-t border-border sm:grid-cols-2 md:grid-cols-3">
              <li v-for="(section, index) in SECTIONS" :key="section.id" class="border-b border-border">
                <a
                  :href="`#${section.id}`"
                  class="group focus-ring flex items-baseline gap-4 py-4 transition-colors duration-fast ease-out hover:text-muted"
                >
                  <span class="font-mono text-sm text-muted">{{ sectionNumber(index) }}</span>
                  <span class="font-serif text-xl">{{ section.title }}</span>
                </a>
              </li>
            </ol>
          </nav>
        </FadeItem>
      </FadeIn>

      <DesignSection
        id="color"
        :number="numberOf('color')"
        title="Color"
        description="Ink is the primary; blue is the single accent. Components only use semantic tokens, which point into the raw palette and resolve per theme. Each swatch shows light on the left, dark on the right."
      >
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2" role="group" aria-label="Theme preview">
          <span class="text-caption">Preview</span>
          <button
            v-for="mode in THEME_MODES"
            :key="mode"
            type="button"
            class="btn btn-quiet capitalize"
            :class="{ 'text-foreground underline underline-offset-4': themeMode === mode }"
            :aria-pressed="themeMode === mode"
            @click="themeMode = mode"
          >
            {{ mode === 'auto' ? 'System' : mode }}
          </button>
        </div>

        <div v-for="group in SEMANTIC_COLOR_GROUPS" :key="group.name">
          <h3 class="text-overline border-b border-border pb-3">{{ group.name }}</h3>
          <ul class="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3">
            <li v-for="color in group.colors" :key="color.token" class="flex flex-col gap-3">
              <span class="grid h-24 grid-cols-2 overflow-hidden border border-border">
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
                      :class="contrastOf(color, scheme)?.pass ? 'text-success' : 'text-danger'"
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
          Contrast ratios are measured live against surface (on-foreground against foreground). Green meets WCAG
          AA: 4.5 for text, 3 for marks and outlines.
        </p>

        <div class="flex flex-col gap-5">
          <h3 class="text-overline border-b border-border pb-3">Palette</h3>
          <div v-for="ramp in PALETTE" :key="ramp.name" class="flex flex-col gap-2">
            <span class="flex items-baseline gap-3">
              <span class="font-mono text-sm">{{ ramp.name }}</span>
              <span class="text-caption">{{ ramp.role }}</span>
            </span>
            <ul class="grid grid-cols-11 overflow-hidden border border-border">
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
                <span class="hidden xl:inline">{{ vars[paletteVar(ramp, step)]?.slice(1) }}</span>
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
          <li v-for="font in FONTS" :key="font.token" class="flex flex-col border-t border-border pt-4">
            <span class="flex items-baseline justify-between gap-4">
              <span class="text-label">{{ familyOf(font.token) ?? font.token }}</span>
              <span class="font-mono text-xs text-muted">{{ font.utility }}</span>
            </span>
            <span :class="font.utility" class="mt-6 text-8xl leading-none" aria-hidden="true">Aa</span>
            <span :class="font.utility" class="text-caption mt-6 break-all">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            </span>
            <span class="text-caption mt-2">{{ font.usage }}</span>
          </li>
        </ul>

        <ul class="flex flex-col divide-y divide-border border-t border-border">
          <li
            v-for="style in TYPE_STYLES"
            :key="style.utility"
            class="flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:gap-8"
          >
            <span class="flex w-40 shrink-0 flex-col gap-1">
              <span class="tag">{{ style.utility }}</span>
              <span class="text-caption">{{ style.usage }}</span>
            </span>
            <span :class="style.utility">{{ style.sample }}</span>
          </li>
        </ul>

      </DesignSection>

      <DesignSection
        id="layout"
        :number="numberOf('layout')"
        title="Layout & spacing"
        description="Every page composes on one grid: 4 columns on phones, 8 on tablets, 12 on desktop. Elements snap to columns, not to arbitrary widths, which is what makes pages feel related. Spacing and containers support it."
      >
        <div>
          <h3 class="text-overline border-b border-border pb-3">Grid</h3>
          <div class="relative mt-6">
            <div
              class="absolute inset-0 grid grid-cols-4 gap-x-column sm:grid-cols-8 lg:grid-cols-12"
              aria-hidden="true"
            >
              <span
                v-for="n in 12"
                :key="n"
                class="bg-accent/15"
                :class="{ 'hidden sm:block': n > 4 && n <= 8, 'hidden lg:block': n > 8 }"
              />
            </div>
            <div class="relative flex flex-col gap-3 py-3">
              <div v-for="row in GRID_COMPOSITIONS" :key="row.name" class="grid grid-cols-4 gap-x-column gap-y-3 sm:grid-cols-8 lg:grid-cols-12">
                <span
                  v-for="(cell, index) in row.cells"
                  :key="index"
                  class="flex h-14 items-end border-2 border-foreground px-2.5 py-2 font-mono text-xs"
                  :class="cell"
                >
                  <span class="hidden lg:inline">{{ spanOf(cell, 'lg') }}</span>
                  <span class="hidden sm:inline lg:hidden">{{ spanOf(cell, 'sm') }}</span>
                </span>
              </div>
            </div>
          </div>
          <dl class="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <div v-for="row in GRID_COMPOSITIONS" :key="row.name" class="flex flex-col gap-0.5">
              <dt class="text-label">{{ row.name }}</dt>
              <dd class="text-caption">{{ row.usage }}</dd>
            </div>
          </dl>
          <p class="text-caption mt-4 max-w-prose">
            Blue bands are the columns; resize to see 12 become 8 and 4. Pages use
            <code class="tag">grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-x-column</code> and place children
            with <code class="tag">col-span-*</code> and <code class="tag">col-start-*</code>. Labels show the spans for
            the current screen size; on phones, most compositions stack. Inside components, any grid is fine.
          </p>
        </div>

        <div>
          <h3 class="text-overline border-b border-border pb-3">Spacing</h3>
          <ul class="divide-y divide-border">
            <li
              v-for="space in SPACING"
              :key="space.utility"
              class="grid grid-cols-[6rem_1fr] items-center gap-x-6 gap-y-2 py-4 sm:grid-cols-[6rem_5rem_1fr]"
            >
              <span class="font-mono text-sm">{{ space.utility }}</span>
              <span class="font-mono text-xs text-muted">{{ space.value }}</span>
              <span class="col-span-2 flex flex-col gap-2 sm:col-span-1">
                <span class="block h-3 bg-foreground" :style="{ width: space.size }" />
                <span class="text-caption">{{ space.usage }}</span>
              </span>
            </li>
          </ul>
          <p class="text-caption mt-4 max-w-prose">
            Component spacing steps in 4px. The three named steps are fluid: their bars change length as you resize.
          </p>
        </div>

        <div>
          <h3 class="text-overline border-b border-border pb-3">Containers</h3>
          <div class="mt-6 flex flex-col gap-2">
            <div
              v-for="container in [...CONTAINERS].reverse()"
              :key="container.utility"
              class="flex items-baseline justify-between gap-4 border border-foreground px-3 py-2"
              :style="{ width: container.ratio }"
            >
              <span class="font-mono text-sm">{{ container.utility }}</span>
              <span class="font-mono text-xs text-muted">{{ container.width }}</span>
            </div>
          </div>
          <dl class="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-3">
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
            Drawn to scale against the widest. Each centers itself and adds the gutter on both sides, outside the
            content width.
          </p>
        </div>
      </DesignSection>

      <DesignSection
        id="elevation"
        :number="numberOf('elevation')"
        title="Elevation & radius"
        description="Flat and near-square, in the Swiss tradition. Depth comes from surface tints and borders; shadows are reserved for floating UI. The one exception is the signature corner, used sparingly as an accent."
      >
        <ul class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <li v-for="level in ELEVATION" :key="level.name" class="flex flex-col gap-3">
            <span class="h-24 rounded-md" :class="level.className" />
            <span class="flex flex-col">
              <span class="font-mono text-sm">{{ level.name }}</span>
              <span class="text-caption">{{ level.usage }}</span>
            </span>
          </li>
        </ul>

        <ul class="grid grid-cols-2 gap-4">
          <li v-for="radius in RADII" :key="radius.token" class="flex flex-col gap-3">
            <span
              class="h-16 border border-border bg-surface-subtle"
              :style="{ borderRadius: `var(--radius-${radius.token})` }"
            />
            <span class="flex flex-col">
              <span class="font-mono text-sm">rounded-{{ radius.token }} · {{ vars[`--radius-${radius.token}`] }}</span>
              <span class="text-caption">{{ radius.usage }}</span>
            </span>
          </li>
        </ul>

        <div>
          <h3 class="text-overline border-b border-border pb-3">Signature corner · accent only</h3>
          <ul class="mt-4 grid grid-cols-3 gap-4">
            <li v-for="corner in CORNERS" :key="corner.token" class="flex flex-col gap-3">
              <span class="flex items-end gap-3">
                <span class="aspect-3/2 flex-1 border border-border bg-surface-subtle" :class="corner.utility" />
                <span class="size-10 shrink-0 border border-border bg-surface-subtle" :class="corner.utility" />
              </span>
              <span class="flex flex-col">
                <span class="font-mono text-sm">{{ corner.utility }} · {{ vars[`--corner-${corner.token}`] }}</span>
                <span class="text-caption">{{ corner.usage }}</span>
              </span>
            </li>
          </ul>
          <p class="text-caption mt-4 max-w-prose">
            The one soft shape on a square grid, so it only works if it's rare: one per page, on a featured image or
            cover card. Never on buttons, fields, or repeated cards. Always a squircle and relative to the element, so
            it reads as intentional at any size.
          </p>
        </div>
      </DesignSection>

      <DesignSection
        id="motion"
        :number="numberOf('motion')"
        title="Motion"
        description="Three durations, all under 300ms, and two easings, with no ease-in. Exits use a shorter step than their enter. On top of the tokens sit a few CSS-only behaviors for overlays, disclosures and page changes."
      >
        <div>
          <button type="button" class="btn btn-solid" @click="moved = !moved">
            {{ moved ? 'Reset' : 'Play' }}
          </button>
        </div>

        <ul class="flex flex-col gap-4">
          <li v-for="duration in DURATIONS" :key="duration.token" class="flex flex-col gap-2">
            <span class="flex items-baseline gap-3">
              <span class="tag">duration-{{ duration.token }}</span>
              <span class="text-caption">
                {{ vars[`--transition-duration-${duration.token}`] }} · {{ duration.usage }}
              </span>
            </span>
            <span class="relative h-6 rounded-md bg-surface-subtle">
              <span
                class="absolute inset-y-1 left-1 w-4 rounded-sm bg-foreground transition-[left]"
                :class="moved ? 'left-[calc(100%-1.25rem)]' : ''"
                :style="{
                  transitionDuration: `var(--transition-duration-${duration.token})`,
                  transitionTimingFunction: 'var(--ease-out)',
                }"
              />
            </span>
          </li>
          <li v-for="easing in EASINGS" :key="easing.token" class="flex flex-col gap-2">
            <span class="flex items-baseline gap-3">
              <span class="tag">ease-{{ easing.token }}</span>
              <span class="text-caption">{{ easing.usage }}</span>
            </span>
            <span class="relative h-6 rounded-md bg-surface-subtle">
              <span
                class="absolute inset-y-1 left-1 w-4 rounded-sm bg-accent transition-[left] duration-1000"
                :class="moved ? 'left-[calc(100%-1.25rem)]' : ''"
                :style="{ transitionTimingFunction: `var(--ease-${easing.token})` }"
              />
            </span>
          </li>
        </ul>

        <div class="flex flex-col gap-4">
          <span class="flex flex-wrap items-baseline gap-3">
            <span class="tag">motion-pop motion-backdrop</span>
            <span class="text-caption">Dialogs and popovers. Scale from 0.96, fade, exit faster than enter.</span>
          </span>
          <div class="flex flex-wrap items-center gap-4">
            <button type="button" class="btn btn-solid" @click="dialog?.showModal()">Open dialog</button>
            <button type="button" class="btn btn-quiet" popovertarget="demo-popover">Toggle popover</button>
          </div>
          <dialog
            ref="dialog"
            class="motion-pop motion-backdrop m-auto w-[min(100%-2rem,24rem)] rounded-md bg-surface-raised p-6 text-foreground shadow-modal"
            closedby="any"
          >
            <h3 class="text-subheading">Dialog</h3>
            <p class="text-body mt-2 text-muted">Press Escape, click outside, or use the button to close.</p>
            <form method="dialog" class="mt-6 flex justify-end">
              <button class="btn btn-solid">Close</button>
            </form>
          </dialog>
          <div
            id="demo-popover"
            popover
            class="motion-pop m-auto rounded-md bg-surface-raised p-4 text-foreground shadow-overlay [--motion-y:0.5rem]"
          >
            <p class="text-label">Popover, rising in with <code class="tag">--motion-y</code>.</p>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <span class="flex flex-wrap items-baseline gap-3">
            <span class="tag">motion-collapse</span>
            <span class="text-caption">Smooth open and close for details. Snaps in older browsers.</span>
          </span>
          <details class="motion-collapse rounded-md border border-border">
            <summary class="text-label cursor-pointer px-4 py-3">What does it animate?</summary>
            <p class="text-body px-4 pb-4 text-muted">
              The height of the content, from zero to auto, using interpolate-size. No JavaScript, no measuring.
            </p>
          </details>
        </div>

        <div class="flex flex-col gap-4">
          <span class="flex flex-wrap items-baseline gap-3">
            <span class="tag">Page transitions</span>
            <span class="text-caption">
              A fast crossfade between pages via the View Transitions API. Entrance stagger runs on first load only.
            </span>
          </span>
          <div>
            <NuxtLink to="/" class="link">Navigate home to see it</NuxtLink>
          </div>
        </div>

        <p class="text-caption max-w-prose">
          Under prefers-reduced-motion, movement and page transitions are removed; fades and color changes remain.
        </p>
      </DesignSection>

      <DesignSection
        id="components"
        :number="numberOf('components')"
        title="Components"
        description="Tailwind utility classes, not Vue components. Each works on plain HTML elements."
      >
        <div class="flex flex-col gap-4">
          <span class="tag">btn btn-solid | btn-outline | btn-ghost | btn-danger | btn-quiet</span>
          <div class="flex flex-wrap items-center gap-3">
            <button type="button" class="btn btn-solid">Save</button>
            <button type="button" class="btn btn-outline">Cancel</button>
            <button type="button" class="btn btn-ghost">Skip</button>
            <button type="button" class="btn btn-danger">Delete</button>
            <button type="button" class="btn btn-quiet">Restart</button>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">btn-sm | btn-lg | btn-icon</span>
          <div class="flex flex-wrap items-center gap-3">
            <button type="button" class="btn btn-solid btn-sm">Small</button>
            <button type="button" class="btn btn-solid">Default</button>
            <button type="button" class="btn btn-solid btn-lg">Large</button>
            <button type="button" class="btn btn-outline btn-icon" aria-label="Add">+</button>
            <button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Close">&times;</button>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">aria-busy | disabled</span>
          <div class="flex flex-wrap items-center gap-3">
            <button type="button" class="btn btn-solid" aria-busy="true">Saving</button>
            <button type="button" class="btn btn-outline" aria-busy="true">Loading</button>
            <button type="button" class="btn btn-solid" disabled>Disabled</button>
            <button type="button" class="btn btn-quiet" disabled>Pause</button>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">link</span>
          <p class="text-body">
            Inline links outside prose, like <a href="#components" class="link">this one</a>, use accent-strong.
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">card | card card-link</span>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="card flex flex-col gap-1">
              <span class="text-subheading">Static card</span>
              <span class="text-caption">Groups related content. No hover.</span>
            </div>
            <a href="#components" class="card card-link flex flex-col gap-1">
              <span class="text-subheading">Link card</span>
              <span class="text-caption">The whole card is clickable. Hover to see the fill.</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">form-item field form-error</span>
          <div class="grid gap-6 sm:grid-cols-2">
            <div class="form-item">
              <label for="demo-name" class="text-label">Name</label>
              <input id="demo-name" type="text" class="field" placeholder="Ada Lovelace" aria-describedby="demo-name-hint" />
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
              <span id="demo-email-error" class="form-error">Enter a full email address.</span>
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
              <input id="demo-disabled" type="text" class="field" value="Read only" disabled />
            </div>
            <div class="form-item sm:col-span-2">
              <label for="demo-notes" class="text-label">Notes</label>
              <textarea id="demo-notes" class="field h-24 resize-y" placeholder="Anything else?" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">checkbox | radio | switch</span>
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
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">callout callout-danger | callout-warning | callout-success | callout-info</span>
          <ul class="flex flex-col gap-2">
            <li class="callout callout-danger">Couldn't parse the XML. Check line 4.</li>
            <li class="callout callout-warning">Large input, formatting may be slow.</li>
            <li class="callout callout-success">All 12 files are valid.</li>
            <li class="callout callout-info">
              <strong class="font-medium">Runs in your browser</strong>
              <span class="text-muted">Formatting happens locally. Nothing you paste is uploaded or stored.</span>
            </li>
          </ul>
          <p class="text-caption max-w-prose">
            Each carries an icon so meaning never rides on the tint alone. Messages that come and go, like "Copied",
            are toasts, not callouts.
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">badge badge-accent | badge-danger | badge-warning | badge-success | badge-info</span>
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge">Draft</span>
            <span class="badge badge-accent">New</span>
            <span class="badge badge-danger">Failed</span>
            <span class="badge badge-warning">Beta</span>
            <span class="badge badge-success">Live</span>
            <span class="badge badge-info">3 updates</span>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">tag</span>
          <div class="flex flex-wrap gap-2">
            <span class="tag">xml</span>
            <span class="tag">formatter</span>
          </div>
          <p class="text-caption max-w-prose">For code-like tokens: keywords, file types, class names.</p>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">dialog</span>
          <div>
            <button type="button" class="btn btn-danger" @click="confirmDialog?.showModal()">Delete file</button>
          </div>
          <dialog ref="confirmDialog" class="dialog" closedby="any" aria-labelledby="demo-dialog-title">
            <h3 id="demo-dialog-title" class="text-subheading">Delete config.xml?</h3>
            <p class="text-body mt-2 text-muted">This removes the file from your workspace. You can't undo this.</p>
            <form method="dialog" class="mt-6 flex justify-end gap-2">
              <button class="btn btn-ghost">Cancel</button>
              <button class="btn btn-solid" @click="toast('config.xml deleted')">Delete</button>
            </form>
          </dialog>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">dialog-drawer</span>
          <div>
            <button type="button" class="btn btn-outline" @click="drawer?.showModal()">Settings</button>
          </div>
          <dialog ref="drawer" class="dialog-drawer flex-col gap-6 open:flex" closedby="any" aria-labelledby="demo-drawer-title">
            <div class="flex items-center justify-between">
              <h3 id="demo-drawer-title" class="text-subheading">Settings</h3>
              <form method="dialog">
                <button class="btn btn-ghost btn-icon btn-sm" aria-label="Close">&times;</button>
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
          <p class="text-caption max-w-prose">A dialog pinned to the edge. Same focus, Escape, and backdrop behavior.</p>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">hr · kbd</span>
          <hr />
          <p class="text-body">Press <kbd>⌘</kbd> <kbd>Enter</kbd> to format, or <kbd>Esc</kbd> to close.</p>
          <p class="text-caption max-w-prose">Plain elements, styled by default. No class needed.</p>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">popover menu-item</span>
          <div>
            <button type="button" class="btn btn-outline" popovertarget="demo-menu">Options</button>
            <div id="demo-menu" popover class="popover">
              <button type="button" class="menu-item" popovertarget="demo-menu" @click="toast('Duplicated')">
                Duplicate
              </button>
              <button type="button" class="menu-item" popovertarget="demo-menu" @click="toast('Link copied')">
                Copy link
              </button>
              <button type="button" class="menu-item" disabled>Move</button>
              <hr class="my-1 border-border" />
              <button type="button" class="menu-item text-danger" popovertarget="demo-menu">Delete</button>
            </div>
          </div>
          <p class="text-caption max-w-prose">
            Native popover: closes on Escape or an outside click. Anchors to its trigger where supported, centered
            otherwise.
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">tooltip</span>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="btn btn-ghost btn-icon tooltip" aria-label="Copy" data-tooltip="Copy">
              &#x2398;
            </button>
            <button type="button" class="btn btn-ghost btn-icon tooltip" aria-label="Download" data-tooltip="Download">
              &darr;
            </button>
          </div>
          <p class="text-caption max-w-prose">
            For icon buttons. Supplementary only: the element keeps its own aria-label. Never put essential info in a
            tooltip; touch screens can't hover.
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">toast · useToast() + &lt;Toaster /&gt;</span>
          <div>
            <button type="button" class="btn btn-outline" @click="showToast">Show toast</button>
          </div>
          <p class="text-caption max-w-prose">
            Short confirmations of something that just happened. New toasts stack like a deck; hover or focus the stack
            to fan it out and pause the timers. Gone after five seconds, announced politely to screen readers. Mount the
            Toaster once per app.
          </p>
          <Toaster />
        </div>

        <div class="flex flex-col gap-4">
          <span class="tag">accordion</span>
          <div class="border-t border-border">
            <details class="accordion" name="demo-faq" open>
              <summary>Is this a Vue component?</summary>
              <p>No. It's a native details element, so it works without JavaScript and is accessible by default.</p>
            </details>
            <details class="accordion" name="demo-faq">
              <summary>Can several be open at once?</summary>
              <p>Only if they don't share a name. Here they do, so opening one closes the other.</p>
            </details>
            <details class="accordion" name="demo-faq">
              <summary>Does it animate?</summary>
              <p>Yes, using motion-collapse. Older browsers open it instantly.</p>
            </details>
          </div>
        </div>
      </DesignSection>
    </div>
  </main>
</template>
