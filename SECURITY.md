# Security Policy

## Our commitment

This repository publishes **machine-readable skills** (Markdown instructions) that AI agents and developers read to make websites agent- and answer-engine-ready. The skills are documentation and copy-paste configuration snippets — they do **not** execute on your machine. We still treat the catalog as a supply-chain artifact and verify it on every change.

## Automated checks (run on every push, PR, and weekly)

| Check | Tool | What it guarantees |
|-------|------|--------------------|
| Secret scanning | gitleaks | No credentials, tokens, or keys are ever committed |
| Static analysis | Semgrep (`p/default`, `p/secrets`) | No insecure patterns or leaked secrets in scripts |
| Content integrity | SHA-256 manifest check | Every `SKILL.md` matches the digest published in `index.json` |
| Deterministic index | `generate-index.js` reproducibility | `index.json` cannot drift from the actual skill files |
| Link safety | http(s) link audit | All external links use HTTPS |
| Payload safety | dangerous-pattern scan | No `rm -rf /`, `curl \| sh`, cookie-stealing, etc. in skills |
| Markdown lint | markdownlint-cli2 | Consistent, well-formed Markdown |

The same files are served live at `https://aipush.app/.well-known/agent-skills/`.

## Reporting a vulnerability

If you find a security issue in a skill, the index, or the build scripts,
email **security@aipush.app** or open a private GitHub security advisory.
Please do not open a public issue for security reports. We aim to respond
within 72 hours.

## Verify a skill yourself

```bash
node scripts/ci-verify.js   # checks SHA-256 integrity, link safety, and payload safety
```
