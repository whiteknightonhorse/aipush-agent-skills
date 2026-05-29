# Use exactly one clear H1

> AIPUSH agent skill · Category: Content Structure · Slug: `h1-structure`

A single descriptive `<h1>` tells crawlers and answer engines the page's primary topic. Zero or multiple H1s create ambiguity about what the page is about.

## Why it matters

A single descriptive `<h1>` tells crawlers and answer engines the page's primary topic. Zero or multiple H1s create ambiguity about what the page is about.

## How to detect

Count non-empty `<h1>` elements in the homepage HTML — there should be exactly one.

## How to implement

Ensure each page has exactly one non-empty `<h1>` that states the page's topic, with `<h2>`/`<h3>` for sub-sections:

```html
<h1>AI Visibility Analyzer for Your Website</h1>
<h2>What it checks</h2>
<h2>How to fix issues</h2>
```

Demote any extra H1s.

## How to verify

Count of non-empty `<h1>` in the rendered HTML equals 1.

## References

- https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
