import type { MarkdownLayoutProps } from "astro";

export type FrontmatterProps = {
	title: string;
	date: string;
	dateIso?: string;
	brief: string;
	keywords: string;
};

export type ArticleProps = MarkdownLayoutProps<FrontmatterProps>;
