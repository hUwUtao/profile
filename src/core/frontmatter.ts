import type { MarkdownLayoutProps } from "astro";

export type FrontmatterProps = {
	title: string;
	date: string;
	brief: string;
	keywords: string;
};

export type ArticleProps = MarkdownLayoutProps<FrontmatterProps>;
