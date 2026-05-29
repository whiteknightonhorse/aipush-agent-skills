# Publish an MCP Server Card

> AIPUSH agent skill · Category: Agent Interfaces · Slug: `mcp-server-card`

A Model Context Protocol (MCP) Server Card advertises your MCP server so agents can discover and connect to your tools without manual configuration.

## Why it matters

A Model Context Protocol (MCP) Server Card advertises your MCP server so agents can discover and connect to your tools without manual configuration.

## How to detect

Request `https://YOURDOMAIN/.well-known/mcp/server-card.json` (HTTP 200, valid JSON).

## How to implement

Serve `/.well-known/mcp/server-card.json`:

```json
{
  "serverInfo": { "name": "YOURSITE", "version": "1.0.0" },
  "transport": { "type": "streamable-http", "endpoint": "https://YOURDOMAIN/mcp" },
  "capabilities": { "tools": {}, "resources": {} }
}
```

Match the fields to the current MCP server-card schema (being standardized).

## How to verify

`curl -s https://YOURDOMAIN/.well-known/mcp/server-card.json | jq .serverInfo` returns name/version.

## References

- https://modelcontextprotocol.io/
- https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
