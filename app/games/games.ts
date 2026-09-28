export type GameLink = { type: 'internal'; to: string } | { type: 'external'; url: string };

export type GamePreview = { src: string; alt?: string };

export type GameStatus = 'live' | 'wip';

export type Game = {
  name: string;
  description: string;
  link: GameLink;
  preview: GamePreview;
  status?: GameStatus;
};

export const GAMES: Game[] = [
  {
    name: 'Snake',
    description: "Classic Snake. Eat, grow, don't hit the walls.",
    link: { type: 'internal', to: '/games/snake' },
    preview: { src: '/snake-preview.png', alt: 'Snake gameplay' },
    status: 'live',
  },
];
