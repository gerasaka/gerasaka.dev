type PageSeoInput = {
  title: string;
  description: string;
};

export function usePageSeo(input: PageSeoInput | Ref<PageSeoInput>) {
  const page = computed(() => unref(input));
  const route = useRoute();
  const site = useAppConfig().site;

  useSeoMeta({
    title: () => page.value.title,
    description: () => page.value.description,

    ogType: 'website',
    ogUrl: () => `${site.url}${route.path}`,
    ogSiteName: site.name,
    ogLocale: 'en_US',
    ogTitle: () => page.value.title,
    ogDescription: () => page.value.description,
    ogImage: site.ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: site.ogImageAlt,

    twitterCard: 'summary_large_image',
    twitterSite: site.twitterHandle,
    twitterCreator: site.twitterHandle,
    twitterTitle: () => page.value.title,
    twitterDescription: () => page.value.description,
    twitterImage: site.ogImage,
    twitterImageAlt: site.ogImageAlt,
  });
}
