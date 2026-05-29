#!/usr/bin/env node
// Deterministic generator for the AIPUSH agent-skills catalog content.
// Writes skills/{slug}/SKILL.md for every entry below, then regenerates index.json.
// Run: node build-skills.js

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const ROOT = __dirname;
const SKILLS_DIR = path.join(ROOT, "skills");

// Each skill: name, category, detect (how to check), implement (markdown body
// with code), verify (how to confirm), docs[].
const SKILLS = {
  "robots-txt": {
    name: "Publish a valid robots.txt",
    category: "Agent Discovery",
    why: "robots.txt is the first file crawlers and AI agents read to learn how they may access your site. A missing or malformed file leaves agents guessing.",
    detect: "Request `https://YOURDOMAIN/robots.txt`. It should return HTTP 200 with `Content-Type: text/plain` and contain at least one `User-agent` group.",
    implement: "Serve a `/robots.txt` from your web root:\n\n```\nUser-agent: *\nAllow: /\n\nSitemap: https://YOURDOMAIN/sitemap.xml\n```\n\nServe it as `text/plain; charset=utf-8`. Keep it at the exact path `/robots.txt` (no redirects to other paths).",
    verify: "`curl -sI https://YOURDOMAIN/robots.txt` returns `200` and `content-type: text/plain`.",
    docs: ["https://www.rfc-editor.org/rfc/rfc9309"],
  },
  "ai-bot-rules": {
    name: "Declare AI crawler rules in robots.txt",
    category: "Agent Discovery",
    why: "AI assistants (ChatGPT, Claude, Perplexity, Gemini) crawl with named user-agents. Explicit rules let you control whether they may read and cite your content — silence means inconsistent behavior across providers.",
    detect: "Check `robots.txt` for `User-agent:` groups naming the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.).",
    implement: "Add per-crawler groups. To allow AI citation of your public pages:\n\n```\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Claude-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n```\n\nTo *disallow* training while allowing answer citation, set `Disallow: /` only under the training crawlers you want to block.",
    verify: "`curl -s https://YOURDOMAIN/robots.txt | grep -iE 'GPTBot|ClaudeBot|PerplexityBot'` shows your rules.",
    docs: ["https://www.rfc-editor.org/rfc/rfc9309", "https://platform.openai.com/docs/bots"],
  },
  "content-signals": {
    name: "Declare AI usage with Content Signals",
    category: "Agent Discovery",
    why: "Crawl permission and *usage* permission are different things. Content Signals let you state, per purpose, whether your content may be used for AI training, classic search, or AI answer input — independent of whether a bot may crawl.",
    detect: "Check `robots.txt` for one or more `Content-Signal:` directives.",
    implement: "Add a `Content-Signal` line to `robots.txt` (it applies to the preceding `User-agent` group, or globally under `User-agent: *`):\n\n```\nUser-agent: *\nAllow: /\nContent-Signal: ai-train=no, search=yes, ai-input=yes\n```\n\n- `ai-train` — may content be used to train models?\n- `search` — may content appear in search indexes?\n- `ai-input` — may content be retrieved as context for AI answers?",
    verify: "`curl -s https://YOURDOMAIN/robots.txt | grep -i 'Content-Signal'` returns your directive.",
    docs: ["https://contentsignals.org/", "https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/"],
  },
  "sitemap": {
    name: "Publish and reference a sitemap.xml",
    category: "Agent Discovery",
    why: "A sitemap tells crawlers and agents which URLs are canonical and worth indexing, with freshness signals. It improves coverage and how quickly new content is discovered.",
    detect: "Request `https://YOURDOMAIN/sitemap.xml` (HTTP 200, valid `<urlset>` or `<sitemapindex>`), and check that `robots.txt` has a `Sitemap:` line.",
    implement: "Serve `/sitemap.xml` as `application/xml`:\n\n```xml\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <url>\n    <loc>https://YOURDOMAIN/</loc>\n    <lastmod>2026-01-01</lastmod>\n  </url>\n  <url>\n    <loc>https://YOURDOMAIN/pricing</loc>\n    <lastmod>2026-01-01</lastmod>\n  </url>\n</urlset>\n```\n\nThen reference it in `robots.txt`:\n\n```\nSitemap: https://YOURDOMAIN/sitemap.xml\n```\n\nFor large sites use a `<sitemapindex>` splitting into multiple sitemaps (max 50,000 URLs / 50MB each).",
    verify: "`curl -s https://YOURDOMAIN/sitemap.xml | head` shows valid XML; `grep -i sitemap robots.txt` shows the reference.",
    docs: ["https://www.sitemaps.org/protocol.html"],
  },
  "link-headers": {
    name: "Add Link response headers (RFC 8288)",
    category: "Agent Interfaces",
    why: "`Link` response headers let agents discover related resources (API catalog, docs, manifests) without parsing HTML — fast, language-agnostic discovery.",
    detect: "Inspect the homepage response headers for a `Link:` header.",
    implement: "Emit a `Link` header on your homepage (and ideally all HTML responses):\n\n```\nLink: </.well-known/api-catalog>; rel=\"api-catalog\", </.well-known/agent-skills/index.json>; rel=\"agent-skills\", </docs/api>; rel=\"service-doc\"\n```\n\nExpress example:\n\n```js\napp.use((req, res, next) => {\n  res.setHeader('Link', '</.well-known/api-catalog>; rel=\"api-catalog\", </.well-known/agent-skills/index.json>; rel=\"agent-skills\"');\n  next();\n});\n```\n\nUse registered IANA link relations where possible.",
    verify: "`curl -sI https://YOURDOMAIN/ | grep -i '^link:'` shows your header.",
    docs: ["https://www.rfc-editor.org/rfc/rfc8288", "https://www.iana.org/assignments/link-relations/link-relations.xhtml"],
  },
  "markdown-negotiation": {
    name: "Serve Markdown to agents on request",
    category: "Agent Interfaces",
    why: "Agents parse Markdown far more reliably than HTML, with fewer tokens and fewer extraction errors. Content-negotiating Markdown gives agents a clean read while browsers still get HTML.",
    detect: "Send `Accept: text/markdown` to a page URL; a compliant site responds `200` with `Content-Type: text/markdown`.",
    implement: "Content-negotiate on the `Accept` header. When it includes `text/markdown`, return a Markdown rendering of the same content:\n\n```js\napp.get('/*', (req, res, next) => {\n  if ((req.headers.accept || '').includes('text/markdown')) {\n    const md = renderMarkdownFor(req.path); // your HTML->MD or source MD\n    res.type('text/markdown; charset=utf-8').send(md);\n    return;\n  }\n  next(); // default HTML for browsers\n});\n```\n\nKeep HTML the default. Optionally add an `x-markdown-tokens` header with the token count.",
    verify: "`curl -s -H 'Accept: text/markdown' https://YOURDOMAIN/ -o /dev/null -w '%{content_type}\\n'` prints `text/markdown`.",
    docs: ["https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/"],
  },
  "api-catalog": {
    name: "Publish an API catalog (RFC 9727)",
    category: "Agent Interfaces",
    why: "An API catalog lets agents find your service description (OpenAPI), documentation, and status endpoints programmatically — the entry point for automated integration.",
    detect: "Request `https://YOURDOMAIN/.well-known/api-catalog` (HTTP 200, `Content-Type: application/linkset+json`).",
    implement: "Serve `/.well-known/api-catalog` as `application/linkset+json`:\n\n```json\n{\n  \"linkset\": [\n    {\n      \"anchor\": \"https://YOURDOMAIN/api\",\n      \"service-desc\": [{ \"href\": \"https://YOURDOMAIN/openapi.json\", \"type\": \"application/json\" }],\n      \"service-doc\": [{ \"href\": \"https://YOURDOMAIN/docs/api\", \"type\": \"text/html\" }],\n      \"status\": [{ \"href\": \"https://YOURDOMAIN/api/health\" }]\n    }\n  ]\n}\n```",
    verify: "`curl -s https://YOURDOMAIN/.well-known/api-catalog | jq .linkset` returns your entries.",
    docs: ["https://www.rfc-editor.org/rfc/rfc9727", "https://www.rfc-editor.org/rfc/rfc9264"],
  },
  "mcp-server-card": {
    name: "Publish an MCP Server Card",
    category: "Agent Interfaces",
    why: "A Model Context Protocol (MCP) Server Card advertises your MCP server so agents can discover and connect to your tools without manual configuration.",
    detect: "Request `https://YOURDOMAIN/.well-known/mcp/server-card.json` (HTTP 200, valid JSON).",
    implement: "Serve `/.well-known/mcp/server-card.json`:\n\n```json\n{\n  \"serverInfo\": { \"name\": \"YOURSITE\", \"version\": \"1.0.0\" },\n  \"transport\": { \"type\": \"streamable-http\", \"endpoint\": \"https://YOURDOMAIN/mcp\" },\n  \"capabilities\": { \"tools\": {}, \"resources\": {} }\n}\n```\n\nMatch the fields to the current MCP server-card schema (being standardized).",
    verify: "`curl -s https://YOURDOMAIN/.well-known/mcp/server-card.json | jq .serverInfo` returns name/version.",
    docs: ["https://modelcontextprotocol.io/", "https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127"],
  },
  "agent-skills": {
    name: "Publish an agent skills index",
    category: "Agent Interfaces",
    why: "A skills index lets agents discover machine-readable instructions for working with your site — what they can do and how, with integrity hashes.",
    detect: "Request `https://YOURDOMAIN/.well-known/agent-skills/index.json` (HTTP 200, valid JSON with a `skills` array).",
    implement: "Serve `/.well-known/agent-skills/index.json`:\n\n```json\n{\n  \"$schema\": \"https://agentskills.io/schemas/index-v0.2.0.json\",\n  \"skills\": [\n    {\n      \"name\": \"Create a booking\",\n      \"type\": \"agent-skill\",\n      \"description\": \"How an agent books an appointment via our API.\",\n      \"url\": \"https://YOURDOMAIN/.well-known/agent-skills/create-booking/SKILL.md\",\n      \"sha256\": \"<sha256 of the SKILL.md file>\"\n    }\n  ]\n}\n```\n\nServe each `SKILL.md` as `text/markdown`. Recompute `sha256` whenever a skill changes.",
    verify: "`curl -s https://YOURDOMAIN/.well-known/agent-skills/index.json | jq '.skills | length'` is ≥ 1.",
    docs: ["https://github.com/cloudflare/agent-skills-discovery-rfc", "https://agentskills.io/"],
  },
  "webmcp": {
    name: "Expose tools via WebMCP",
    category: "Agent Interfaces",
    why: "WebMCP lets in-browser AI agents call your site's key actions as typed tools — turning a page into an agent-operable surface.",
    detect: "Check whether the page calls `navigator.modelContext.provideContext(...)` at load.",
    implement: "Register tools on page load:\n\n```js\nif (navigator.modelContext) {\n  navigator.modelContext.provideContext({\n    tools: [{\n      name: 'search_products',\n      description: 'Search the catalog by keyword.',\n      inputSchema: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] },\n      async execute({ q }) { return await doSearch(q); }\n    }]\n  });\n}\n```\n\nKeep tool names stable and descriptions specific.",
    verify: "In DevTools, `typeof navigator.modelContext` is `object` and your tools are registered.",
    docs: ["https://webmachinelearning.github.io/webmcp/", "https://developer.chrome.com/blog/webmcp-epp"],
  },
  "web-bot-auth": {
    name: "Sign bot requests with Web Bot Auth",
    category: "Agent Interfaces",
    why: "If your service makes outbound bot/agent requests, publishing a signing-key directory lets receiving sites verify your requests via HTTP Message Signatures — building trust and avoiding blocks.",
    detect: "Request `https://YOURDOMAIN/.well-known/http-message-signatures-directory` (a JWKS of your public keys).",
    implement: "Publish your public signing keys as a JWKS at `/.well-known/http-message-signatures-directory`, and sign outbound requests per HTTP Message Signatures (RFC 9421) with a `Signature` and `Signature-Input` header keyed to one of those keys.",
    verify: "`curl -s https://YOURDOMAIN/.well-known/http-message-signatures-directory | jq .keys` lists your public keys.",
    docs: ["https://www.rfc-editor.org/rfc/rfc9421", "https://datatracker.ietf.org/wg/httpbis/about/"],
  },
  "oauth-discovery": {
    name: "Publish OAuth/OIDC discovery metadata",
    category: "Identity & Auth",
    why: "Discovery metadata lets agents learn programmatically how to authenticate with your protected APIs — endpoints, supported grants, and key material — without hardcoding.",
    detect: "Request `/.well-known/openid-configuration` (OIDC) or `/.well-known/oauth-authorization-server` (OAuth 2.0).",
    implement: "If you have protected APIs, publish discovery metadata:\n\n```json\n{\n  \"issuer\": \"https://YOURDOMAIN\",\n  \"authorization_endpoint\": \"https://YOURDOMAIN/oauth/authorize\",\n  \"token_endpoint\": \"https://YOURDOMAIN/oauth/token\",\n  \"jwks_uri\": \"https://YOURDOMAIN/.well-known/jwks.json\",\n  \"grant_types_supported\": [\"authorization_code\", \"client_credentials\"],\n  \"response_types_supported\": [\"code\"]\n}\n```",
    verify: "`curl -s https://YOURDOMAIN/.well-known/openid-configuration | jq .token_endpoint` returns your endpoint.",
    docs: ["https://openid.net/specs/openid-connect-discovery-1_0.html", "https://www.rfc-editor.org/rfc/rfc8414"],
  },
  "oauth-protected-resource": {
    name: "Publish OAuth Protected Resource Metadata",
    category: "Identity & Auth",
    why: "RFC 9728 metadata tells agents which authorization servers can issue tokens for your resource and which scopes exist — so they can obtain the right access token.",
    detect: "Request `https://YOURDOMAIN/.well-known/oauth-protected-resource` (HTTP 200, valid JSON).",
    implement: "Serve `/.well-known/oauth-protected-resource`:\n\n```json\n{\n  \"resource\": \"https://YOURDOMAIN\",\n  \"authorization_servers\": [\"https://YOURDOMAIN\"],\n  \"scopes_supported\": [\"read\", \"write\"],\n  \"bearer_methods_supported\": [\"header\"]\n}\n```",
    verify: "`curl -s https://YOURDOMAIN/.well-known/oauth-protected-resource | jq .authorization_servers` lists your AS.",
    docs: ["https://www.rfc-editor.org/rfc/rfc9728"],
  },
  "h1-structure": {
    name: "Use exactly one clear H1",
    category: "Content Structure",
    why: "A single descriptive `<h1>` tells crawlers and answer engines the page's primary topic. Zero or multiple H1s create ambiguity about what the page is about.",
    detect: "Count non-empty `<h1>` elements in the homepage HTML — there should be exactly one.",
    implement: "Ensure each page has exactly one non-empty `<h1>` that states the page's topic, with `<h2>`/`<h3>` for sub-sections:\n\n```html\n<h1>AI Visibility Analyzer for Your Website</h1>\n<h2>What it checks</h2>\n<h2>How to fix issues</h2>\n```\n\nDemote any extra H1s.",
    verify: "Count of non-empty `<h1>` in the rendered HTML equals 1.",
    docs: ["https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"],
  },
  "meta-tags": {
    name: "Provide title and meta description",
    category: "Content Structure",
    why: "`<title>` and `<meta name=description>` are used directly in search results and AI answer snippets. Missing or poorly sized values lead to truncated or auto-generated snippets you don't control.",
    detect: "Check for a non-empty `<title>` and a `<meta name=\"description\">` of roughly 50–320 characters.",
    implement: "```html\n<title>Clear, unique page title — Brand</title>\n<meta name=\"description\" content=\"A concise 50–320 character summary of what this page offers and why it matters.\">\n```\n\nKeep each page's title and description unique.",
    verify: "Rendered HTML has a non-empty `<title>` and a description meta within length bounds.",
    docs: ["https://developer.mozilla.org/docs/Web/HTML/Element/meta"],
  },
  "canonical": {
    name: "Declare an absolute canonical URL",
    category: "Content Structure",
    why: "Canonical URLs consolidate duplicate/variant URLs so engines index and cite the single correct version — avoiding split signals and wrong citations.",
    detect: "Check for `<link rel=\"canonical\" href=\"https://...\">` with an absolute URL in the head.",
    implement: "```html\n<link rel=\"canonical\" href=\"https://YOURDOMAIN/page\">\n```\n\nUse the absolute, preferred URL (correct protocol, host, and path). One canonical per page.",
    verify: "Rendered HTML contains an absolute `rel=canonical` link.",
    docs: ["https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"],
  },
  "viewport-lang": {
    name: "Set viewport and language",
    category: "Content Structure",
    why: "A viewport meta signals mobile-friendliness; `<html lang>` declares content language. Both help crawlers, agents, and accessibility tools interpret your page correctly.",
    detect: "Check for `<meta name=\"viewport\">` and a `lang` attribute on `<html>`.",
    implement: "```html\n<html lang=\"en\">\n  <head>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  </head>\n</html>\n```\n\nUse the correct BCP-47 language tag (`en`, `en-US`, `de`, etc.).",
    verify: "Rendered HTML has both a viewport meta and an `<html lang>` value.",
    docs: ["https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag"],
  },
  "json-ld": {
    name: "Add JSON-LD structured data",
    category: "Structured Data",
    why: "JSON-LD lets answer engines understand entities (organization, product, article, FAQ) precisely, increasing the odds of accurate citation and rich presentation.",
    detect: "Check for at least one `<script type=\"application/ld+json\">` block containing valid JSON.",
    implement: "Add a JSON-LD block describing the page entity:\n\n```html\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Organization\",\n  \"name\": \"Your Brand\",\n  \"url\": \"https://YOURDOMAIN/\",\n  \"logo\": \"https://YOURDOMAIN/logo.png\"\n}\n</script>\n```\n\nUse the most specific schema.org type that fits (Product, Article, LocalBusiness, etc.). Validate with the Rich Results Test.",
    verify: "Each `application/ld+json` block parses as valid JSON and uses a schema.org `@type`.",
    docs: ["https://json-ld.org/", "https://schema.org/", "https://search.google.com/test/rich-results"],
  },
  "faq-schema": {
    name: "Mark up FAQs with FAQPage schema",
    category: "Structured Data",
    why: "FAQPage structured data is a strong, directly-citable answer-unit format — AI engines quote question/answer pairs verbatim.",
    detect: "Check JSON-LD blocks for `\"@type\": \"FAQPage\"`.",
    implement: "```html\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [{\n    \"@type\": \"Question\",\n    \"name\": \"What is AEO?\",\n    \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"Answer Engine Optimization makes your site easy for AI assistants to read and cite.\" }\n  }]\n}\n</script>\n```\n\nThe schema must mirror the visible FAQ on the page.",
    verify: "A JSON-LD block contains `FAQPage` with `Question`/`acceptedAnswer` pairs.",
    docs: ["https://schema.org/FAQPage"],
  },
  "opengraph": {
    name: "Add Open Graph tags",
    category: "Structured Data",
    why: "Open Graph metadata controls how pages appear when shared and gives agents a reliable title/image/type to extract.",
    detect: "Check for `og:title`, `og:type`, and `og:image` meta tags.",
    implement: "```html\n<meta property=\"og:title\" content=\"Page title\">\n<meta property=\"og:type\" content=\"website\">\n<meta property=\"og:image\" content=\"https://YOURDOMAIN/og.png\">\n<meta property=\"og:url\" content=\"https://YOURDOMAIN/page\">\n<meta property=\"og:description\" content=\"Concise summary.\">\n```",
    verify: "Rendered HTML contains at least `og:title` and `og:image`.",
    docs: ["https://ogp.me/"],
  },
  "answer-units": {
    name: "Structure content as answer units",
    category: "Structured Data",
    why: "Question-style headings followed by concise, direct answers are the format AI engines quote most. Walls of prose are harder to extract and cite.",
    detect: "Look for multiple question-style `<h2>`/`<h3>` headings each followed by a short direct answer.",
    implement: "Structure key content as Q→A units:\n\n```html\n<h2>What is answer engine optimization?</h2>\n<p>Answer engine optimization (AEO) is the practice of structuring a site so AI assistants can read and cite it. It focuses on machine-readable signals and concise answers.</p>\n\n<h2>How long does it take?</h2>\n<p>Most fixes are technical and can ship in a day; citation improvements typically appear over a few weeks.</p>\n```\n\nLead each answer with the direct response in the first sentence.",
    verify: "Page has ≥2 question-style headings each followed by a concise answer paragraph.",
    docs: ["https://schema.org/Question"],
  },
  "x402": {
    name: "Support x402 agent payments",
    category: "Commerce",
    why: "x402 lets AI agents pay for access to protected routes automatically over HTTP 402 — enabling pay-per-use APIs and content for autonomous agents.",
    detect: "A protected route returns HTTP 402 with machine-readable payment requirements.",
    implement: "Add x402 middleware to protected routes with a facilitator URL and wallet address:\n\n```js\nimport { paymentMiddleware } from '@x402/express';\napp.use(paymentMiddleware({\n  facilitatorUrl: 'https://facilitator.example',\n  address: '0xYourWallet',\n  routes: { '/api/premium': { price: '$0.01' } }\n}));\n```\n\nUnpaid requests get a 402 with payment instructions agents can fulfil and retry.",
    verify: "`curl -si https://YOURDOMAIN/api/premium` returns `402` with payment requirement headers/body.",
    docs: ["https://www.x402.org/", "https://docs.x402.org/"],
  },
  "mpp": {
    name: "Support MPP machine payments",
    category: "Commerce",
    why: "The Machine Payment Protocol advertises payable operations in your OpenAPI so agents can discover prices and transact programmatically.",
    detect: "`/openapi.json` includes `x-payment` info on payable operations.",
    implement: "Annotate payable operations in your OpenAPI document with `x-payment-info` and add MPP middleware (mppx for TypeScript, pympp for Python):\n\n```json\n{\n  \"paths\": { \"/api/generate\": { \"post\": {\n    \"x-payment-info\": { \"intent\": \"charge\", \"method\": \"card\", \"amount\": 100, \"currency\": \"USD\" }\n  }}}\n}\n```",
    verify: "`curl -s https://YOURDOMAIN/openapi.json | jq '.. | .\"x-payment-info\"? // empty'` returns your entries.",
    docs: ["https://mpp.dev/", "https://paymentauth.org/"],
  },
  "ucp": {
    name: "Enable Universal Commerce Protocol",
    category: "Commerce",
    why: "UCP lets agents discover your commerce capabilities, services, and endpoints from a single well-known profile.",
    detect: "Request `https://YOURDOMAIN/.well-known/ucp` (HTTP 200, valid JSON).",
    implement: "Serve `/.well-known/ucp` with protocol version, services, capabilities, and endpoints; ensure all referenced spec/schema URLs are reachable:\n\n```json\n{\n  \"version\": \"1.0\",\n  \"services\": [\"catalog\", \"checkout\"],\n  \"capabilities\": { \"payments\": true },\n  \"endpoints\": { \"catalog\": \"https://YOURDOMAIN/api/catalog\" }\n}\n```",
    verify: "`curl -s https://YOURDOMAIN/.well-known/ucp | jq .services` lists your services.",
    docs: ["https://ucp.dev/"],
  },
  "acp": {
    name: "Publish ACP commerce discovery",
    category: "Commerce",
    why: "The Agentic Commerce Protocol lets agents discover your commerce API and create checkout sessions without bespoke integration.",
    detect: "Request `https://YOURDOMAIN/.well-known/acp.json` (HTTP 200, valid JSON).",
    implement: "Serve `/.well-known/acp.json` at the origin root:\n\n```json\n{\n  \"protocol\": { \"name\": \"acp\", \"version\": \"1.0\" },\n  \"api_base_url\": \"https://YOURDOMAIN/api\",\n  \"supported_transports\": [\"https\"],\n  \"capabilities\": { \"services\": [\"checkout\"] }\n}\n```",
    verify: "`curl -s https://YOURDOMAIN/.well-known/acp.json | jq .protocol.name` returns `acp`.",
    docs: ["https://agenticcommerce.dev/"],
  },
};

function renderSkill(slug, s) {
  return `# ${s.name}

> AIPUSH agent skill · Category: ${s.category} · Slug: \`${slug}\`

${s.why}

## Why it matters

${s.why}

## How to detect

${s.detect}

## How to implement

${s.implement}

## How to verify

${s.verify}

## References

${s.docs.map((d) => `- ${d}`).join("\n")}

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
`;
}

let count = 0;
for (const [slug, s] of Object.entries(SKILLS)) {
  const dir = path.join(SKILLS_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "SKILL.md"), renderSkill(slug, s));
  count++;
}
console.log(`Wrote ${count} SKILL.md files.`);

// Regenerate index.json.
execSync("node generate-index.js", { cwd: ROOT, stdio: "inherit" });
