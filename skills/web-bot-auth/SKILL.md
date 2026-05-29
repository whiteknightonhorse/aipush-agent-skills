# Sign bot requests with Web Bot Auth

> AIPUSH agent skill · Category: Agent Interfaces · Slug: `web-bot-auth`

If your service makes outbound bot/agent requests, publishing a signing-key directory lets receiving sites verify your requests via HTTP Message Signatures — building trust and avoiding blocks.

## Why it matters

If your service makes outbound bot/agent requests, publishing a signing-key directory lets receiving sites verify your requests via HTTP Message Signatures — building trust and avoiding blocks.

## How to detect

Request `https://YOURDOMAIN/.well-known/http-message-signatures-directory` (a JWKS of your public keys).

## How to implement

Publish your public signing keys as a JWKS at `/.well-known/http-message-signatures-directory`, and sign outbound requests per HTTP Message Signatures (RFC 9421) with a `Signature` and `Signature-Input` header keyed to one of those keys.

## How to verify

`curl -s https://YOURDOMAIN/.well-known/http-message-signatures-directory | jq .keys` lists your public keys.

## References

- https://www.rfc-editor.org/rfc/rfc9421
- https://datatracker.ietf.org/wg/httpbis/about/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
