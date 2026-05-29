# Expose tools via WebMCP

> AIPUSH agent skill · Category: Agent Interfaces · Slug: `webmcp`

WebMCP lets in-browser AI agents call your site's key actions as typed tools — turning a page into an agent-operable surface.

## Why it matters

WebMCP lets in-browser AI agents call your site's key actions as typed tools — turning a page into an agent-operable surface.

## How to detect

Check whether the page calls `navigator.modelContext.provideContext(...)` at load.

## How to implement

Register tools on page load:

```js
if (navigator.modelContext) {
  navigator.modelContext.provideContext({
    tools: [{
      name: 'search_products',
      description: 'Search the catalog by keyword.',
      inputSchema: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] },
      async execute({ q }) { return await doSearch(q); }
    }]
  });
}
```

Keep tool names stable and descriptions specific.

## How to verify

In DevTools, `typeof navigator.modelContext` is `object` and your tools are registered.

## References

- https://webmachinelearning.github.io/webmcp/
- https://developer.chrome.com/blog/webmcp-epp

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
