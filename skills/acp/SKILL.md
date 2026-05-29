# Publish ACP commerce discovery

> AIPUSH agent skill · Category: Commerce · Slug: `acp`

The Agentic Commerce Protocol lets agents discover your commerce API and create checkout sessions without bespoke integration.

## Why it matters

The Agentic Commerce Protocol lets agents discover your commerce API and create checkout sessions without bespoke integration.

## How to detect

Request `https://YOURDOMAIN/.well-known/acp.json` (HTTP 200, valid JSON).

## How to implement

Serve `/.well-known/acp.json` at the origin root:

```json
{
  "protocol": { "name": "acp", "version": "1.0" },
  "api_base_url": "https://YOURDOMAIN/api",
  "supported_transports": ["https"],
  "capabilities": { "services": ["checkout"] }
}
```

## How to verify

`curl -s https://YOURDOMAIN/.well-known/acp.json | jq .protocol.name` returns `acp`.

## References

- https://agenticcommerce.dev/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
