#!/usr/bin/env node
// Generates index.json for the AIPUSH agent-skills catalog.
// Deterministic: walks skills/{slug}/SKILL.md, computes sha256 of each file,
// and writes index.json sorted by slug. Run: node generate-index.js

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = __dirname;
const SKILLS_DIR = path.join(ROOT, "skills");
const BASE_URL = "https://aipush.app/.well-known/agent-skills";

function firstHeading(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function descriptionLine(md) {
  // First non-empty, non-heading line after the title.
  const lines = md.split("\n");
  let seenH1 = false;
  for (const line of lines) {
    const t = line.trim();
    if (!seenH1) {
      if (/^#\s+/.test(t)) seenH1 = true;
      continue;
    }
    if (t.length === 0 || t.startsWith("#") || t.startsWith(">")) continue;
    return t.replace(/[*_`]/g, "").slice(0, 240);
  }
  return "";
}

const slugs = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const skills = [];
for (const slug of slugs) {
  const file = path.join(SKILLS_DIR, slug, "SKILL.md");
  if (!fs.existsSync(file)) continue;
  const md = fs.readFileSync(file, "utf8");
  const sha256 = crypto.createHash("sha256").update(md, "utf8").digest("hex");
  skills.push({
    name: firstHeading(md) || slug,
    slug,
    type: "agent-skill",
    description: descriptionLine(md),
    url: `${BASE_URL}/${slug}/SKILL.md`,
    sha256,
  });
}

const index = {
  $schema: "https://agentskills.io/schemas/index-v0.2.0.json",
  generator: "aipush-agent-skills",
  updated_at: process.env.AEO_INDEX_DATE || null,
  skills,
};

fs.writeFileSync(path.join(ROOT, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(`Wrote index.json with ${skills.length} skills.`);
