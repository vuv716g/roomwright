# Roomwright

A fast, single-page Astro website for Roomwright, Harrison Herring’s bathroom design and installation service. Content is intentionally modest: it describes the complete-room approach without invented credentials, reviews or business facts.

## Run locally

```bash
npm install
npm run dev
```

Open the local address Astro prints in the terminal. Create an optimised production build with:

```bash
npm run build
```

The completed static site is written to `dist/`.

## Photography

All starter images are local SVG placeholders so the site works without external image services. Replace them with real, web-optimised photographs:

- Hero: replace `public/images/hero-bathroom.svg` with `public/images/hero-bathroom.jpg`, then update its reference in `src/pages/index.astro`.
- Portrait: replace `public/images/harrison-herring.svg` with `public/images/harrison-herring.jpg`, then update its reference in `src/pages/index.astro`.
- Projects: add images in `public/images/projects/` (for example `project-01.jpg`) and update `src/data/projects.ts`. Each project has an `images` array for multiple photographs later, plus optional `beforeImages` and `afterImages`.
- Before/after: replace `public/images/before-placeholder.svg` and `public/images/after-placeholder.svg` with appropriately named real files and update `src/pages/index.astro`.

Use landscape images for before/after, portrait or near-portrait images for project cards, and supply meaningful alt text once real photographs are added. Aim for compressed WebP or JPEG files; keep dimensions generous enough for the largest display size.

## Maintenance

- Business details and SEO defaults live in `src/config/site.ts`.
- Services live in `src/data/services.ts`.
- Project data lives in `src/data/projects.ts`.
- The contact form is visibly disabled until a secure endpoint is chosen. Email is the working contact method.

## Cloudflare Pages deployment

This is a static Astro site, so it can deploy directly to Cloudflare Pages without a Worker. Push the repository to GitHub or GitLab, then in Cloudflare Pages create a project from that repository. Set the build command to `npm run build` and the build output directory to `dist`. Cloudflare will build and publish each connected branch update.

Set the production domain in `astro.config.mjs` if it changes from `https://roomwright.co.uk`, then rebuild so canonical URLs and the sitemap are correct. A future contact endpoint can be added as a Cloudflare Pages Function or Worker; keep its mail-service credentials in Cloudflare secrets, never in this repository.
