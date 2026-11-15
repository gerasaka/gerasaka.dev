<script lang="ts" setup>
  import type {
    CoverOptions,
    EchoShape,
    EchoTrail,
    RibbonCurveType,
  } from '~/cover-generator/cover';
  import {
    COLOR_SCHEMES,
    COVER_HEIGHT,
    COVER_STUDIES,
    COVER_WIDTH,
    DEFAULT_GRAIN,
    describeCover,
    ECHO_SHAPES,
    ECHO_TRAILS,
    generateCover,
    GROUND_MODES,
    renderCoverSvg,
    RIBBON_CURVES,
  } from '~/cover-generator/cover';
  import ChoiceChips from '~/cover-generator/ChoiceChips.vue';
  import { downloadBlob, svgToJpeg } from '~/cover-generator/export';
  import type { CoverSettings } from '~/cover-generator/settings';
  import {
    coverFileName,
    DEFAULT_SEED,
    settingsFromQuery,
    settingsToQuery,
  } from '~/cover-generator/settings';

  definePageMeta({ layout: 'section', section: 'tools' });

  const title = 'Cover Generator';
  const description =
    'Soft, generative cover images for blog posts, ready for the page and for social previews.';

  usePageSeo({ title, description });

  const JPEG_QUALITY = 0.85;

  const route = useRoute();
  const router = useRouter();
  const { copy } = useClipboard();
  const { toast } = useToast();

  const settings = ref<CoverSettings>({ seed: DEFAULT_SEED, options: {} });

  // The page is prerendered without a query, so read it after hydration to keep markup in sync.
  onMounted(() => {
    settings.value = settingsFromQuery(route.query);
    watch(settings, (next) => router.replace({ query: settingsToQuery(next) }), { deep: true });
  });

  const scene = computed(() => generateCover(settings.value.seed, settings.value.options));
  const svg = computed(() => renderCoverSvg(scene.value));
  const swatches = computed(() => {
    const { palette } = scene.value;
    return [palette.ground, ...palette.tints, ...palette.subject, ...palette.accent];
  });

  function option<K extends keyof CoverOptions>(key: K) {
    return computed({
      get: () => settings.value.options[key],
      set: (value: CoverOptions[K]) => {
        settings.value.options = { ...settings.value.options, [key]: value };
      },
    });
  }

  const subject = option('subject');
  const companion = option('companion');
  const mode = option('mode');
  const scheme = option('scheme');
  const hue = option('hue');
  const grain = option('grain');

  const curve = computed({
    get: () => settings.value.options.ribbon?.curve,
    set: (value: RibbonCurveType | undefined) => {
      settings.value.options = { ...settings.value.options, ribbon: { curve: value } };
    },
  });
  const trail = computed({
    get: () => settings.value.options.echo?.trail,
    set: (value: EchoTrail | undefined) => {
      settings.value.options = {
        ...settings.value.options,
        echo: { ...settings.value.options.echo, trail: value },
      };
    },
  });
  const shape = computed({
    get: () => settings.value.options.echo?.shape,
    set: (value: EchoShape | undefined) => {
      settings.value.options = {
        ...settings.value.options,
        echo: { ...settings.value.options.echo, shape: value },
      };
    },
  });

  const hueValue = computed(() => Math.round(hue.value ?? scene.value.palette.hue % 360));
  const grainValue = computed(() => grain.value ?? DEFAULT_GRAIN);

  const choices = <T extends string>(values: readonly T[]) =>
    values.map((value) => ({ value, label: value[0]!.toUpperCase() + value.slice(1) }));

  function shuffleSeed() {
    settings.value.seed = Math.random().toString(36).slice(2, 8);
  }

  function reset() {
    settings.value = { seed: settings.value.seed, options: {} };
  }

  const exporting = ref(false);

  async function downloadJpeg() {
    exporting.value = true;
    try {
      const blob = await svgToJpeg(svg.value, COVER_WIDTH, COVER_HEIGHT, JPEG_QUALITY);
      downloadBlob(blob, coverFileName(settings.value.seed, 'jpg'));
    } catch {
      toast('Could not export the image');
    } finally {
      exporting.value = false;
    }
  }

  function downloadSvg() {
    downloadBlob(
      new Blob([svg.value], { type: 'image/svg+xml' }),
      coverFileName(settings.value.seed, 'svg'),
    );
  }

  async function copyLink() {
    await copy(window.location.href);
    toast('Link copied');
  }
</script>

