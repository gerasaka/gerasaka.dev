export type LabKind = 'ui' | 'animation' | 'api';

export type Lab = {
  slug: string;
  name: string;
  description: string;
  kind: LabKind;
  date: string;
  inspiredBy?: { label: string; url: string };
  status?: 'live' | 'wip';
};

export const LAB_KIND_LABELS: Record<LabKind, string> = {
  ui: 'UI',
  animation: 'Animation',
  api: 'API',
};

export const LABS: Lab[] = [
  {
    slug: 'spotlight-cards',
    name: 'Spotlight Cards',
    description:
      'A soft glow that follows the cursor across a grid of cards, lighting up borders and surfaces as it passes.',
    kind: 'animation',
    date: '2026-10-28',
    inspiredBy: { label: 'Linear / Vercel cards', url: 'https://linear.app' },
    status: 'live',
  },
  {
    slug: 'distort-text',
    name: 'Distort Text',
    description: 'Letters bend, stretch and shift colour as the cursor gets close to them.',
    kind: 'animation',
    date: '2026-11-10',
    status: 'live',
  },
];

export const LABS_SORTED = [...LABS].sort((a, b) => b.date.localeCompare(a.date));
