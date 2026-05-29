# Publish an API catalog (RFC 9727)

> AIPUSH agent skill · Category: Agent Interfaces · Slug: `api-catalog`

An API catalog lets agents find your service description (OpenAPI), documentation, and status endpoints programmatically — the entry point for automated integration.

## Why it matters

An API catalog lets agents find your service description (OpenAPI), documentation, and status endpoints programmatically — the entry point for automated integration.

## How to detect

Request `https://YOURDOMAIN/.well-known/api-catalog` (HTTP 200, `Content-Type: application/linkset+json`).

## How to implement

Serve `/.well-known/api-catalog` as `application/linkset+json`:

```json
{
  "linkset": [
    {
      "anchor": "https://YOURDOMAIN/api",
      "service-desc": [{ "href": "https://YOURDOMAIN/openapi.json", "type": "application/json" }],
      "service-doc": [{ "href": "https://YOURDOMAIN/docs/api", "type": "text/html" }],
      "status": [{ "href": "https://YOURDOMAIN/api/health" }]
    }
  ]
}
```

## How to verify

`curl -s https://YOURDOMAIN/.well-known/api-catalog | jq .linkset` returns your entries.

## References

- https://www.rfc-editor.org/rfc/rfc9727
- https://www.rfc-editor.org/rfc/rfc9264

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
