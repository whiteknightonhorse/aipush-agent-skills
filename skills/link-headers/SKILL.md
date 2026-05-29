# Add Link response headers (RFC 8288)

> AIPUSH agent skill · Category: Agent Interfaces · Slug: `link-headers`

`Link` response headers let agents discover related resources (API catalog, docs, manifests) without parsing HTML — fast, language-agnostic discovery.

## Why it matters

`Link` response headers let agents discover related resources (API catalog, docs, manifests) without parsing HTML — fast, language-agnostic discovery.

## How to detect

Inspect the homepage response headers for a `Link:` header.

## How to implement

Emit a `Link` header on your homepage (and ideally all HTML responses):

```
Link: </.well-known/api-catalog>; rel="api-catalog", </.well-known/agent-skills/index.json>; rel="agent-skills", </docs/api>; rel="service-doc"
```

Express example:

```js
app.use((req, res, next) => {
  res.setHeader('Link', '</.well-known/api-catalog>; rel="api-catalog", </.well-known/agent-skills/index.json>; rel="agent-skills"');
  next();
});
```

Use registered IANA link relations where possible.

## How to verify

`curl -sI https://YOURDOMAIN/ | grep -i '^link:'` shows your header.

## References

- https://www.rfc-editor.org/rfc/rfc8288
- https://www.iana.org/assignments/link-relations/link-relations.xhtml

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
