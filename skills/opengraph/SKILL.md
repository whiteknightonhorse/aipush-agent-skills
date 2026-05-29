# Add Open Graph tags

> AIPUSH agent skill · Category: Structured Data · Slug: `opengraph`

Open Graph metadata controls how pages appear when shared and gives agents a reliable title/image/type to extract.

## Why it matters

Open Graph metadata controls how pages appear when shared and gives agents a reliable title/image/type to extract.

## How to detect

Check for `og:title`, `og:type`, and `og:image` meta tags.

## How to implement

```html
<meta property="og:title" content="Page title">
<meta property="og:type" content="website">
<meta property="og:image" content="https://YOURDOMAIN/og.png">
<meta property="og:url" content="https://YOURDOMAIN/page">
<meta property="og:description" content="Concise summary.">
```

## How to verify

Rendered HTML contains at least `og:title` and `og:image`.

## References

- https://ogp.me/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
