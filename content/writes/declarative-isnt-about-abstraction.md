---
title: "Declarative Isn't About Abstraction"
description: Here's how I actually understand declarative code. It's about where a value is described, not how much code you hide.
date: 2026-08-2
tags:
  - opinion
  - fundamentals
---

A lot of people learn "declarative" from the same example. A `for` loop that builds up a sum,
next to a `filter` and `reduce` that do the same thing in one line:

```ts
// imperative: the sum is built up, step by step
let evenSum = 0;
for (const n of numbers) {
  if (n % 2 === 0) evenSum += n;
}

// declarative: the sum is one expression
const evenSum = numbers.filter((n) => n % 2 === 0).reduce((a, b) => a + b, 0);
```

This example isn't wrong. But I feel it's just not enough to actually understand declarative, and
on its own it quietly teaches the wrong lesson: _declarative means less code and more
abstraction._ So people go looking for things to abstract. They wrap everything in helper
functions, build little pipelines, and pat themselves on the back for writing declarative code.

But that's not what declarative means. You can write a mountain of helpers/abstractions and
still be completely imperative.

## The definition I actually use

Declarative code describes a thing in **one place**. Imperative code **scatters** that
description, the thing is declared here, and then changed somewhere else.

That's the whole distinction for me. It's not only "what vs how," or "high level vs low level."
It's a mindset shift: when I want to know what a value is, can I look in one place and follow the
dependency chain, or do I have to trace every place that touches it?

## Abstraction is a different axis

Here's a cart. The `total` is derived from the items and a discount. Watch where `total` lives:

```ts
class Cart {
  private items: Item[] = [];
  private discount = 0;
  total = 0;

  addItem(item: Item) {
    this.items.push(item);
    this.recalculateTotal();
  }

  removeItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
    this.recalculateTotal();
  }

  applyDiscount(amount: number) {
    this.discount = amount;
    this.recalculateTotal();
  }

  private recalculateTotal() {
    this.total = sumItems(this.items) - this.discount;
  }
}
```

This looks clean. The calculation is pulled into one tidy `recalculateTotal` method that's
abstraction, and it's fine. But `total` is still imperative. Its real value isn't defined by
`total`, it's defined by _every method that remembers to call `recalculateTotal`_. Forget one,
and `total` is wrong. The description is split across three methods and held together by a
rule you have to keep in your head.

No amount of extra helpers fixes that. I could extract ten more functions and the problem would
be exactly the same. Abstraction is about how much detail you hide. Declarative is about whether
the description is in one place. They are different axes.

The declarative version doesn't need more abstraction. It needs less scattering:

```ts
class Cart {
  private items: Item[] = [];
  private discount = 0;

  get total() {
    return sumItems(this.items) - this.discount;
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  removeItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
  }

  applyDiscount(amount: number) {
    this.discount = amount;
  }
}
```

`total` is described once, right where it lives, in terms of what it actually depends on. The
mutators only touch the facts they own. There's no `recalculateTotal` to forget, because there's
nothing to keep in sync. This version has _fewer_ moving parts and _less_ abstraction than the
first one, and it's the declarative one. That's the part the loop-vs-filter example never tells you.

## Derived values that depend on each other

The cart above had just one derived value, easy to keep in sync by hand, and deriving it barely
feels worth the trouble. The payoff shows up when values depend on other derived values. A
real checkout isn't just a total: it's a subtotal, then a total after discount, then tax on that
total, then a grand total with shipping. Each one feeds the next.

Do that imperatively and every input change has to walk the whole chain, in the right order,
without missing a step: change the discount, recompute the total, then the tax, then the grand
total. Miss one, or run them out of order, and the numbers are quietly wrong. The description of
`grandTotal` is now smeared across every method that touches anything upstream of it.

Any modern framework lets you write that same chain declaratively instead. Here it is with
Angular signals:

```ts
@Component({
  template: `<p>Due today: {{ grandTotal() }}</p>`,
})
class CheckoutComponent {
  private items = signal<Item[]>([]);
  private discount = signal(0);
  private shipping = signal(0);

  private subtotal = computed(() => sumItems(this.items()));
  private total = computed(() => this.subtotal() - this.discount());
  private tax = computed(() => this.total() * TAX_RATE);
  readonly grandTotal = computed(() => this.total() + this.tax() + this.shipping());
}
```

Every value is described once, in terms of the ones below it. There is no recompute order to get
right, because the dependencies _are_ the order. Change any input and the whole chain, including
what the template shows, resolves itself. The more the values depend on each other, the more the
scattering costs you.

Angular signal made that clean, but they aren't what made it declarative. Describing each value
in one place did. Declarative isn't something a framework _gives_ you; it's a mental model you
bring. Every time you decide whether a value describes itself or gets described from the outside,
that's the choice that makes code declarative, not the library you chose.

## The thinking outlives the typing

_"I don't write code anymore, the AI does it for me. Why should I care whether it's declarative?"_

Because an AI model is confident even when it's wrong. When you stop writing the code, the work
shifts from writing it to judging it, and you can't judge what you can't frame. A system reacts
to input/events, so following how the data flows, where each value comes from and what it
changes, is the fastest way I know to tell whether it behaves correctly.

The deeper reason is about what the model reads, not what it writes. AI leans on the surrounding
code as its source of truth and imitates it. Work with several agents on the same feature and
that context drifts fast. If the code already scatters one value across a dozen places, the next
change spreads it across a dozen more, and bad code compounds. Keep it declarative and you hand
the AI a cleaner map to follow.

The mindset didn't retire when I stopped writing code. It became one thing I bring, and it's what
keeps my code easy to predict.
