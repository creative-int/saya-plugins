<p align="center">
  <img src="assets/logo.png" alt="Saya" width="88" height="88" />
</p>

<h1 align="center">Saya plugins</h1>

<p align="center"><strong>Plug any agent into your team's Saya.</strong></p>

<p align="center">
  Saya exposes a central remote MCP endpoint so external agents can ask the
  team brain before they guess: memory, channels, decisions, skills, and
  readiness from the workspace Saya already lives in.
</p>

<p align="center">
  <a href="https://saya.computer">saya.computer</a> ·
  MCP: <code>https://saya-mcp.luke-nittmann.workers.dev/mcp</code>
</p>

---

## Install

<!-- AUTO-GENERATED:INSTALL START -->

### Any MCP client (.mcp.json)

Point your client at Saya's central remote MCP endpoint. This JSON fallback is the safest path while remote MCP auth support varies by client.

```json
{
	"mcpServers": {
		"saya": {
			"url": "https://saya-mcp.luke-nittmann.workers.dev/mcp",
			"transport": "streamable-http"
		}
	}
}
```

### Any agent (npx skills)

Installs the secondary usage-guide skill for skill-aware agents. The MCP endpoint remains the main product surface.

```sh
npx skills add creative-int/saya-plugins
```

### Claude Code

Add the marketplace, then install the Saya plugin.

```sh
/plugin marketplace add creative-int/saya-plugins
/plugin install saya@saya
```

### Codex

Add this repo as a Codex plugin marketplace, then install from /plugins.

```sh
codex plugin marketplace add creative-int/saya-plugins
```

### Cursor

Install Saya from the Cursor plugin marketplace.

```sh
Cursor -> Settings -> Plugins -> Add marketplace -> creative-int/saya-plugins
```

<!-- AUTO-GENERATED:INSTALL END -->

To preview the available skills without installing:

```sh
npx skills add creative-int/saya-plugins --list
```

## MCP surface

Saya exposes one central Streamable HTTP MCP server. Team identity and access
come from per-team OAuth bearer auth plus workspace membership; never put tokens
in repo files.

| Tool | Scope | Purpose |
| --- | --- | --- |
| `saya_context` | `saya.context` | Read bounded workspace context across team memory, Slack-visible channels, decisions, skills, and readiness state. |
| `saya_act` | `saya.act` | Run one curated, idempotent, approval-first action through Saya. |
| `saya_status` | `saya.status` | Check endpoint readiness, tool availability, adapter status, and next setup steps. |

## Status / readiness

The deployed endpoint is repo-local v1. OAuth/resource metadata and the three
MCP tools are live, but the live Convex-backed team-brain adapter is not wired
yet; `saya_context` currently returns deterministic placeholder data. The
custom domain `https://mcp.saya.computer/mcp` is also not routed yet, so this
repo intentionally points at the current workers.dev origin.

## Included skill

- **`saya-team-brain`** — secondary usage guidance for agents deciding when to
  query Saya through MCP before answering. Useful for team memory, decision
  history, workspace norms, channel context, and "what does this team already
  know?" questions. Also answers to `ask-team` and `team-context`.

The skill lives at
[`skills/saya-team-brain/SKILL.md`](skills/saya-team-brain/SKILL.md).

## Develop

```sh
pnpm install
pnpm generate        # regenerate all adapters from saya.config.ts
pnpm verify          # drift check + typecheck + build/help + MCP smoke
```

`pnpm smoke` always checks unauthenticated protected-resource metadata. Set
`SAYA_MCP_BEARER` to additionally assert the authenticated `tools/list` surface.

## License

[MIT](LICENSE) © creative-int
