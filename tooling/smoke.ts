/**
 * Two-level smoke for the remote Saya MCP server.
 *
 * 1. Unauthenticated protected-resource metadata must be reachable.
 * 2. Authenticated tools/list is checked only when SAYA_MCP_BEARER or
 *    SAYA_MCP_TOKEN is present.
 *
 * This repo is public: never write bearer tokens to files.
 */
import { saya } from "../saya.config.ts";

const HELP = process.argv.includes("--help") || process.argv.includes("-h");

if (HELP) {
	console.log(`Usage: pnpm smoke

Checks Saya's central remote MCP endpoint.

Environment:
  SAYA_MCP_BEARER  optional OAuth bearer for authenticated tools/list
  SAYA_MCP_TOKEN   optional alias for SAYA_MCP_BEARER
`);
	process.exit(0);
}

const endpoint = new URL(saya.mcp.url);
const metadataUrl = new URL("/.well-known/oauth-protected-resource/mcp", endpoint);
const token = process.env.SAYA_MCP_BEARER ?? process.env.SAYA_MCP_TOKEN;
const expectedTools = saya.tools.map((tool) => tool.name).sort();
const expectedScopes = saya.tools.map((tool) => tool.scope).sort();

try {
	await checkProtectedResourceMetadata();
	await checkAuthenticatedToolSurface();
} catch (error) {
	console.error(`MCP smoke failed: ${(error as Error).message}`);
	process.exit(1);
}

async function checkProtectedResourceMetadata() {
	const res = await fetch(metadataUrl, {
		headers: { accept: "application/json" },
		signal: AbortSignal.timeout(8000),
	});

	if (res.status >= 500) {
		throw new Error(`${metadataUrl.href} returned HTTP ${res.status}`);
	}
	if (res.status !== 200) {
		throw new Error(
			`${metadataUrl.href} returned HTTP ${res.status}; expected protected-resource metadata`,
		);
	}

	const metadata = (await res.json()) as {
		resource?: string;
		scopes_supported?: string[];
		bearer_methods_supported?: string[];
	};
	const scopes = [...(metadata.scopes_supported ?? [])].sort();
	if (JSON.stringify(scopes) !== JSON.stringify(expectedScopes)) {
		throw new Error(
			`metadata scopes mismatch: expected ${expectedScopes.join(", ")}, got ${scopes.join(", ")}`,
		);
	}
	if (!metadata.bearer_methods_supported?.includes("header")) {
		throw new Error("metadata does not advertise header bearer auth");
	}

	console.log(
		`MCP metadata reachable: ${metadataUrl.href} (${metadata.resource ?? "resource unknown"})`,
	);
}

async function checkAuthenticatedToolSurface() {
	if (!token) {
		console.log(
			"Authenticated tools/list skipped: set SAYA_MCP_BEARER to check the live tool surface.",
		);
		return;
	}

	const initialized = await postMcp("initialize", {
		protocolVersion: "2025-06-18",
		capabilities: {},
		clientInfo: { name: "saya-plugins-smoke", version: saya.version },
	});
	if (initialized.status < 200 || initialized.status >= 300) {
		throw new Error(
			`authenticated initialize returned HTTP ${initialized.status}: ${initialized.preview}`,
		);
	}

	const listed = await postMcp("tools/list");
	if (listed.status < 200 || listed.status >= 300) {
		throw new Error(
			`authenticated tools/list returned HTTP ${listed.status}: ${listed.preview}`,
		);
	}

	const tools =
		(listed.payload as { result?: { tools?: Array<{ name?: string }> } }).result
			?.tools ?? [];
	const names = tools.map((tool) => tool.name).filter(Boolean).sort();
	if (JSON.stringify(names) !== JSON.stringify(expectedTools)) {
		throw new Error(
			`tools/list mismatch: expected ${expectedTools.join(", ")}, got ${names.join(", ")}`,
		);
	}

	console.log(`Authenticated tool surface OK: ${names.join(", ")}`);
}

async function postMcp(method: string, params?: unknown) {
	const res = await fetch(endpoint, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "application/json, text/event-stream",
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
		signal: AbortSignal.timeout(8000),
	});
	const text = await res.text();
	return {
		status: res.status,
		payload: parseMcpPayload(text),
		preview: text.slice(0, 240),
	};
}

function parseMcpPayload(text: string): unknown {
	const trimmed = text.trim();
	if (!trimmed) return {};
	try {
		return JSON.parse(trimmed);
	} catch {
		const dataLines = trimmed
			.split(/\r?\n/)
			.filter((line) => line.startsWith("data:"))
			.map((line) => line.slice("data:".length).trim())
			.filter((line) => line && line !== "[DONE]");
		const last = dataLines.at(-1);
		if (!last) return {};
		return JSON.parse(last);
	}
}
