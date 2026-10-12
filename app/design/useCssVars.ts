import { onMounted, ref } from 'vue';

/** Reads resolved custom property values from :root after mount. */
export function useCssVars(names: string[]) {
  const values = ref<Record<string, string>>({});

  onMounted(() => {
    const style = getComputedStyle(document.documentElement);
    values.value = Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
  });

  return values;
}
