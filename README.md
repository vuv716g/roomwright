# Roomwright

A fast, single-page Astro website for Roomwright, Harrisonâ€™s room design and installation service. Content is intentionally modest: it describes the complete-room approach without invented credentials, reviews or business facts.

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

The current homepage uses the Kingshill/Rougemont project photographs in `public/images/kingshill-rougemont/`. They are supplied high-resolution JPEGs and provide a useful first portfolio while more photography is gathered.

- Hero, project cards and project-details panels are referenced from `src/pages/index.astro` and `src/data/projects.ts`.
- Use meaningful alt text that describes the completed room or visible detail when replacing them.
- For future images, use compressed WebP or JPEG files and retain generous source dimensions for the largest display size.
## Maintenance

- Business details and SEO defaults live in `src/config/site.ts`.
- Services live in `src/data/services.ts`.
- Project data lives in `src/data/projects.ts`.
- The contact form is visibly disabled until a secure endpoint is chosen. Email is the working contact method.

## Cloudflare Pages deployment

This is a static Astro site, so it can deploy directly to Cloudflare Pages without a Worker. Push the repository to GitHub or GitLab, then in Cloudflare Pages create a project from that repository. Set the build command to `npm run build` and the build output directory to `dist`. Cloudflare will build and publish each connected branch update.

Set the production domain in `astro.config.mjs` if it changes from `https://roomwright.co.uk`, then rebuild so canonical URLs and the sitemap are correct. A future contact endpoint can be added as a Cloudflare Pages Function or Worker; keep its mail-service credentials in Cloudflare secrets, never in this repository.
