import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ImageResponse from "@takumi-rs/image-response";
import { createElement } from "react";

const width = 1200;
const height = 630;
const postsPageSize = 5;
const rootDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const postsDir = path.join(rootDir, "src/pages/posts");
const outputDir = path.join(rootDir, "public/og");

await mkdir(outputDir, { recursive: true });

const jobs = [
	{
		route: "/",
		title: "i am @stdpi",
		description: "random software engineer, or a tech enthusiasts",
	},
];
const postJobs = [];

for (const filePath of await listFiles(postsDir)) {
	if (!filePath.endsWith(".mdx")) {
		continue;
	}

	const source = await readFile(filePath, "utf8");
	const fm = parseFrontmatter(source);
	const route = `/posts/${path
		.relative(postsDir, filePath)
		.replace(/\\/g, "/")
		.replace(/\.mdx$/, "")}`;

	postJobs.push({
		route,
		title: `@stdpi - ${fm.title || "post"}`,
		description: fm.brief || "random post from @stdpi",
	});
}

jobs.push(...postJobs);

const postsPages = Math.max(1, Math.ceil(postJobs.length / postsPageSize));
for (let page = 1; page <= postsPages; page++) {
	const route = page === 1 ? "/posts" : `/posts/${page}`;
	const title = page === 1 ? "@stdpi - posts" : `@stdpi - posts - page ${page}`;
	jobs.push({
		route,
		title,
		description: "random posts from @stdpi",
	});
}

for (const job of jobs) {
	const imagePath = path.join(rootDir, "public", getOgImagePath(job.route));
	await mkdir(path.dirname(imagePath), { recursive: true });
	const png = await renderOgImage(job.title, job.description);
	await writeFile(imagePath, png);
	process.stdout.write(`Generated ${path.relative(rootDir, imagePath)}\n`);
}

async function renderOgImage(title, description) {
	const response = new ImageResponse(
		createElement(
			"div",
			{
				style: {
					width: "100%",
					height: "100%",
					padding: "56px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					color: "#f8fafc",
					backgroundColor: "#0f172a",
					border: "6px solid #334155",
				},
			},
			createElement(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						maxWidth: "95%",
					},
				},
				createElement(
					"span",
					{
						style: {
							display: "inline-flex",
							width: "220px",
							padding: "8px 14px",
							fontSize: "24px",
							fontWeight: 700,
							letterSpacing: "0.1em",
							border: "2px solid #64748b",
							textTransform: "uppercase",
						},
					},
					"stdpi.work",
				),
				createElement(
					"h1",
					{
						style: {
							margin: 0,
							marginTop: "20px",
							fontSize: "68px",
							lineHeight: "1.05",
						},
					},
					title,
				),
			),
			createElement(
				"p",
				{
					style: {
						margin: 0,
						maxWidth: "90%",
						color: "#d1d5db",
						fontSize: "34px",
					},
				},
				description,
			),
		),
		{
			width,
			height,
			format: "webp",
			quality: 88,
		},
	);

	return Buffer.from(await response.arrayBuffer());
}

function parseFrontmatter(source) {
	const match = source.match(/^---\n([\s\S]*?)\n---/);
	if (!match) {
		return {};
	}

	const raw = match[1];
	return {
		title: getField(raw, "title"),
		brief: getField(raw, "brief"),
	};
}

function getField(frontmatterBlock, key) {
	const quoted = frontmatterBlock.match(new RegExp(`^${key}:\\s*"(.*)"$`, "m"));
	if (quoted) {
		return quoted[1].trim();
	}

	const unquoted = frontmatterBlock.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
	return unquoted?.[1].trim() || "";
}

function getOgImagePath(pathname) {
	const cleanPath = pathname.replace(/(^\/|\/$)/g, "");
	const key = cleanPath.length ? cleanPath.replaceAll("/", "-") : "index";
	return path.join("og", `${key}.webp`);
}

async function listFiles(baseDir) {
	const entries = await readdir(baseDir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(baseDir, entry.name);
			if (entry.isDirectory()) {
				return listFiles(fullPath);
			}
			return [fullPath];
		}),
	);
	return files.flat();
}
