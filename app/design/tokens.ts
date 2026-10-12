const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export interface PaletteRamp {
  name: string;
  role: string;
  steps: number[];
}

export const PALETTE: PaletteRamp[] = [
  { name: 'gray', role: 'Neutrals: surfaces, text, borders', steps: STEPS },
  { name: 'blue', role: 'Accent', steps: STEPS },
  { name: 'brick', role: 'Danger', steps: STEPS },
  { name: 'ochre', role: 'Warning', steps: STEPS },
  { name: 'moss', role: 'Success', steps: STEPS },
  { name: 'violet', role: 'Info', steps: STEPS },
];

export const BASE_COLORS = ['--color-white', '--color-black'];

export function paletteVar(ramp: PaletteRamp, step: number) {
  return `--color-${ramp.name}-${step}`;
}

export interface SemanticColor {
  token: string;
  usage: string;
  /** Token it must contrast against, and the WCAG minimum: 4.5 for text, 3 for non-text. */
  contrast?: { on: string; min: 4.5 | 3 };
}

export const SEMANTIC_COLOR_GROUPS: { name: string; colors: SemanticColor[] }[] = [
  {
    name: 'Surface',
    colors: [
      { token: 'surface', usage: 'Page background' },
      { token: 'surface-subtle', usage: 'Sunken: code, fields, tags. Tint, so it nests' },
      { token: 'surface-raised', usage: 'Floating: menus, dialogs, popovers' },
      { token: 'surface-hover', usage: 'Hover tint on cards and rows' },
      { token: 'backdrop', usage: 'Behind modal dialogs' },
    ],
  },
  {
    name: 'Text',
    colors: [
      { token: 'foreground', usage: 'Primary text, solid button fill', contrast: { on: 'surface', min: 4.5 } },
      { token: 'muted', usage: 'Secondary text, quiet actions', contrast: { on: 'surface', min: 4.5 } },
      { token: 'on-foreground', usage: 'Text on a foreground fill', contrast: { on: 'foreground', min: 4.5 } },
      { token: 'foreground-hover', usage: 'Solid button hover fill' },
    ],
  },
  {
    name: 'Border',
    colors: [
      { token: 'border', usage: 'Dividers, card edges' },
      { token: 'border-strong', usage: 'Control outlines: inputs, checkboxes', contrast: { on: 'surface', min: 3 } },
    ],
  },
  {
    name: 'Accent',
    colors: [
      { token: 'accent', usage: 'Brand marks, indicators. Not text', contrast: { on: 'surface', min: 3 } },
      { token: 'accent-strong', usage: 'Link text', contrast: { on: 'surface', min: 4.5 } },
      { token: 'accent-strong-hover', usage: 'Link hover text', contrast: { on: 'surface', min: 4.5 } },
      { token: 'accent-subtle', usage: 'Selected rows, active tabs' },
    ],
  },
  {
    name: 'Interaction',
    colors: [
      { token: 'focus', usage: 'Keyboard focus ring', contrast: { on: 'surface', min: 3 } },
      { token: 'selection', usage: 'Selected text' },
      { token: 'shadow', usage: 'Overlay shadow' },
    ],
  },
  {
    name: 'Status',
    colors: [
      { token: 'danger', usage: 'Errors, invalid fields', contrast: { on: 'surface', min: 4.5 } },
      { token: 'danger-subtle', usage: 'Error background' },
      { token: 'warning', usage: 'Caution', contrast: { on: 'surface', min: 4.5 } },
      { token: 'warning-subtle', usage: 'Caution background' },
      { token: 'success', usage: 'Confirmation', contrast: { on: 'surface', min: 4.5 } },
      { token: 'success-subtle', usage: 'Confirmation background' },
      { token: 'info', usage: 'Neutral information', contrast: { on: 'surface', min: 4.5 } },
      { token: 'info-subtle', usage: 'Information background' },
    ],
  },
];

export const SEMANTIC_COLORS = SEMANTIC_COLOR_GROUPS.flatMap((group) => group.colors);

export const FONTS = [
  { token: 'sans', utility: 'font-sans', usage: 'Interface and body text' },
  { token: 'serif', utility: 'font-serif', usage: 'Titles and headings' },
  { token: 'mono', utility: 'font-mono', usage: 'Code and data' },
  { token: 'pixel', utility: 'font-pixel', usage: 'Game interfaces only' },
];

