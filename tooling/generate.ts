/**
 * Emit every Saya install adapter from the single canonical config.
 *
 *   pnpm generate          # write all generated files
 *   pnpm generate --check  # fail if any generated file is stale (CI drift gate)
 *   pnpm generate --help   # print usage
 *
 * Generated files (never hand-edit): .mcp.json, .claude-plugin/*,
 * .codex-plugin/*, .cursor-plugin/*, server.json, and the README install block.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { saya } from "../saya.config.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const HELP = process.argv.includes("--help") || process.argv.includes("-h");
const repoGit = `${saya.repository}.git`;
const author = { name: saya.owner.name, email: saya.owner.email };

const json = (value: unknown) => `${JSON.stringify(value, null, "\t")}\n`;

if (HELP) {
	console.log(`Usage: pnpm generate [--check]

Generate Saya plugin manifests from saya.config.ts.

Options:
  --check   fail when generated files or the README install block are stale
  --help    show this help text
`);
	process.exit(0);
}

/** Per-client install instructions — also the source for README + the app. */
export const installClients = [
	{
		id: "mcp",
		label: "Any MCP client (.mcp.json)",
		blurb:
			"Add Saya as a Streamable HTTP MCP server at the live workers.dev origin. When your client prompts, complete browser OAuth for your team; the per-team bearer belongs in the client credential store, never in this repo.",
		steps: [
			json({
				mcpServers: {
					[saya.mcp.id]: {
						url: saya.mcp.url,
						transport: saya.mcp.transport,
					},
				},
			}).trim(),
		],
	},
	{
		id: "skills",
		label: "Any agent (npx skills)",
		blurb:
			"Installs the secondary usage-guide skill for skill-aware agents. This teaches when to query Saya; the live MCP endpoint remains the product surface.",
		steps: [`npx skills add ${slug()}`],
	},
	{
		id: "claude-code",
		label: "Claude Code",
		blurb:
			"Add the marketplace, install the Saya plugin, then complete browser OAuth before the first team-brain query.",
		steps: [
			`/plugin marketplace add ${slug()}`,
			`/plugin install ${saya.name}@${saya.name}`,
		],
	},
	{
		id: "codex",
		label: "Codex",
		blurb:
			"Add this repo as a Codex plugin marketplace, install from /plugins, then authenticate the MCP connection for your workspace.",
		steps: [`codex plugin marketplace add ${slug()}`],
	},
	{
		id: "cursor",
		label: "Cursor",
		blurb:
			"Install Saya from the Cursor plugin marketplace, then authenticate the MCP connection for your workspace.",
		steps: [`Cursor -> Settings -> Plugins -> Add marketplace -> ${slug()}`],
	},
];

function slug() {
	return saya.repository.replace("https://github.com/", "");
}

function toolSummary() {
	return saya.tools.map((tool) => ({
		name: tool.name,
		scope: tool.scope,
		description: tool.description,
	}));
}

function pluginMetadata() {
	return {
		tools: toolSummary(),
		scopes: saya.tools.map((tool) => tool.scope),
		readiness: saya.readiness.status,
		mcp: {
			id: saya.mcp.id,
			url: saya.mcp.url,
			transport: saya.mcp.transport,
			futureUrl: saya.mcp.futureUrl,
		},
	};
}

