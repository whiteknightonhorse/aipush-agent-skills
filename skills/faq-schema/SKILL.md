# Mark up FAQs with FAQPage schema

> AIPUSH agent skill · Category: Structured Data · Slug: `faq-schema`

FAQPage structured data is a strong, directly-citable answer-unit format — AI engines quote question/answer pairs verbatim.

## Why it matters

FAQPage structured data is a strong, directly-citable answer-unit format — AI engines quote question/answer pairs verbatim.

## How to detect

Check JSON-LD blocks for `"@type": "FAQPage"`.

## How to implement

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is AEO?",
    "acceptedAnswer": { "@type": "Answer", "text": "Answer Engine Optimization makes your site easy for AI assistants to read and cite." }
  }]
}
</script>
```

The schema must mirror the visible FAQ on the page.

## How to verify

A JSON-LD block contains `FAQPage` with `Question`/`acceptedAnswer` pairs.

## References

- https://schema.org/FAQPage

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
