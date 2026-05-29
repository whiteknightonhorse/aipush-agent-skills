# Publish an agent skills index

> AIPUSH agent skill · Category: Agent Interfaces · Slug: `agent-skills`

A skills index lets agents discover machine-readable instructions for working with your site — what they can do and how, with integrity hashes.

## Why it matters

A skills index lets agents discover machine-readable instructions for working with your site — what they can do and how, with integrity hashes.

## How to detect

Request `https://YOURDOMAIN/.well-known/agent-skills/index.json` (HTTP 200, valid JSON with a `skills` array).

## How to implement

Serve `/.well-known/agent-skills/index.json`:

```json
{
  "$schema": "https://agentskills.io/schemas/index-v0.2.0.json",
  "skills": [
    {
      "name": "Create a booking",
      "type": "agent-skill",
      "description": "How an agent books an appointment via our API.",
      "url": "https://YOURDOMAIN/.well-known/agent-skills/create-booking/SKILL.md",
      "sha256": "<sha256 of the SKILL.md file>"
    }
  ]
}
```

Serve each `SKILL.md` as `text/markdown`. Recompute `sha256` whenever a skill changes.

## How to verify

`curl -s https://YOURDOMAIN/.well-known/agent-skills/index.json | jq '.skills | length'` is ≥ 1.

## References

- https://github.com/cloudflare/agent-skills-discovery-rfc
- https://agentskills.io/

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
