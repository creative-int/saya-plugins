# Saya plugins — agent guide

Public distribution repo for Saya: generated plugin manifests for Cursor, Codex,
and Claude Code, `.mcp.json`, MCP Registry `server.json`, and the secondary
`saya-team-brain` usage-guide skill. The hero is inbound MCP: external agents
connect to Saya's central remote endpoint to query a team's Saya brain.

## The one rule: generate, don't hand-edit

`saya.config.ts` is the **single source of truth**. Every manifest, `.mcp.json`,
`server.json`, and the README install block are emitted from it by
`tooling/generate.ts`. Edit the config, then:

```sh
pnpm generate     # rewrite all generated files
pnpm verify       # check:generated + typecheck + build/help + MCP smoke
```

Never hand-edit the generated files (`.mcp.json`, `.claude-plugin/*`,
`.codex-plugin/*`, `.cursor-plugin/*`, `server.json`, the README
`AUTO-GENERATED` block). CI runs `check:generated` and fails on drift.

## To add a client

Add its install steps to `installClients` in `tooling/generate.ts` and, if it
needs a manifest, add the manifest builder to the `files` map. Regenerate.

## Scope

- v0: central remote MCP metadata + 3 client manifests + `.mcp.json` +
  `server.json` + one secondary usage-guide skill, generated.
- Deferred: production custom domain `https://mcp.saya.computer/mcp` after
  Cloudflare/DNS routing, and live Convex/Slack adapter claims after they are
  wired in the Saya app.

Positioning is **inbound MCP, not a skill pack**. Keep `saya-team-brain` as usage
guidance; the MCP endpoint is the product surface. Keep readiness claims honest:
repo-local v1 currently returns deterministic placeholder context until live data
adapters are connected.

CLAUDE.md is a symlink to this file.

## Platform posture

tooling — saya plugins repo; no product runtime surface.

## Companion plugin profile

This repo intentionally uses the `agent-plugin-companion` profile rather than
the full app-family turborepo profile. It is a public agent-facing distribution
repo for Saya, so it owns generated plugin manifests, skills, MCP metadata, and
install documentation — not product runtime surfaces.

Required root contract for this profile:

- `AGENTS.md` plus `CLAUDE.md -> AGENTS.md`
- `README.md`, `LICENSE`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`,
  `.nvmrc`, `.gitignore`, `.github/workflows/verify.yml`
- canonical config at `saya.config.ts`
- generator and smoke tooling under `tooling/`
- distributed skills under `skills/`
- generated client adapters: `.mcp.json`, `server.json`, `.claude-plugin/`,
  `.codex-plugin/`, `.cursor-plugin/`

Intentional omissions: `apps/`, `packages/`, `TESTING.md`, `knip.json`,
`codecov.yml`, `biome.json`, `turbo.json`, `pnpm-workspace.yaml`, and `.npmrc`
until the plugin pack grows into a workspace or needs private GitHub Packages.
