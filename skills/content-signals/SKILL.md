# Declare AI usage with Content Signals

> AIPUSH agent skill · Category: Agent Discovery · Slug: `content-signals`

Crawl permission and *usage* permission are different things. Content Signals let you state, per purpose, whether your content may be used for AI training, classic search, or AI answer input — independent of whether a bot may crawl.

## Why it matters

Crawl permission and *usage* permission are different things. Content Signals let you state, per purpose, whether your content may be used for AI training, classic search, or AI answer input — independent of whether a bot may crawl.

## How to detect

Check `robots.txt` for one or more `Content-Signal:` directives.

## How to implement

Add a `Content-Signal` line to `robots.txt` (it applies to the preceding `User-agent` group, or globally under `User-agent: *`):

```
User-agent: *
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes
```

- `ai-train` — may content be used to train models?
- `search` — may content appear in search indexes?
- `ai-input` — may content be retrieved as context for AI answers?

## How to verify

`curl -s https://YOURDOMAIN/robots.txt | grep -i 'Content-Signal'` returns your directive.

## References

- https://contentsignals.org/
- https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
