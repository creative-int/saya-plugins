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
	tagline: "Plug any agent into your team's Saya.",
	shortDescription:
		"Query your team's brain — memory, channels, decisions, skills — and delegate to Saya, from any agent.",
	longDescription:
		"Saya lets an external agent ask the team brain before it guesses: bounded workspace memory, Slack-visible channel context, prior decisions, and team skills through one remote MCP endpoint. The curated surface stays intentionally small: `saya_context` for workspace-scoped reads, `saya_act` for one approval-first idempotent action path, and `saya_status` for readiness. Today the deployed MCP is repo-local v1: OAuth/resource metadata and the three-tool surface are live, but live Convex-backed team memory is not wired yet, so context responses are deterministic placeholders until the production adapters are connected.",
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
				"Read bounded, workspace-scoped Saya context across team memory, Slack-visible channels, decisions, skills, and readiness state.",
		},
		{
			name: "saya_act",
			scope: "saya.act",
			description:
				"Run one curated, idempotent, approval-first action through Saya.",
		},
		{
			name: "saya_status",
			scope: "saya.status",
			description:
				"Check Saya MCP readiness, tool availability, adapter status, and next setup steps.",
		},
	],
	readiness: {
		status:
			"Repo-local v1: the deployed MCP endpoint and three-tool surface are live, but saya_context currently returns deterministic placeholder data until the Convex and Slack live-data adapters are wired. The mcp.saya.computer custom domain is not routed yet.",
	},
	skill: {
		name: "saya-team-brain",
		aliases: ["ask-team", "team-context"],
	},
};

export default saya;
