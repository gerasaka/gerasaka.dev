---
title: Writes playground
description: Every element a write can contain, rendered with the real prose styles.
---

Intro paragraph with **bold**, *italic*, ~~strikethrough~~, `inline code`, [highlighted text]{.highlight}, a raw <mark>mark</mark>, <kbd>Cmd</kbd> + <kbd>K</kbd>, H<sub>2</sub>O, x<sup>2</sup> and a [link](https://example.com).

A long unbroken string to test overflow: https://example.com/a/really/long/path/that/keeps/going/and/going/and/going/and/going/and/going/forever?with=query&and=more

First line with a hard break  
second line right after it.

## Heading two

### Heading three

#### Heading four

##### Heading five

###### Heading six

## Inline code in context

A heading with `code` in it is below, plus a list with `code` and a [link with `code`](https://example.com).

### The `useFetch` composable

## Lists

- Unordered item
- Another item
  - Nested item
    - Deeply nested item

1. Ordered item
2. Another item
   1. Nested ordered
   2. Another nested

- [x] Done task
- [ ] Open task

- A list item with a code block:

  ```ts
  const x = 1;
  ```

## Quotes

> A quote that should feel considered.
>
> Second paragraph of the quote.

> Outer quote
>
> > Nested quote

> Design is how it works.
>
> — Someone Famous

## Callouts

::callout
A plain note with **bold** and `code`.
::

::callout{type="tip"}
A tip.
::

::callout{type="warning"}
A warning.
::

## Code

```ts [example.ts]
export const add = (a: number, b: number) => a + b;
```

```
No language specified.
```

```ts
const veryLongLine = 'this line is intentionally very long so that it forces horizontal scrolling inside the code block on small screens';
```

```ts {2,3}
const a = 1;
const b = 2;
const c = a + b;
```

```diff
- const old = true;
+ const next = true;
```

::code-group

```ts [add.ts]
export const add = (a: number, b: number) => a + b;
```

```ts [add.test.ts]
import { expect, it } from 'vitest';
import { add } from './add';

it('adds', () => expect(add(1, 2)).toBe(3));
```

```bash [Run]
pnpm vitest
```

::

::code-group

```ts [TypeScript]
const greet = (name: string) => `Hello ${name}`;
```

```py [Python]
def greet(name):
    return f"Hello {name}"
```

::

```vue
<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

```css
.card {
  border-radius: 0.5rem;
}
```

```json
{ "name": "gerasaka.dev", "private": true }
```

## Tables

| Name | Type | Description |
| ---- | ---- | ----------- |
| `a`  | `number` | First operand |
| `b`  | `number` | Second operand |

| One | Two | Three | Four | Five | Six | Seven | Eight |
| --- | --- | ----- | ---- | ---- | --- | ----- | ----- |
| A very long cell value | A very long cell value | A very long cell value | A very long cell value | A very long cell value | A very long cell value | A very long cell value | A very long cell value |

## Images

![Landscape cover](/covers/hello-world.jpg)

[![Image inside a link](/covers/hello-world.jpg)](https://example.com)

<img src="/covers/hello-world.jpg" alt="Small image" width="120" />

## Details

<details>
<summary>Click to expand</summary>

Hidden content with `code`.

</details>

## Footnotes and rhythm

Text with a footnote reference.[^1]

Paragraph one of a few consecutive paragraphs to check vertical rhythm. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Paragraph two. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Paragraph three. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

---

[^1]: The footnote text.
