## mine profile page

so it is, stoa engineering, a full day for doing simple things that refine the best. not less than a hour of ci toturing. and cool effects.

## deploy

- generate SEO thumbnails: `bun run gen:og`
- build: `bun run build`
- deploy to Cloudflare Workers: `bun run launch`

GitHub Actions deploy on push to `main` using `cloudflare/wrangler-action`.
Required repo secrets: `CLOUDFLARE_TOKEN`, `CLOUDFLARE_ID`.