export const TYPE_STYLES = [
  { utility: 'text-overline', sample: 'Writing', usage: 'Kicker above a heading' },
  { utility: 'text-title', sample: 'Page title', usage: 'One per page' },
  { utility: 'text-heading', sample: 'Section heading', usage: 'Sections in a page' },
  { utility: 'text-subheading', sample: 'Card or dialog title', usage: 'UI headings, groups' },
  { utility: 'text-subtitle', sample: 'A short line that introduces the page', usage: 'Under a title' },
  { utility: 'text-body', sample: 'Body text for paragraphs and general content.', usage: 'Default text' },
  { utility: 'text-label', sample: 'Email address', usage: 'Form labels, short UI text' },
  { utility: 'text-caption', sample: 'Sep 30, 2026 · 4 min read', usage: 'Dates, counts, metadata' },
];

export const GRID_COMPOSITIONS = [
  {
    name: 'Spread · 4 + 8',
    usage: 'Title or label beside content. This page uses it for every section.',
    cells: ['col-span-full sm:col-span-3 lg:col-span-4', 'col-span-full sm:col-span-5 lg:col-span-8'],
  },
  {
    name: 'Halves · 6 + 6',
    usage: 'Two equal ideas: before and after, input and output.',
    cells: ['col-span-full sm:col-span-4 lg:col-span-6', 'col-span-full sm:col-span-4 lg:col-span-6'],
  },
  {
    name: 'Quarters · 3 × 4',
    usage: 'Card lists: games, tools, posts.',
    cells: Array.from({ length: 4 }, () => 'col-span-2 sm:col-span-4 lg:col-span-3'),
  },
  {
    name: 'Offset · 8 from 3',
    usage: 'A reading column set off-center, the classic Swiss asymmetry.',
    cells: ['col-span-full sm:col-span-6 sm:col-start-2 lg:col-span-8 lg:col-start-3'],
  },
];

/** `ratio` is the width relative to container-wide, for the to-scale diagram. 65ch ≈ 36rem in the body font. */
export const CONTAINERS = [
  { utility: 'container-prose', width: '65ch', ratio: '56%', usage: 'Long-form reading' },
  { utility: 'container-main', width: '48rem', ratio: '75%', usage: 'Default page width' },
  { utility: 'container-wide', width: '64rem', ratio: '100%', usage: 'Galleries and tools' },
];

export const SPACING = [
  {
    utility: 'gap-2',
    value: '8px',
    size: 'calc(var(--spacing) * 2)',
    usage: 'Within a group: label and field, icon and text',
  },
  { utility: 'gap-4', value: '16px', size: 'calc(var(--spacing) * 4)', usage: 'Between items in a list' },
  { utility: 'gap-8', value: '32px', size: 'calc(var(--spacing) * 8)', usage: 'Between groups' },
  { utility: '*-section', value: '48–64px', size: 'var(--spacing-section)', usage: 'Between page sections' },
  { utility: '*-page', value: '48–80px', size: 'var(--spacing-page)', usage: 'Page top and bottom, via page' },
  { utility: '*-gutter', value: '32–80px', size: 'var(--spacing-gutter)', usage: 'Page sides, outside containers' },
];

export const RADII = [
  { token: 'sm', usage: 'Small marks: tags, badges, kbd, tooltips' },
  { token: 'md', usage: 'Everything else: buttons, fields, cards, overlays' },
];

export const CORNERS = [
  { token: 'sm', utility: 'corner-sm', usage: 'Subtle, on small media' },
  { token: 'md', utility: 'corner-md', usage: 'A featured image or cover card' },
  { token: 'lg', utility: 'corner-lg', usage: 'The page’s one hero moment' },
];

export const ELEVATION = [
  { name: 'Surface', className: 'bg-surface border border-border', usage: 'Level 0, the page itself' },
  { name: 'Subtle', className: 'bg-surface-subtle', usage: 'Level 1, sunken content' },
  { name: 'Overlay', className: 'bg-surface-raised shadow-overlay', usage: 'Menus, popovers, tooltips, toasts' },
  { name: 'Modal', className: 'bg-surface-raised shadow-modal', usage: 'Dialogs only' },
];

export const DURATIONS = [
  { token: 'fast', usage: 'Color and hover feedback' },
  { token: 'base', usage: 'Small movement, state changes' },
  { token: 'slow', usage: 'Elements entering the page; the ceiling for UI motion' },
];

export const EASINGS = [
  { token: 'out', usage: 'Entering and responding' },
  { token: 'in-out', usage: 'Moving and morphing on screen' },
];
