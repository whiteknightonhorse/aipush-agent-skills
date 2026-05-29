# Set viewport and language

> AIPUSH agent skill · Category: Content Structure · Slug: `viewport-lang`

A viewport meta signals mobile-friendliness; `<html lang>` declares content language. Both help crawlers, agents, and accessibility tools interpret your page correctly.

## Why it matters

A viewport meta signals mobile-friendliness; `<html lang>` declares content language. Both help crawlers, agents, and accessibility tools interpret your page correctly.

## How to detect

Check for `<meta name="viewport">` and a `lang` attribute on `<html>`.

## How to implement

```html
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
</html>
```

Use the correct BCP-47 language tag (`en`, `en-US`, `de`, etc.).

## How to verify

Rendered HTML has both a viewport meta and an `<html lang>` value.

## References

- https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
