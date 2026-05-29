# Publish and reference a sitemap.xml

> AIPUSH agent skill · Category: Agent Discovery · Slug: `sitemap`

A sitemap tells crawlers and agents which URLs are canonical and worth indexing, with freshness signals. It improves coverage and how quickly new content is discovered.

## Why it matters

A sitemap tells crawlers and agents which URLs are canonical and worth indexing, with freshness signals. It improves coverage and how quickly new content is discovered.

## How to detect

Request `https://YOURDOMAIN/sitemap.xml` (HTTP 200, valid `<urlset>` or `<sitemapindex>`), and check that `robots.txt` has a `Sitemap:` line.

## How to implement

Serve `/sitemap.xml` as `application/xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://YOURDOMAIN/</loc>
    <lastmod>2026-01-01</lastmod>
  </url>
  <url>
    <loc>https://YOURDOMAIN/pricing</loc>
    <lastmod>2026-01-01</lastmod>
  </url>
</urlset>
```

Then reference it in `robots.txt`:

```
Sitemap: https://YOURDOMAIN/sitemap.xml
```

For large sites use a `<sitemapindex>` splitting into multiple sitemaps (max 50,000 URLs / 50MB each).

## How to verify

`curl -s https://YOURDOMAIN/sitemap.xml | head` shows valid XML; `grep -i sitemap robots.txt` shows the reference.

## References

- https://www.sitemaps.org/protocol.html

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
