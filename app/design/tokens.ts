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
      { token: 'surface-subtle', usage: 'Sunken: badges, skeletons, tracks. Tint, so it nests' },
      { token: 'surface-raised', usage: 'Level 1: raised cards and panels' },
      { token: 'surface-overlay', usage: 'Level 2: menus, dialogs, popovers, toasts' },
      { token: 'surface-hover', usage: 'Hover tint on cards and rows' },
      { token: 'backdrop', usage: 'Behind modal dialogs' },
    ],
  },
  {
    name: 'Text',
    colors: [
      { token: 'foreground', usage: 'Primary text, solid button fill', contrast: { on: 'surface', min: 4.5 } },
      {
        token: 'foreground-soft',
        usage: 'Reading text: paragraphs and posts',
        contrast: { on: 'surface', min: 4.5 },
      },
      { token: 'muted', usage: 'Secondary text, quiet actions', contrast: { on: 'surface', min: 4.5 } },
      { token: 'on-foreground', usage: 'Text on a foreground fill', contrast: { on: 'foreground', min: 4.5 } },
      { token: 'foreground-hover', usage: 'Solid button hover fill' },
    ],
  },
  {
    name: 'Line',
    colors: [
      { token: 'line', usage: 'Dividers, card edges' },
      { token: 'line-strong', usage: 'Control outlines: inputs, checkboxes', contrast: { on: 'surface', min: 3 } },
    ],
  },
  {
    name: 'Accent',
    colors: [
      { token: 'accent', usage: 'Brand marks, indicators. Not text', contrast: { on: 'surface', min: 3 } },
      { token: 'accent-strong', usage: 'Link text', contrast: { on: 'surface', min: 4.5 } },
      { token: 'accent-strong-hover', usage: 'Link hover text', contrast: { on: 'surface', min: 4.5 } },
      { token: 'accent-subtle', usage: 'Selected chips, accent badges' },
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
  {
    utility: 'text-body',
    sample: 'Reading text, a step softer, so bold stands out.',
    usage: 'Paragraphs, not UI',
  },
  { utility: 'text-label', sample: 'Email address', usage: 'Form labels, short UI text' },
  { utility: 'text-caption', sample: 'Sep 30, 2026 · 4 min read', usage: 'Dates, counts, metadata' },
];

/** `ratio` is the width relative to container-wide, for the to-scale diagram. */
export const CONTAINERS = [
  { utility: 'container-main', width: '46rem', ratio: '72%', usage: 'Every page, articles included' },
  { utility: 'container-wide', width: '64rem', ratio: '100%', usage: 'Tools, galleries, and this page' },
];

export const SPACING = [
  { utility: 'gap-2', phone: '8px', desktop: '8px', usage: 'Within a group: label and field, icon and text' },
  { utility: 'gap-4', phone: '16px', desktop: '16px', usage: 'Between items in a list' },
  { utility: 'gap-8', phone: '32px', desktop: '32px', usage: 'Between groups' },
  { utility: '*-section', phone: '48px', desktop: '64px', usage: 'Between page sections' },
  { utility: '*-page', phone: '48px', desktop: '80px', usage: 'Page top and bottom, via page' },
  { utility: '*-gutter', phone: '32px', desktop: '80px', usage: 'Page sides, outside containers' },
];

/** The annotated mock page: content blocks, with each gap drawn at its real size. */
export type SpacingDemoRow =
  | { kind: 'label' | 'field' | 'card' | 'heading' | 'text' }
  | { kind: 'gap'; size: string; label?: string };

export const SPACING_DEMO: SpacingDemoRow[] = [
  { kind: 'label' },
  { kind: 'gap', size: 'calc(var(--spacing) * 2)', label: 'gap-2 · 8px' },
  { kind: 'field' },
  { kind: 'gap', size: 'calc(var(--spacing) * 8)', label: 'gap-8 · 32px' },
  { kind: 'card' },
  { kind: 'gap', size: 'calc(var(--spacing) * 4)', label: 'gap-4 · 16px' },
  { kind: 'card' },
  { kind: 'gap', size: 'calc(var(--spacing) * 4)' },
  { kind: 'card' },
  { kind: 'gap', size: 'var(--spacing-section)', label: '*-section · 48–64px' },
  { kind: 'heading' },
  { kind: 'gap', size: 'calc(var(--spacing) * 2)', label: 'gap-2 · 8px' },
  { kind: 'text' },
];

export const RADII = [
  { token: 'sm', usage: 'Small marks: badges, checkboxes, tooltips, kbd' },
  { token: 'md', usage: 'Everything else: buttons, fields, cards, overlays' },
];

export const CORNERS = [
  { token: 'sm', utility: 'corner-sm', usage: 'Subtle, on small media' },
  { token: 'md', utility: 'corner-md', usage: 'A featured image or cover card' },
  { token: 'lg', utility: 'corner-lg', usage: 'The page’s one hero moment' },
];

export const ELEVATION = [
  { level: 0, name: 'Flat', utility: 'card', className: 'border border-line', usage: 'Most content. The default.' },
  {
    level: 1,
    name: 'Raised',
    utility: 'elevation-raised',
    className: 'elevation-raised',
    usage: 'A featured card or panel. Also where card-link rises on hover.',
  },
  {
    level: 2,
    name: 'Overlay',
    utility: 'elevation-overlay',
    className: 'elevation-overlay',
    usage: 'Menus, popovers, dialogs, drawers, toasts.',
  },
];

export const DURATIONS = [
  { token: 'fast', usage: 'Hover, color, and every exit' },
  { token: 'base', usage: 'Overlays opening, collapse, small movement' },
  { token: 'slow', usage: 'Page entrance and the toast stack' },
];

export const EASINGS = [
  { token: 'glide', usage: 'Appearing, leaving, changing. The default' },
  { token: 'sweep', usage: 'Movement across the screen: collapse, progress' },
  { token: 'settle', usage: 'Panels sliding in from an edge: the drawer' },
];
