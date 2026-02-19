import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ImageResponse from "@takumi-rs/image-response";

const width = 1200;
const height = 630;
const postsPageSize = 5;
const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const postsDir = path.join(rootDir, "src/pages/posts");
const outputDir = path.join(rootDir, "public/og");
const departureMonoRegular = await loadFirstFont([
  path.join(rootDir, "public/fonts/departuremono/DepartureMono-Regular.woff"),
]);

await mkdir(outputDir, { recursive: true });

const jobs = [
  {
    route: "/",
    title: "i am stdpi",
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
    title: fm.title || "post",
    description: fm.brief || "random post from @stdpi",
  });
}

jobs.push(...postJobs);

const postsPages = Math.max(1, Math.ceil(postJobs.length / postsPageSize));
for (let page = 1; page <= postsPages; page++) {
  const route = page === 1 ? "/posts" : `/posts/${page}`;
  jobs.push({
    route,
    title: "posts",
    description:
      "random posts from @stdpi" + page === 1 ? "" : ", page " + page,
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
  const fonts = [];
  if (departureMonoRegular) {
    fonts.push({
      name: "Departure Mono",
      data: departureMonoRegular,
      weight: 400,
      style: "normal",
    });
  }

  const response = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "54px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        backgroundColor: "#111213",
        fontFamily: "Departure Mono, DejaVu Sans Mono",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
          border: "3px solid #ffffff",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "0",
          borderLeft: "10px solid #ff0000",
          opacity: "0.9",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "95%",
          position: "relative",
          zIndex: "1",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            width: "250px",
            padding: "8px 12px",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            border: "2px solid #ffffff",
            backgroundColor: "#00000066",
            fontFamily: "Departure Mono, DejaVu Sans Mono",
          }}
        >
          stdpi.work
        </span>
        <h1
          style={{
            margin: 0,
            marginTop: "24px",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: "1.05",
            maxWidth: "1040px",
            fontFamily: "Departure Mono, DejaVu Sans Mono",
          }}
        >
          {title}
        </h1>
      </div>
      <p
        style={{
          margin: 0,
          maxWidth: "92%",
          color: "#efefef",
          fontSize: "30px",
          position: "relative",
          zIndex: "1",
          fontFamily: "Departure Mono, DejaVu Sans Mono",
        }}
      >
        {description}
      </p>
    </div>,
    {
      width,
      height,
      format: "webp",
      quality: 88,
      ...(fonts.length ? { fonts } : {}),
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

async function loadFirstFont(candidates) {
  for (const candidate of candidates) {
    try {
      return await readFile(candidate);
    } catch {}
  }
  return undefined;
}
