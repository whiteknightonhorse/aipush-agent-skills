# AIPUSH Agent Skills

Free, open, machine-readable skills that make any website ready for AI agents and answer engines (AEO — Answer Engine Optimization).

Each skill is a single `SKILL.md` describing one improvement: what it is, why it matters, how to detect whether your site already does it, and exactly how to implement it (copy-paste ready for an AI coding agent or a developer).

- **Live analyzer:** https://aipush.app — scan your site and get a prioritized, copy-ready fix list built from these skills.
- **Served from the site too:** every skill is also available at `https://aipush.app/.well-known/agent-skills/{slug}/SKILL.md`, indexed by `https://aipush.app/.well-known/agent-skills/index.json`.

## Catalog

Skills live under [`skills/{slug}/SKILL.md`](skills/). The machine-readable index is [`index.json`](index.json) (regenerate with `node generate-index.js`).

## License

These skills are published for free public use. Attribution to AIPUSH (https://aipush.app) is appreciated.
