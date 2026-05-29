# Publish a valid robots.txt

> AIPUSH agent skill · Category: Agent Discovery · Slug: `robots-txt`

robots.txt is the first file crawlers and AI agents read to learn how they may access your site. A missing or malformed file leaves agents guessing.

## Why it matters

robots.txt is the first file crawlers and AI agents read to learn how they may access your site. A missing or malformed file leaves agents guessing.

## How to detect

Request `https://YOURDOMAIN/robots.txt`. It should return HTTP 200 with `Content-Type: text/plain` and contain at least one `User-agent` group.

## How to implement

Serve a `/robots.txt` from your web root:

```
User-agent: *
Allow: /

Sitemap: https://YOURDOMAIN/sitemap.xml
```

Serve it as `text/plain; charset=utf-8`. Keep it at the exact path `/robots.txt` (no redirects to other paths).

## How to verify

`curl -sI https://YOURDOMAIN/robots.txt` returns `200` and `content-type: text/plain`.

## References

- https://www.rfc-editor.org/rfc/rfc9309

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
