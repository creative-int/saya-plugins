<p align="center">
  <img src="assets/logo.png" alt="Saya" width="88" height="88" />
</p>

<h1 align="center">Saya plugins</h1>

<p align="center"><strong>Plug any agent into your team's Saya.</strong></p>

<p align="center">
  Before you guess, ask the team brain. Saya exposes a central remote MCP
  endpoint so external agents can query live, trust-graded team knowledge from
  the workspace Saya already lives in.
</p>

<p align="center">
  <a href="https://saya.computer">saya.computer</a> ·
  MCP: <code>https://saya-mcp.luke-nittmann.workers.dev/mcp</code>
</p>

---

## Install

<!-- AUTO-GENERATED:INSTALL START -->

### Any MCP client (.mcp.json)

Add Saya as a Streamable HTTP MCP server at the live workers.dev origin. When your client prompts, complete browser OAuth for your team; the per-team bearer belongs in the client credential store, never in this repo.

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

Installs the secondary usage-guide skill for skill-aware agents. This teaches when to query Saya; the live MCP endpoint remains the product surface.

```sh
npx skills add creative-int/saya-plugins
```

### Claude Code

Add the marketplace, install the Saya plugin, then complete browser OAuth before the first team-brain query.

```sh
/plugin marketplace add creative-int/saya-plugins
/plugin install saya@saya
```

### Codex

Add this repo as a Codex plugin marketplace, install from /plugins, then authenticate the MCP connection for your workspace.

```sh
codex plugin marketplace add creative-int/saya-plugins
```

### Cursor

Install Saya from the Cursor plugin marketplace, then authenticate the MCP connection for your workspace.

```sh
Cursor -> Settings -> Plugins -> Add marketplace -> creative-int/saya-plugins
```

<!-- AUTO-GENERATED:INSTALL END -->

To preview the available skills without installing:

```sh
npx skills add creative-int/saya-plugins --list
```

## Quickstart: tap the team brain

1. Add the MCP server with the generated `.mcp.json` block above, or install the
   plugin through Claude Code, Codex, or Cursor.
2. When the client prompts for auth, complete browser OAuth with the workspace
   that owns the Saya brain. The bearer is per-team and should stay in the MCP
   client's credential store or environment, never in a tracked file.
3. Start with `saya_status` if you need to confirm the live bridge, scopes, or
   workspace health.
4. Use `saya_context` before making team-specific assumptions. Ask focused
   questions like: "What has this team decided about the Saya MCP launch? Return
   verified decisions first and call out candidate or deprecated notes."
5. Use `saya_act` only for the curated approval-first memory save path. Treat it
   as a write that needs user intent, not a general automation channel.

If a client exposes raw MCP calls instead of a friendly tool picker, inspect
`tools/list` after OAuth and follow the current input schema advertised by the
server.

## MCP surface

Saya exposes one central Streamable HTTP MCP server. Team identity and access
come from per-team OAuth bearer auth plus workspace membership; never put tokens
in repo files.

| Tool | Scope | Purpose |
| --- | --- | --- |
| `saya_context` | `saya.context` | Read bounded workspace context: provenance-graded team knowledge, lifecycle status, trust grade, decisions, skills, and captured workspace memory. |
| `saya_act` | `saya.act` | Save approved team memory through Saya's curated, idempotent, approval-first action path. |
| `saya_status` | `saya.status` | Check live MCP readiness, tool availability, auth posture, and Convex bridge health. |

## Status / readiness

The deployed endpoint is live on prod at
`https://saya-mcp.luke-nittmann.workers.dev/mcp`. Production OAuth and
workspace membership are required; authenticated `saya_context` queries return
real, trust-graded team knowledge from Saya's Convex brain. `saya_act` is the
approval-first `save_memory` path, and `saya_status` reports live bridge health.

The custom domain `https://mcp.saya.computer/mcp` is not routed yet, so this
repo intentionally points at the current workers.dev origin.

## Included skill

- **`saya-team-brain`** — secondary usage guidance for agents deciding when to
  query Saya through MCP before answering. Useful for team memory, decision
  history, workspace norms, channel context, and "what does this team already
  know?" questions. Also answers to `ask-team` and `team-context`.

The skill lives at
[`skills/saya-team-brain/SKILL.md`](skills/saya-team-brain/SKILL.md).

See [`docs/team-brain-agent-tap.md`](docs/team-brain-agent-tap.md) for the
runner-side sample flow and proof boundary.

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
