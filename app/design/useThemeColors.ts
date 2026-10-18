import { onMounted, ref } from 'vue';

export const SCHEMES = ['light', 'dark'] as const;
export type Scheme = (typeof SCHEMES)[number];

export interface ResolvedColor {
  /** Palette step, `name alpha%` for translucent colors, or `ink alpha%` for color-mix tints of foreground. */
  label: string;
  rgb?: [number, number, number];
}

const RGB = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/;

function toHex(rgb: number[]) {
  return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Opaque colors from `color-mix()` compute to `oklab(...)`; painting one pixel converts it to sRGB. */
function toRgbString(value: string) {
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!ctx) return value;
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

function luminance(rgb: [number, number, number]) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: [number, number, number], b: [number, number, number]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Resolves semantic color tokens in both schemes by applying them to a hidden
 * probe with a forced `color-scheme`, so `light-dark()` picks each side.
 */
export function useThemeColors(tokens: string[], paletteVars: string[]) {
  const colors = ref<Record<Scheme, Record<string, ResolvedColor>>>({ light: {}, dark: {} });

  onMounted(() => {
    const root = getComputedStyle(document.documentElement);
    const names = new Map(
      paletteVars.map((name) => [root.getPropertyValue(name).trim().toLowerCase(), name.replace('--color-', '')]),
    );

    const probe = document.createElement('div');
    probe.style.display = 'none';
    document.body.append(probe);

    const result: Record<Scheme, Record<string, ResolvedColor>> = { light: {}, dark: {} };
    for (const scheme of SCHEMES) {
      probe.style.colorScheme = scheme;
      for (const token of tokens) {
        probe.style.backgroundColor = `var(--color-${token})`;
        const value = getComputedStyle(probe).backgroundColor;
        const tintAlpha = value.match(/\/\s*([\d.]+)\)$/)?.[1];
        if (!RGB.test(value) && tintAlpha) {
          result[scheme][token] = { label: `ink ${Math.round(Number(tintAlpha) * 100)}%` };
          continue;
        }
        const match = (RGB.test(value) ? value : toRgbString(value)).match(RGB);
        if (!match) {
          result[scheme][token] = { label: value };
          continue;
        }
        const rgb = [Number(match[1]), Number(match[2]), Number(match[3])] as [number, number, number];
        const hex = toHex(rgb);
        const name = names.get(hex) ?? hex;
        const alpha = match[4] === undefined ? 1 : Number(match[4]);
        result[scheme][token] =
          alpha < 1 ? { label: `${name} ${Math.round(alpha * 100)}%` } : { label: name, rgb };
      }
    }

    probe.remove();
    colors.value = result;
  });

  return colors;
}
