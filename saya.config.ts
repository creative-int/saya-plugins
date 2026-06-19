/**
 * Canonical source of truth for every Saya install adapter.
 *
 * One config in — every client manifest out. Run `pnpm generate` to (re)emit
 * `.mcp.json`, the Cursor / Codex / Claude Code plugin manifests, the MCP
 * Registry `server.json`, and the README install block. Never hand-edit the
 * generated files; edit this config and regenerate.
 */

export interface SayaConfig {
	/** Machine-facing id (plugin name, mcp server key). */
	name: string;
	/** Human-facing name. */
	displayName: string;
	version: string;
	/** Short marketing line. */
	tagline: string;
	/** One-sentence description (manifests, marketplace cards). */
	shortDescription: string;
	/** Paragraph for marketplace long-description surfaces. */
	longDescription: string;
	homepage: string;
	repository: string;
	license: string;
	owner: { name: string; email: string };
	/** Marketplace category. */
	category: string;
	keywords: string[];
	/** Logo path, repo-relative. */
	logo: string;
	mcp: {
		/** Server key used in `.mcp.json` and as the registry short name. */
		id: string;
		/** Remote Streamable HTTP MCP endpoint. */
		url: string;
		transport: "streamable-http";
		/** Future custom domain once DNS and Cloudflare routing are complete. */
		futureUrl: string;
	};
	/** Reverse-DNS name for the official MCP Registry server.json. */
	registryName: string;
	tools: Array<{
		name: "saya_context" | "saya_act" | "saya_status";
		scope: "saya.context" | "saya.act" | "saya.status";
		description: string;
	}>;
	readiness: {
		status: string;
	};
	skill: {
		/** Secondary usage-guide skill directory under skills/. */
		name: string;
		/** Discovery aliases (e.g. "ask-team"). */
		aliases: string[];
	};
}

export const saya: SayaConfig = {
	name: "saya",
	displayName: "Saya",
	version: "0.1.0",
	tagline: "Before you guess, ask the team brain.",
	shortDescription:
		"Connect agents to Saya's live, trust-graded team brain over remote MCP.",
	longDescription:
		"Saya lets an external agent ask the team brain before it guesses. The production MCP exposes a deliberately small live surface: `saya_context` returns workspace-scoped, provenance- and trust-graded team knowledge from Saya's Convex brain; `saya_act` provides the approval-first `save_memory` action path; and `saya_status` reports live MCP and Convex health. Access is per-team OAuth bearer auth plus workspace membership. The working origin is the workers.dev MCP URL; the future `mcp.saya.computer` custom domain is not routed yet.",
	homepage: "https://saya.computer",
	repository: "https://github.com/creative-int/saya-plugins",
	license: "MIT",
	owner: { name: "creative-int", email: "support@saya.computer" },
	category: "Productivity",
	keywords: [
		"saya",
		"mcp",
		"team-memory",
		"slack",
		"agent-context",
		"workspace-context",
		"team-brain",
	],
	logo: "./assets/logo.png",
	mcp: {
		id: "saya",
		// TODO: switch to https://mcp.saya.computer/mcp once the custom domain is routed.
		url: "https://saya-mcp.luke-nittmann.workers.dev/mcp",
		transport: "streamable-http",
		futureUrl: "https://mcp.saya.computer/mcp",
	},
	registryName: "io.github.creative-int/saya",
	tools: [
		{
			name: "saya_context",
			scope: "saya.context",
			description:
				"Read bounded, workspace-scoped Saya context: provenance-graded team knowledge, lifecycle status, trust grade, decisions, skills, and captured workspace memory.",
		},
		{
			name: "saya_act",
			scope: "saya.act",
			description:
				"Save approved team memory through Saya's curated, idempotent, approval-first action path.",
		},
		{
			name: "saya_status",
			scope: "saya.status",
			description:
				"Check live Saya MCP readiness, tool availability, auth posture, and Convex bridge health.",
		},
	],
	readiness: {
		status:
			"Live prod: the workers.dev MCP origin serves the real Convex-backed team brain. Authenticated saya_context queries return trust-graded workspace knowledge; saya_act is approval-first save_memory; saya_status reports live bridge health. The mcp.saya.computer custom domain is not routed yet.",
	},
	skill: {
		name: "saya-team-brain",
		aliases: ["ask-team", "team-context"],
	},
};

export default saya;
