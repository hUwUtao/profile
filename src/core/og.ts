export function getOgImagePath(pathname: string) {
	const cleanPath = pathname.replace(/(^\/|\/$)/g, "");
	const key = cleanPath.length ? cleanPath.replaceAll("/", "-") : "index";
	return `/og/${key}.webp`;
}
