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
- The contact form posts to `functions/api/enquiry.ts`, verifies Cloudflare Turnstile, and sends through Resend to the `ENQUIRY_TO` environment setting (currently intended to be `steven@gluckli.com`). The recipient stays in Cloudflare configuration.
- Optional attachments are emailed with the enquiry: up to 3 JPG, PNG, WebP or PDF files, 5 MB each and 10 MB combined. The browser and backend enforce limits; the backend also checks file signatures and bounds the request body.
- Run `node --test tests/enquiry.test.mjs` for mocked attachment/email tests and `npm run build` for type checking and a production build. Tests do not send real emails.

## Cloudflare Pages deployment

This is a static Astro site, so it can deploy directly to Cloudflare Pages without a Worker. Push the repository to GitHub or GitLab, then in Cloudflare Pages create a project from that repository. Set the build command to `npm run build` and the build output directory to `dist`. Cloudflare will build and publish each connected branch update.

Set the production domain in `astro.config.mjs` if it changes from `https://roomwright.co.uk`, then rebuild so canonical URLs and the sitemap are correct. Deploy the `functions` directory alongside the static build for the contact endpoint; keep its mail-service credentials in Cloudflare secrets, never in this repository. Attachment support requires the updated frontend and function to be deployed together.