<template>
  <main class="min-h-svh">
    <div class="container-wide page">
      <FadeIn>
        <FadeItem>
          <h1 class="text-title mt-12">{{ title }}</h1>
        </FadeItem>
        <FadeItem>
          <p class="text-subtitle mt-2">{{ description }}</p>
        </FadeItem>

        <FadeItem>
          <div class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <section class="flex min-w-0 flex-col gap-4" aria-label="Preview">
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="aspect-1200/630 overflow-hidden rounded-md shadow-raised [&>svg]:block [&>svg]:size-full"
                role="img"
                :aria-label="`Cover preview: ${describeCover(scene)}`"
                v-html="svg"
              ></div>
              <!-- eslint-enable vue/no-v-html -->

              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-caption">{{ describeCover(scene) }}</p>
                <ul class="flex gap-1" aria-label="Palette">
                  <li
                    v-for="(color, index) in swatches"
                    :key="index"
                    class="size-4 rounded-full border border-line"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  ></li>
                </ul>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="btn" :aria-busy="exporting" @click="downloadJpeg">
                  Download JPEG
                </button>
                <button type="button" class="btn btn-outline" @click="downloadSvg">
                  Download SVG
                </button>
                <button type="button" class="btn btn-ghost" @click="copyLink">Copy link</button>
              </div>
              <p class="text-caption">
                {{ COVER_WIDTH }}×{{ COVER_HEIGHT }} JPEG, sized for the page and for social
                previews. Use a post's slug as the seed and the file is named after it; the link
                brings back these exact settings.
              </p>
            </section>

            <section class="flex flex-col gap-6" aria-label="Settings">
              <div class="form-item">
                <label for="cover-seed" class="text-label">Seed</label>
                <div class="flex gap-2">
                  <input
                    id="cover-seed"
                    v-model="settings.seed"
                    class="field"
                    spellcheck="false"
                    autocomplete="off"
                  />
                  <button
                    type="button"
                    class="btn btn-outline btn-icon"
                    aria-label="Random seed"
                    @click="shuffleSeed"
                  >
                    <Icon name="ph:shuffle" />
                  </button>
                </div>
              </div>

              <ChoiceChips v-model="subject" label="Subject" :options="choices(COVER_STUDIES)" />
              <ChoiceChips
                v-if="scene.subject.kind === 'ribbon'"
                v-model="curve"
                label="Curve"
                :options="choices(RIBBON_CURVES)"
              />
              <template v-if="scene.subject.kind === 'echo'">
                <ChoiceChips v-model="trail" label="Trail" :options="choices(ECHO_TRAILS)" />
                <ChoiceChips v-model="shape" label="Shape" :options="choices(ECHO_SHAPES)" />
              </template>
              <ChoiceChips
                v-model="companion"
                label="Companion orb"
                :options="[
                  { value: true, label: 'On' },
                  { value: false, label: 'Off' },
                ]"
              />
              <ChoiceChips v-model="mode" label="Ground" :options="choices(GROUND_MODES)" />
              <ChoiceChips v-model="scheme" label="Harmony" :options="choices(COLOR_SCHEMES)" />

              <div class="form-item">
                <div class="flex items-center justify-between">
                  <label for="cover-hue" class="text-label">Hue</label>
                  <button
                    type="button"
                    class="chip chip-sm"
                    :aria-pressed="hue === undefined"
                    @click="hue = undefined"
                  >
                    Auto
                  </button>
                </div>
                <input
                  id="cover-hue"
                  type="range"
                  class="slider hue-slider"
                  min="0"
                  max="359"
                  :value="hueValue"
                  @input="hue = Number(($event.target as HTMLInputElement).value)"
                />
              </div>

              <div class="form-item">
                <div class="flex items-center justify-between">
                  <label for="cover-grain" class="text-label">Grain</label>
                  <span class="text-caption">{{ Math.round(grainValue * 100) }}%</span>
                </div>
                <input
                  id="cover-grain"
                  type="range"
                  class="slider"
                  min="0"
                  max="0.8"
                  step="0.01"
                  :value="grainValue"
                  :style="{ '--slider-fill': `${(grainValue / 0.8) * 100}%` }"
                  @input="grain = Number(($event.target as HTMLInputElement).value)"
                />
              </div>

              <button type="button" class="btn btn-quiet self-start" @click="reset">
                Reset to seed
              </button>
            </section>
          </div>
        </FadeItem>
      </FadeIn>
    </div>
  </main>
</template>

<style scoped>
  .hue-slider {
    --slider-active: var(--color-foreground);
    --slider-track: transparent;
  }

  .hue-slider::-webkit-slider-runnable-track {
    background: linear-gradient(
      to right in oklch longer hue,
      oklch(0.75 0.14 0),
      oklch(0.75 0.14 359)
    );
  }

  .hue-slider::-moz-range-track {
    background: linear-gradient(
      to right in oklch longer hue,
      oklch(0.75 0.14 0),
      oklch(0.75 0.14 359)
    );
  }

  .hue-slider::-moz-range-progress {
    background: transparent;
  }
</style>
