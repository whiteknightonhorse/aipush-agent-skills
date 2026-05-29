# Declare AI crawler rules in robots.txt

> AIPUSH agent skill · Category: Agent Discovery · Slug: `ai-bot-rules`

AI assistants (ChatGPT, Claude, Perplexity, Gemini) crawl with named user-agents. Explicit rules let you control whether they may read and cite your content — silence means inconsistent behavior across providers.

## Why it matters

AI assistants (ChatGPT, Claude, Perplexity, Gemini) crawl with named user-agents. Explicit rules let you control whether they may read and cite your content — silence means inconsistent behavior across providers.

## How to detect

Check `robots.txt` for `User-agent:` groups naming the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.).

## How to implement

Add per-crawler groups. To allow AI citation of your public pages:

```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

To *disallow* training while allowing answer citation, set `Disallow: /` only under the training crawlers you want to block.

## How to verify

`curl -s https://YOURDOMAIN/robots.txt | grep -iE 'GPTBot|ClaudeBot|PerplexityBot'` shows your rules.

## References

- https://www.rfc-editor.org/rfc/rfc9309
- https://platform.openai.com/docs/bots

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
