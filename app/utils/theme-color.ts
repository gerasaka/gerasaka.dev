export function themeColor(token: string, scope: Element = document.body) {
  const probe = document.createElement('span');
  probe.style.display = 'none';
  probe.style.color = `var(--color-${token})`;
  scope.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}
