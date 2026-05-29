# Publish OAuth Protected Resource Metadata

> AIPUSH agent skill · Category: Identity & Auth · Slug: `oauth-protected-resource`

RFC 9728 metadata tells agents which authorization servers can issue tokens for your resource and which scopes exist — so they can obtain the right access token.

## Why it matters

RFC 9728 metadata tells agents which authorization servers can issue tokens for your resource and which scopes exist — so they can obtain the right access token.

## How to detect

Request `https://YOURDOMAIN/.well-known/oauth-protected-resource` (HTTP 200, valid JSON).

## How to implement

Serve `/.well-known/oauth-protected-resource`:

```json
{
  "resource": "https://YOURDOMAIN",
  "authorization_servers": ["https://YOURDOMAIN"],
  "scopes_supported": ["read", "write"],
  "bearer_methods_supported": ["header"]
}
```

## How to verify

`curl -s https://YOURDOMAIN/.well-known/oauth-protected-resource | jq .authorization_servers` lists your AS.

## References

- https://www.rfc-editor.org/rfc/rfc9728

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