const files: Record<string, string> = {
	".mcp.json": json({
		mcpServers: {
			[saya.mcp.id]: {
				url: saya.mcp.url,
				transport: saya.mcp.transport,
			},
		},
	}),

	".claude-plugin/plugin.json": json({
		name: saya.name,
		version: saya.version,
		description: saya.shortDescription,
		author,
		homepage: saya.homepage,
		repository: repoGit,
		license: saya.license,
		keywords: saya.keywords,
		displayName: saya.displayName,
		skills: "./skills",
		mcpServers: "./.mcp.json",
		metadata: pluginMetadata(),
	}),
	".claude-plugin/marketplace.json": json({
		name: saya.name,
		owner: author,
		plugins: [
			{
				name: saya.name,
				displayName: saya.displayName,
				source: "./",
				description: saya.shortDescription,
				metadata: pluginMetadata(),
			},
		],
	}),

	".codex-plugin/plugin.json": json({
		name: saya.name,
		version: saya.version,
		description: saya.shortDescription,
		author,
		homepage: saya.homepage,
		repository: repoGit,
		license: saya.license,
		keywords: saya.keywords,
		skills: "./skills",
		mcpServers: "./.mcp.json",
		interface: {
			displayName: saya.displayName,
			shortDescription: saya.shortDescription,
			longDescription: saya.longDescription,
			developerName: saya.owner.name,
			category: saya.category,
			logo: saya.logo,
			metadata: pluginMetadata(),
		},
	}),

	".cursor-plugin/plugin.json": json({
		name: saya.name,
		version: saya.version,
		description: saya.shortDescription,
		author,
		homepage: saya.homepage,
		repository: repoGit,
		license: saya.license,
		keywords: saya.keywords,
		displayName: saya.displayName,
		logo: saya.logo.replace("./", ""),
		skills: "./skills",
		mcpServers: "./.mcp.json",
		metadata: pluginMetadata(),
	}),
	".cursor-plugin/marketplace.json": json({
		name: saya.name,
		owner: author,
		metadata: {
			description: saya.shortDescription,
			...pluginMetadata(),
		},
		plugins: [
			{ name: saya.name, source: ".", description: saya.shortDescription },
		],
	}),

	// Official MCP Registry server metadata (central remote Streamable HTTP).
	"server.json": json({
		$schema:
			"https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json",
		name: saya.registryName,
		description: saya.shortDescription,
		version: saya.version,
		repository: { url: saya.repository, source: "github" },
		remotes: [{ type: saya.mcp.transport, url: saya.mcp.url }],
	}),
};

/** README install block, rendered between AUTO-GENERATED markers. */
function readmeInstallBlock() {
	const lines = installClients.map((c) => {
		const body =
			c.id === "mcp"
				? ["```json", c.steps[0], "```"].join("\n")
				: ["```sh", ...c.steps, "```"].join("\n");
		return `### ${c.label}\n\n${c.blurb}\n\n${body}`;
	});
	return lines.join("\n\n");
}

const START = "<!-- AUTO-GENERATED:INSTALL START -->";
const END = "<!-- AUTO-GENERATED:INSTALL END -->";

function applyReadme(current: string): string {
	const block = `${START}\n\n${readmeInstallBlock()}\n\n${END}`;
	const re = new RegExp(`${START}[\\s\\S]*?${END}`);
	if (!re.test(current)) {
		throw new Error("README is missing the AUTO-GENERATED:INSTALL markers.");
	}
	return current.replace(re, block);
}

let stale = 0;
const report = (rel: string) => {
	console.log(`${CHECK ? "stale" : "wrote"}: ${rel}`);
	stale += 1;
};

for (const [rel, content] of Object.entries(files)) {
	const path = join(ROOT, rel);
	const existing = safeRead(path);
	if (existing === content) continue;
	if (CHECK) report(rel);
	else {
		writeFileSync(path, content);
		report(rel);
	}
}

// README block
{
	const path = join(ROOT, "README.md");
	const current = safeRead(path);
	if (current !== null) {
		const next = applyReadme(current);
		if (next !== current) {
			if (CHECK) report("README.md (install block)");
			else {
				writeFileSync(path, next);
				report("README.md (install block)");
			}
		}
	}
}

function safeRead(path: string): string | null {
	try {
		return readFileSync(path, "utf8");
	} catch {
		return null;
	}
}

if (CHECK && stale > 0) {
	console.error(
		`\n${stale} generated file(s) are stale. Run \`pnpm generate\` and commit.`,
	);
	process.exit(1);
}
console.log(CHECK ? "generated files are up to date." : "generated all adapters.");
