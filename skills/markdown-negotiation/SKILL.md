# Serve Markdown to agents on request

> AIPUSH agent skill · Category: Agent Interfaces · Slug: `markdown-negotiation`

Agents parse Markdown far more reliably than HTML, with fewer tokens and fewer extraction errors. Content-negotiating Markdown gives agents a clean read while browsers still get HTML.

## Why it matters

Agents parse Markdown far more reliably than HTML, with fewer tokens and fewer extraction errors. Content-negotiating Markdown gives agents a clean read while browsers still get HTML.

## How to detect

Send `Accept: text/markdown` to a page URL; a compliant site responds `200` with `Content-Type: text/markdown`.

## How to implement

Content-negotiate on the `Accept` header. When it includes `text/markdown`, return a Markdown rendering of the same content:

```js
app.get('/*', (req, res, next) => {
  if ((req.headers.accept || '').includes('text/markdown')) {
    const md = renderMarkdownFor(req.path); // your HTML->MD or source MD
    res.type('text/markdown; charset=utf-8').send(md);
    return;
  }
  next(); // default HTML for browsers
});
```

Keep HTML the default. Optionally add an `x-markdown-tokens` header with the token count.

## How to verify

`curl -s -H 'Accept: text/markdown' https://YOURDOMAIN/ -o /dev/null -w '%{content_type}\n'` prints `text/markdown`.

## References

- https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
