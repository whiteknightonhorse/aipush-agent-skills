# Support MPP machine payments

> AIPUSH agent skill · Category: Commerce · Slug: `mpp`

The Machine Payment Protocol advertises payable operations in your OpenAPI so agents can discover prices and transact programmatically.

## Why it matters

The Machine Payment Protocol advertises payable operations in your OpenAPI so agents can discover prices and transact programmatically.

## How to detect

`/openapi.json` includes `x-payment` info on payable operations.

## How to implement

Annotate payable operations in your OpenAPI document with `x-payment-info` and add MPP middleware (mppx for TypeScript, pympp for Python):

```json
{
  "paths": { "/api/generate": { "post": {
    "x-payment-info": { "intent": "charge", "method": "card", "amount": 100, "currency": "USD" }
  }}}
}
```

## How to verify

`curl -s https://YOURDOMAIN/openapi.json | jq '.. | ."x-payment-info"? // empty'` returns your entries.

## References

- https://mpp.dev/
- https://paymentauth.org/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
