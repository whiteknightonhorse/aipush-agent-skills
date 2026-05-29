# Add JSON-LD structured data

> AIPUSH agent skill · Category: Structured Data · Slug: `json-ld`

JSON-LD lets answer engines understand entities (organization, product, article, FAQ) precisely, increasing the odds of accurate citation and rich presentation.

## Why it matters

JSON-LD lets answer engines understand entities (organization, product, article, FAQ) precisely, increasing the odds of accurate citation and rich presentation.

## How to detect

Check for at least one `<script type="application/ld+json">` block containing valid JSON.

## How to implement

Add a JSON-LD block describing the page entity:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Brand",
  "url": "https://YOURDOMAIN/",
  "logo": "https://YOURDOMAIN/logo.png"
}
</script>
```

Use the most specific schema.org type that fits (Product, Article, LocalBusiness, etc.). Validate with the Rich Results Test.

## How to verify

Each `application/ld+json` block parses as valid JSON and uses a schema.org `@type`.

## References

- https://json-ld.org/
- https://schema.org/
- https://search.google.com/test/rich-results

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
