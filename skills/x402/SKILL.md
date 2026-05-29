# Support x402 agent payments

> AIPUSH agent skill · Category: Commerce · Slug: `x402`

x402 lets AI agents pay for access to protected routes automatically over HTTP 402 — enabling pay-per-use APIs and content for autonomous agents.

## Why it matters

x402 lets AI agents pay for access to protected routes automatically over HTTP 402 — enabling pay-per-use APIs and content for autonomous agents.

## How to detect

A protected route returns HTTP 402 with machine-readable payment requirements.

## How to implement

Add x402 middleware to protected routes with a facilitator URL and wallet address:

```js
import { paymentMiddleware } from '@x402/express';
app.use(paymentMiddleware({
  facilitatorUrl: 'https://facilitator.example',
  address: '0xYourWallet',
  routes: { '/api/premium': { price: '$0.01' } }
}));
```

Unpaid requests get a 402 with payment instructions agents can fulfil and retry.

## How to verify

`curl -si https://YOURDOMAIN/api/premium` returns `402` with payment requirement headers/body.

## References

- https://www.x402.org/
- https://docs.x402.org/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
