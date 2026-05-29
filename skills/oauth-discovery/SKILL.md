# Publish OAuth/OIDC discovery metadata

> AIPUSH agent skill · Category: Identity & Auth · Slug: `oauth-discovery`

Discovery metadata lets agents learn programmatically how to authenticate with your protected APIs — endpoints, supported grants, and key material — without hardcoding.

## Why it matters

Discovery metadata lets agents learn programmatically how to authenticate with your protected APIs — endpoints, supported grants, and key material — without hardcoding.

## How to detect

Request `/.well-known/openid-configuration` (OIDC) or `/.well-known/oauth-authorization-server` (OAuth 2.0).

## How to implement

If you have protected APIs, publish discovery metadata:

```json
{
  "issuer": "https://YOURDOMAIN",
  "authorization_endpoint": "https://YOURDOMAIN/oauth/authorize",
  "token_endpoint": "https://YOURDOMAIN/oauth/token",
  "jwks_uri": "https://YOURDOMAIN/.well-known/jwks.json",
  "grant_types_supported": ["authorization_code", "client_credentials"],
  "response_types_supported": ["code"]
}
```

## How to verify

`curl -s https://YOURDOMAIN/.well-known/openid-configuration | jq .token_endpoint` returns your endpoint.

## References

- https://openid.net/specs/openid-connect-discovery-1_0.html
- https://www.rfc-editor.org/rfc/rfc8414

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
