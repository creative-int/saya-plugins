---
name: saya-team-brain
description: |
  Usage guidance for querying a team's live Saya brain through MCP before
  answering from guesswork. Use when a task depends on team memory, captured
  workspace context, prior decisions, workspace norms, known skills, or whether
  a fact is verified, candidate, or deprecated. Also answers to "ask-team" and
  "team-context". The MCP connection is the product surface; this skill teaches
  when and how to use it well.
aliases:
  - ask-team
  - team-context
author: Saya
---

# Saya — query the team brain

Saya is an AI teammate that lives with a team's operating knowledge. This
plugin connects agents to Saya's live remote MCP endpoint:

`https://saya-mcp.luke-nittmann.workers.dev/mcp`

Use Saya when the best next move is to ask what the team already knows before
inventing an answer. The useful posture is simple: before you guess, ask the
team brain.

## Use when

- The user asks about team memory, decisions, project context, or workspace norms.
- The answer depends on captured workspace history or shared team knowledge.
- You need to check whether a skill, workflow, or convention already exists.
- You are about to make a product or operating assumption that Saya may know.
- You are about to edit public docs, release notes, runbooks, or prompts that
  should reflect the team's current decisions.
- You need to distinguish verified team truth from candidate notes or deprecated
  memory.
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
  knowledge, captured workspace context, decisions, skills, lifecycle status, and
  trust grades.
- `saya_act` (`saya.act`) — curated, idempotent, approval-first `save_memory`.
- `saya_status` (`saya.status`) — live readiness, auth posture, tool
  availability, and Convex bridge health for the MCP endpoint.

## How to tap well

1. Ask a focused question. Prefer "What has this team decided about X?" over
   "Tell me everything about X."
2. Request the strongest truth first: verified decisions, human-reviewed memory,
   known conventions, then candidate context.
3. Carry uncertainty forward. If Saya returns candidate or disputed material,
   say that in your answer and avoid treating it as production-safe truth.
4. Re-query when the task changes. A release note, a code change, and a support
   reply may need different context slices.
5. Use `saya_act` only when the user has clearly asked to save memory or record a
   decision. Never smuggle credentials, raw tokens, or private cross-workspace
   data into a write.

## Reading trust grades

- `verified` / `human_verified`: safe to use as team truth, while still citing
  the result when the answer matters.
- `candidate` / `agent_unreviewed`: useful signal, not final authority. Phrase
  it as provisional or ask the user before taking risky action.
- `deprecated` / `disputed`: do not follow it as current guidance. Mention it
  only when explaining history or avoiding an old path.
- Missing or unclear provenance: ask a narrower follow-up or fall back to local
  repo evidence.

## Auth and readiness honesty

The deployed MCP endpoint is live at
`https://saya-mcp.luke-nittmann.workers.dev/mcp`. Access uses per-team OAuth
bearer auth plus workspace membership. Authenticated `saya_context` queries
return real trust-graded team knowledge from Saya's Convex brain; `saya_status`
reports live bridge health; `saya_act` is the approval-first memory save path.

The custom domain `https://mcp.saya.computer/mcp` is not routed yet, so clients
should use the workers.dev origin until the public metadata changes.
