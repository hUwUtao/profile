import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://stdpi.work",
	output: "static",
	vite: {
		resolve: {
			// alias: [...(process.env.NODE_ENV === "production" ? esmsh() : [])],
		},
	},
	integrations: [
		sitemap(),
		mdx({
			syntaxHighlight: "shiki",
			shikiConfig: {
				theme: "monokai",
			},
		}),
		react(),
	].filter(Boolean),
});
function esmsh() {
	return [
		//
		"react",
		"react-dom/client",
		"react-router-dom",
		"@sentry/integrations",
		"@sentry/react",
		"canvas-confetti",
		"bootstrap-icons",
	].map((k) => ({
		find: new RegExp(`^(${k}[/]?.*)$`),
		replacement: "https://esm.sh/$1?bundle",
	}));
}
