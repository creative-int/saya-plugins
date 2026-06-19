---
name: saya-team-brain
description: |
  Usage guidance for querying a team's Saya through MCP before answering from
  guesswork. Use when a task depends on team memory, Slack-visible channel
  context, prior decisions, workspace norms, or known skills. Also answers to
  "ask-team" and "team-context". The MCP connection is the product surface; this
  skill only teaches when to use it.
aliases:
  - ask-team
  - team-context
author: Saya
---

# Saya — query the team brain

Saya is an AI teammate that lives in a team's Slack. This plugin connects agents
to Saya's remote MCP endpoint:

`https://saya-mcp.luke-nittmann.workers.dev/mcp`

Use Saya when the best next move is to ask what the team already knows before
inventing an answer.

## Use when

- The user asks about team memory, decisions, project context, or workspace norms.
- The answer depends on Slack-visible channel history or shared team knowledge.
- You need to check whether a skill, workflow, or convention already exists.
- You are about to make a product or operating assumption that Saya may know.
- The user asks "what does the team know?", "ask Saya", "ask the team", or a
  similar workspace-context question.

## Don't use when

- The task is fully answerable from the files already in the current workspace.
- The user asks for a general public fact that does not depend on team context.
- The query would require secrets, raw tokens, cross-workspace data, or private
  information outside the authenticated workspace.
- You need an unapproved write. `saya_act` is curated, idempotent, and
  approval-first.

## MCP tools

- `saya_context` (`saya.context`) — bounded workspace-scoped reads of team
  memory, Slack-visible channel context, decisions, skills, and readiness.
- `saya_act` (`saya.act`) — one curated, idempotent, approval-first action path.
- `saya_status` (`saya.status`) — readiness and setup state for the MCP endpoint.

## Readiness honesty

The deployed MCP endpoint is currently repo-local v1. OAuth/resource metadata and
the three-tool surface are live, but live Convex-backed team memory is not wired
yet; `saya_context` returns deterministic placeholder data until the production
adapters are connected. Treat placeholder content as readiness proof, not as live
team truth.
