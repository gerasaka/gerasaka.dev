export type SiteKey = 'main' | 'tools';
export type SectionKey = 'writes' | 'games' | 'tools';

declare module '#app' {
  interface PageMeta {
    /** Section highlighted in the site navigation of the `section` layout. */
    section?: SectionKey;
  }
}
