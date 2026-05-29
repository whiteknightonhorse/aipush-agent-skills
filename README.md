# AIPUSH Agent Skills

> Free, open, security-verified machine-readable skills that make any website ready for **AI agents** and **answer engines** (AEO — Answer Engine Optimization).

[![security](https://github.com/whiteknightonhorse/aipush-agent-skills/actions/workflows/security.yml/badge.svg)](https://github.com/whiteknightonhorse/aipush-agent-skills/actions/workflows/security.yml)
[![integrity](https://github.com/whiteknightonhorse/aipush-agent-skills/actions/workflows/integrity.yml/badge.svg)](https://github.com/whiteknightonhorse/aipush-agent-skills/actions/workflows/integrity.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/whiteknightonhorse/aipush-agent-skills/badge)](https://securityscorecards.dev/viewer/?uri=github.com/whiteknightonhorse/aipush-agent-skills)
[![secrets: gitleaks](https://img.shields.io/badge/secrets-scanned%20by%20gitleaks-brightgreen)](https://github.com/gitleaks/gitleaks)
[![SAST: Semgrep](https://img.shields.io/badge/SAST-Semgrep-2596be)](https://semgrep.dev)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![skills](https://img.shields.io/badge/skills-25-df8e1d)](index.json)

**Live analyzer: [https://aipush.app](https://aipush.app)** — scan your site and get a prioritized, copy-ready fix list built from these skills.

Every skill is also served from the site at
`https://aipush.app/.well-known/agent-skills/{slug}/SKILL.md`,
indexed by [`https://aipush.app/.well-known/agent-skills/index.json`](https://aipush.app/.well-known/agent-skills/index.json).

---

## What is this?

When a person asks ChatGPT, Claude, Perplexity, or Gemini for a recommendation, those AI agents read the open web through machine-readable signals — `robots.txt` rules, sitemaps, `Link` headers, structured data, MCP server cards, and more. Most sites expose almost none of them.

Each **skill** here is a single `SKILL.md` describing one improvement:

- **Goal** — what it is, in one line
- **Why it matters** — the business reason
- **How to detect** — check whether your site already does it
- **How to implement** — copy-paste-ready config/code for an AI agent or developer
- **How to verify** — confirm it works

Point your AI coding agent (Cursor, Claude Code, Copilot) at a skill URL, or paste the "Copy all fixes" bundle from [aipush.app](https://aipush.app), and it can implement the fixes automatically.

## Security & integrity

These skills are documentation, not executables — but we treat the catalog as a supply-chain artifact and verify it on **every push, PR, and weekly**:

- 🔑 **gitleaks** — secret scanning (no keys/tokens ever)
- 🔍 **Semgrep** — static analysis of the build scripts
- 🛡️ **Trivy** + **OpenSSF Scorecard** — vulnerability + supply-chain posture
- 🧾 **SHA-256 integrity** — every `SKILL.md` matches the digest in `index.json`
- ♻️ **deterministic index** — `index.json` cannot drift from the files
- 🔗 **link safety** — all external links are HTTPS
- 🚫 **payload safety** — no dangerous shell/script patterns in any skill

See [SECURITY.md](SECURITY.md) for details and how to verify a skill yourself.

## Catalog

Skills live under [`skills/{slug}/SKILL.md`](skills/). The machine-readable index is [`index.json`](index.json).

| Category | Skills |
|----------|--------|
| **Agent Discovery** | robots.txt · AI bot rules · Content Signals · sitemap |
| **Agent Interfaces** | Link headers · Markdown negotiation · API Catalog · MCP Server Card · Agent Skills index · WebMCP · Web Bot Auth |
| **Identity & Auth** | OAuth/OIDC discovery · OAuth Protected Resource |
| **Content Structure** | single H1 · title & meta · canonical · viewport & lang |
| **Structured Data** | JSON-LD · FAQ schema · Open Graph · answer units |
| **Commerce** | x402 · MPP · UCP · ACP |

## Regenerating the index

```bash
node generate-index.js      # recomputes index.json (name, description, url, sha256) from skills/
node scripts/ci-verify.js   # verify integrity, links, and safety
```

## License

[MIT](LICENSE) — free for public use. Attribution to AIPUSH ([aipush.app](https://aipush.app)) is appreciated.
