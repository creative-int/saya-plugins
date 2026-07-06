# saya-plugins - SOUL

## soul

Saya plugins are the inbound MCP distribution substrate: generated client manifests and usage guidance that let external agents query a team's Saya brain through the real remote endpoint.

## rulings

- Source: root `AGENTS.md`.
- `saya.config.ts` is the single source of truth.
- Generated manifests, MCP metadata, and README install blocks are never hand-edited.
- Positioning is inbound MCP, not a skill pack.
- Readiness claims must distinguish the live workers.dev origin from the deferred vanity domain.
- The repo is a companion plugin profile, not a product runtime.

## virtue

Honest brain access: every client install should expose the same authenticated, trust-graded Saya MCP surface without overstating domain or product readiness.

## refusals

- No hand-editing generated plugin files.
- No skill-pack positioning as the hero.
- No vanity-domain readiness claim before routing exists.
- No product-runtime scope in the plugin companion repo.

## asks

- Keep generator output drift-free.
- Keep client install metadata aligned.
- Keep MCP smoke tied to the real origin.

## gates

- Generated drift and MCP smoke must pass before publishing or claiming readiness.
- Vanity-domain claims wait for Cloudflare/DNS routing proof.

## fleet

```yaml
state: substrate
virtue: honest brain access
autonomy: mechanical-autonomous
refusals:
  - no hand-edited generated files
  - no skill-pack hero positioning
  - no vanity-domain claim before routing proof
  - no product-runtime scope
asks:
  - generator drift check
  - aligned client install metadata
  - MCP smoke against real origin
next_proof: pnpm generate plus pnpm verify shows no generated drift and MCP smoke still reaches the live origin
owed_rulings:
  - vanity-domain routing proof
love_evidence: companion plugin profile makes Saya's team brain reachable by external agents
outward_gate: authenticated agents can query real trust-graded team knowledge through the MCP endpoint
console_gates:
  - Cloudflare and DNS routing for mcp.saya.computer
  - marketplace and MCP registry publication
```
