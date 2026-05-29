# Provide title and meta description

> AIPUSH agent skill · Category: Content Structure · Slug: `meta-tags`

`<title>` and `<meta name=description>` are used directly in search results and AI answer snippets. Missing or poorly sized values lead to truncated or auto-generated snippets you don't control.

## Why it matters

`<title>` and `<meta name=description>` are used directly in search results and AI answer snippets. Missing or poorly sized values lead to truncated or auto-generated snippets you don't control.

## How to detect

Check for a non-empty `<title>` and a `<meta name="description">` of roughly 50–320 characters.

## How to implement

```html
<title>Clear, unique page title — Brand</title>
<meta name="description" content="A concise 50–320 character summary of what this page offers and why it matters.">
```

Keep each page's title and description unique.

## How to verify

Rendered HTML has a non-empty `<title>` and a description meta within length bounds.

## References

- https://developer.mozilla.org/docs/Web/HTML/Element/meta

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
