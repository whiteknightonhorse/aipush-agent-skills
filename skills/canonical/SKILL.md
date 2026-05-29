# Declare an absolute canonical URL

> AIPUSH agent skill · Category: Content Structure · Slug: `canonical`

Canonical URLs consolidate duplicate/variant URLs so engines index and cite the single correct version — avoiding split signals and wrong citations.

## Why it matters

Canonical URLs consolidate duplicate/variant URLs so engines index and cite the single correct version — avoiding split signals and wrong citations.

## How to detect

Check for `<link rel="canonical" href="https://...">` with an absolute URL in the head.

## How to implement

```html
<link rel="canonical" href="https://YOURDOMAIN/page">
```

Use the absolute, preferred URL (correct protocol, host, and path). One canonical per page.

## How to verify

Rendered HTML contains an absolute `rel=canonical` link.

## References

- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
