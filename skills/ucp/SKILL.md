# Enable Universal Commerce Protocol

> AIPUSH agent skill · Category: Commerce · Slug: `ucp`

UCP lets agents discover your commerce capabilities, services, and endpoints from a single well-known profile.

## Why it matters

UCP lets agents discover your commerce capabilities, services, and endpoints from a single well-known profile.

## How to detect

Request `https://YOURDOMAIN/.well-known/ucp` (HTTP 200, valid JSON).

## How to implement

Serve `/.well-known/ucp` with protocol version, services, capabilities, and endpoints; ensure all referenced spec/schema URLs are reachable:

```json
{
  "version": "1.0",
  "services": ["catalog", "checkout"],
  "capabilities": { "payments": true },
  "endpoints": { "catalog": "https://YOURDOMAIN/api/catalog" }
}
```

## How to verify

`curl -s https://YOURDOMAIN/.well-known/ucp | jq .services` lists your services.

## References

- https://ucp.dev/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
