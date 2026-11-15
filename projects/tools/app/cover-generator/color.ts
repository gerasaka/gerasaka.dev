/**
 * OKLCH, a perceptual color space: equal steps in lightness and chroma look equal to the eye,
 * so colors picked at the same lightness sit together no matter their hue.
 */

/** Hex color for an OKLCH value, lowering chroma until it fits the sRGB gamut. */
export function oklch(lightness: number, chroma: number, hue: number): string {
  let low = 0;
  let high = chroma;
  if (inGamut(lightness, high, hue)) return toHex(lightness, high, hue);
  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2;
    if (inGamut(lightness, mid, hue)) low = mid;
    else high = mid;
  }
  return toHex(lightness, low, hue);
}

function inGamut(lightness: number, chroma: number, hue: number): boolean {
  return linearRgb(lightness, chroma, hue).every((channel) => channel >= -1e-4 && channel <= 1 + 1e-4);
}

function toHex(lightness: number, chroma: number, hue: number): string {
  return `#${linearRgb(lightness, chroma, hue)
    .map((channel) => {
      const clamped = Math.min(1, Math.max(0, channel));
      const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
      return Math.round(encoded * 255)
        .toString(16)
        .padStart(2, '0');
    })
    .join('')}`;
}

function linearRgb(lightness: number, chroma: number, hue: number): [number, number, number] {
  const radians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
