#!/usr/bin/env node
// CI integrity + safety verification for the AIPUSH agent-skills catalog.
// Exits non-zero on any failure. Run: node scripts/ci-verify.js

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
let failures = 0;
const fail = (m) => { console.error("FAIL " + m); failures++; };
const ok = (m) => console.log("OK   " + m);

// 1) SHA-256 manifest integrity
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, "index.json"), "utf8"));
let mismatches = 0;
for (const s of idx.skills) {
  const f = path.join(ROOT, "skills", s.slug, "SKILL.md");
  if (!fs.existsSync(f)) { fail("missing skill file: " + s.slug); mismatches++; continue; }
  const h = crypto.createHash("sha256").update(fs.readFileSync(f, "utf8")).digest("hex");
  if (h !== s.sha256) { fail("SHA-256 mismatch: " + s.slug); mismatches++; }
}
if (!mismatches) ok("SHA-256: all " + idx.skills.length + " skills match index.json");

// 2) Deterministic index regeneration (ignore volatile updated_at)
const before = fs.readFileSync(path.join(ROOT, "index.json"), "utf8");
try {
  execSync("node generate-index.js", { cwd: ROOT, stdio: "ignore" });
  const after = fs.readFileSync(path.join(ROOT, "index.json"), "utf8");
  const norm = (t) => { const j = JSON.parse(t); j.updated_at = null; return JSON.stringify(j); };
  if (norm(before) !== norm(after)) fail("index.json is stale - run `node generate-index.js` and commit");
  else ok("index.json is deterministic and up to date");
  fs.writeFileSync(path.join(ROOT, "index.json"), before); // restore exact committed bytes
} catch (e) {
  fail("generate-index.js failed: " + e.message);
}

// 3) Link safety - no insecure http:// links (allow spec namespaces)
const allow = /^http:\/\/(www\.w3\.org|schema\.org|openid\.net|ns\.adobe\.com)/;
const skillsDir = path.join(ROOT, "skills");
let insecure = 0;
for (const slug of fs.readdirSync(skillsDir)) {
  const f = path.join(skillsDir, slug, "SKILL.md");
  if (!fs.existsSync(f)) continue;
  const md = fs.readFileSync(f, "utf8");
  for (const m of md.match(/http:\/\/[^\s)"'>]+/g) || []) {
    if (!allow.test(m)) { fail("insecure link in " + slug + ": " + m); insecure++; }
  }
}
if (!insecure) ok("link safety: all external links are HTTPS");

// 4) No dangerous payloads in skills (defence in depth - skills are docs)
let danger = 0;
const DANGER = [/rm\s+-rf\s+\//, /curl[^\n]*\|\s*(sudo\s+)?(ba)?sh/, /eval\(atob/, /document\.cookie/];
for (const slug of fs.readdirSync(skillsDir)) {
  const f = path.join(skillsDir, slug, "SKILL.md");
  if (!fs.existsSync(f)) continue;
  const md = fs.readFileSync(f, "utf8");
  for (const re of DANGER) if (re.test(md)) { fail("dangerous pattern in " + slug + ": " + re); danger++; }
}
if (!danger) ok("safety: no dangerous shell/script payloads in skills");

if (failures) { console.error("\n" + failures + " check(s) failed."); process.exit(1); }
console.log("\nAll integrity & safety checks passed.");
