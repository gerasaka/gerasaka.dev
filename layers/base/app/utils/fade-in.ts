import type { InjectionKey } from 'vue';

export const FadeInKey: InjectionKey<{ next: () => number }> = Symbol('fade-in');
