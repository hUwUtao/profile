import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
	output: "static",
	// adapter: cloudflare({ mode: "directory" }),
	vite: {
		resolve: {
			alias: [...(process.env.NODE_ENV === "production" ? esmsh() : [])],
		},
	},
	integrations: [
		mdx({
			syntaxHighlight: "shiki",
			shikiConfig: {
				theme: "monokai",
			},
		}),
		react(),
		process.env.NODE_ENV === "production" && compress(),
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
