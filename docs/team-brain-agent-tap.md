# Team-Brain Agent Tap

This repo distributes the public companion plugin layer for Saya's inbound MCP.
The live product surface is:

```text
https://saya-mcp.luke-nittmann.workers.dev/mcp
```

`https://mcp.saya.computer/mcp` is the future custom domain and is not routed yet.

## Runner-side sample flow

1. Add the MCP server from `.mcp.json` or install the generated client plugin.
2. Complete the client's browser OAuth flow for the workspace that owns the Saya
   brain. Do not paste or commit bearer tokens.
3. Call `saya_status` to confirm tool availability, auth posture, and live bridge
   health.
4. Call `saya_context` with a focused team-memory question, for example:

```text
What has this team decided about the Saya MCP launch? Return verified decisions
first, then candidate notes, then deprecated or disputed context to avoid.
```

5. Interpret returned lifecycle and trust grades before acting:
   - `verified` / `human_verified`: usable as current team truth.
   - `candidate` / `agent_unreviewed`: useful but provisional.
   - `deprecated` / `disputed`: historical or cautionary, not current guidance.
6. Use `saya_act` only for the approval-first `save_memory` path when the user
   explicitly wants a memory or decision recorded.

## Proof boundary

The runner gate in this repo proves the public distribution layer: docs,
generated manifests, install metadata, typecheck/build/help, and unauthenticated
protected-resource metadata reachability.

The live end-to-end agent-harness demo requires a valid workspace OAuth bearer.
That review lane is intentionally held for Opus with the MCP secret and should
not be simulated with a tracked token or stand-in response in this public repo.
