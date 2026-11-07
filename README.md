# Spacecraft Associates — website & content studio

A design-led website for **Spacecraft Associates**, a construction and real-estate company, built with SvelteKit and managed entirely in Sanity Studio.

- **Website** (repo root): SvelteKit 2 · Svelte 5 · TypeScript · Tailwind CSS 4
- **Studio** (`/studio`): Sanity Studio with a custom desk structure, page builder and leads inbox

The site runs out of the box in **demo mode** with no accounts or keys. It serves bundled sample content through the same GROQ queries it uses in production. Once you connect a Sanity project, the content comes from Sanity instead.

---

## 1. Quick start

Requires **Node 22.12+**.

```bash
npm install
npm run dev          # http://localhost:5173 — demo mode, no configuration needed
```

To run the Studio as well:

```bash
cd studio
npm install
cp .env.example .env # add your project ID (see §3)
npm run dev          # http://localhost:3333
```

## 2. Design concept: "drawing to building"

The visual identity reads like an architecture journal crossed with a developer's drawing set:

| Token                   | Use                                                            |
| ----------------------- | -------------------------------------------------------------- |
| **Ink** `#16181a`       | Primary text, dark sections                                    |
| **Limestone** `#f4efe6` | Page background, with a subtle paper grain                     |
| **Copper** `#bd6a45`    | The "redline" accent for actions, highlights and drawing lines |
| **Sage** `#7b8766`      | Landscape, success states and quiet details                    |
| **Newsreader**          | Display serif (optical sizing, italics for emphasis)           |
| **Manrope**             | Body sans                                                      |
| **IBM Plex Mono**       | Drawing-sheet labels (`SA—02 · Projects`), data and metadata   |

Recurring motifs include sheet labels, corner registration ticks, dimension-line underlines, and blueprint grids.

All tokens live in [`src/routes/layout.css`](src/routes/layout.css) as Tailwind v4 `@theme` variables: colour, fluid type scale, spacing, radius, shadows, easing and durations. They are available as utilities such as `bg-ink-900`, `text-display-lg`, `py-section` and `ease-out-expo`.

### Signature moment: the construction story

The home page hero and the "From drawing board to door key" timeline share one sticky stage showing a 35-second photoreal 1080p construction film ([`static/hero/`](static/hero/), generated with Higgsfield and upscaled with FLUX.3 Upscale). Scrolling scrubs the film, so the building goes up as visitors move through the process steps managed in Sanity:

1. Printed drawings on a table at the site at first light (design).
2. The camera rises to the plot, marked out in lime powder and pegs (approvals).
3. Excavation, the foundation raft, then the concrete frame rising with a tower crane (foundation and structure).
4. Blockwork, glazing and terracotta fins close in the building in golden light (envelope).
5. The crane comes down, landscaping goes in and the windows light up at dusk (finishes).
6. A blue-hour pull-back reveals the finished tower (aftercare).
7. At the lit entrance, the project manager hands the keys to the new homeowners (handover).

Editors choose which stage each process step plays (**Home page → Process & construction film**). The film timeline lives in [`src/lib/hero-film.ts`](src/lib/hero-film.ts).

How the film degrades and performs:

- **First paint / no JS:** the film's first frame is the LCP image, and all step content stays readable in normal document flow.
- **Loading:** the film is split into seven stage-sized segments (`static/hero/film-1..7.mp4`, 1920×1080 near-lossless H.264 at CRF 20, 6–16 MB each, about 60 MB in total). After first paint they download one after another, starting with the stage on screen, and are held in memory, so every seek is instant and no scene is skipped. The first stage scrubs after about 6.5 MB instead of the whole film. A stage whose segment has not arrived yet shows its still until it does. A keyframe every 16 frames keeps backward scrubbing smooth; large jumps (fast scrolls, anchor links) seek straight to the target instead of easing.
- **Phones:** in portrait the 16:9 film sits letterboxed at the top of the screen, above the docked step card.
- **Reduced motion or data saver:** the film is not downloaded; a still from the film cross-fades in for each step.

To rebuild the film, keep the source clips in `assets-src/hero-video/` (git-ignored: 720p originals in `clips/`, 1080p upscales in `clips-1080/`), run its `stitch.sh` to make the master, then `segments.sh` to cut the web segments (its frame `CUTS` must match `CUTS` in `hero-film.ts`), and bump `VERSION` in `hero-film.ts`.

Other motion is built with transforms and opacity only. It includes:

- word-by-word heading reveals and image mask wipes
- scroll-linked image drift and count-up statistics
- self-drawing icons, magnetic buttons and a cursor-following spotlight
- a service index where preview images follow the cursor
- View Transitions between pages
- animated filter reflow and native `<dialog>` modals

Every effect respects `prefers-reduced-motion`.

## 3. Connect Sanity

1. **Create a project** at [sanity.io/manage](https://www.sanity.io/manage), or run `cd studio && npx sanity init --env` and reuse this folder.
2. **Configure the Studio:** copy `studio/.env.example` to `studio/.env` and set `SANITY_STUDIO_PROJECT_ID`.
3. **Import the sample content.** This uploads the placeholder images and a sample brochure:
   ```bash
   cd studio
   npx sanity login
   npm run seed        # builds seed/seed.ndjson and imports it into "production" (--replace)
   ```
4. **Configure the website:** copy `.env.example` to `.env` and set `PUBLIC_SANITY_PROJECT_ID`. For live lead capture, also set `SANITY_API_WRITE_TOKEN`: create an **Editor** token under _API → Tokens_. It is only ever read server-side.
5. **CORS:** in _API → CORS origins_, add your Studio URL. The website itself doesn't need CORS because it queries from the server.

> **Sanity version:** the brief asked for Sanity v3. The Studio is written against the v3 schema API (`defineType`, `defineField`, `structureTool`), which carries through unchanged to the current release, so the current `sanity` package (v6) is installed rather than the end-of-life 3.x line. Moving between majors needs no schema changes.

Content is cached at the edge for 5 minutes with background revalidation (`s-maxage=300, stale-while-revalidate`), so published edits appear within a few minutes. To make updates instant, add a Sanity webhook that triggers a redeploy or cache purge on your host.

## 4. Editing content (for the Spacecraft Associates team)

Everything a visitor reads is editable in the Studio:

| Studio section                         | Controls                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Leads**                              | Every enquiry, grouped as New, In progress, Won and Closed. Update the status, assign a team member, add internal notes.                                                                                                                                                                                                                                                           |
| **Home page**                          | Hero text and CTAs, background (construction film, image or video), trust metrics, featured projects, "Why us" pillars, the process timeline (drives the 3D story), testimonials, FAQs and the closing CTA                                                                                                                                                                         |
| **Projects**                           | Status, type, location and coordinates, gallery, video and virtual tour, overview, key facts, prices (display text plus numbers for the budget filter), amenities, units and plot sizes with availability, specifications, approvals, RERA and DTCP, brochure PDF, nearby places, FAQs, related projects. **Construction updates** are separate dated entries linked to a project. |
| **Services**                           | Summary, rich text, process, deliverables, project examples, FAQs, and which "interest" the enquiry form pre-selects                                                                                                                                                                                                                                                               |
| **Pages**                              | About, Quality & specifications, For landowners, Buyer's guide, Contact, Privacy, Terms, Thank you, and any new page (reachable at `/<slug>`). Pages are built from drag-and-drop sections. The `projects`, `services`, `insights` and `gallery` pages hold the header copy and SEO for those listing pages.                                                                       |
| **Insights / Buyer's guide / Gallery** | Articles with categories and authors (H2/H3 headings build the table of contents), guides with checklists, and categorised gallery images                                                                                                                                                                                                                                          |
| **Team / Testimonials / FAQs**         | Reusable across pages                                                                                                                                                                                                                                                                                                                                                              |
| **Settings**                           | Site settings (logo, contacts, WhatsApp number and message template, address and map pin, hours, service areas, social links, form options and consent text, feature switches, default SEO), Navigation, Footer, Redirects                                                                                                                                                         |

Practical notes:

- **Alt text is mandatory** on every image. The Studio blocks publishing until it is meaningful.
- **Feature switches** (_Settings → Site settings → Feature switches_) hide plotted developments, unit availability tables and the floating contact button.
- **WhatsApp messages** use `{context}` to insert the project or service name automatically.
- **Certifications and approvals** are only ever shown as entered. Entries marked "Placeholder" are visibly labelled on the site. Only list credentials you can evidence.
- **Redirects** take effect within a minute and use permanent 308 redirects by default.

### Replacing the demo content before launch

1. Clear **Site settings → Demo / announcement notice**. This removes the "Demo content" notice.
2. Replace every contact detail, the address and map coordinates, business figures (years, homes delivered, sq ft), team profiles, testimonials, and RERA and approval numbers. All demo values are marked `[Demo]`, `Demo profile` or `[Replace …]`.
3. Replace the images. Every placeholder is stamped **"DEMO IMAGE · REPLACE IN SANITY"**. Upload real photography with the same field, set the hotspot and write alt text.
4. Replace each project's sample brochure PDF.
5. Have your legal advisor review the Privacy policy and Terms. They are templates.

## 5. Leads, forms and security

The four enquiry flows (consultation or site visit, project enquiry, landowner/JV, and brochure request) post to SvelteKit form actions at `/enquire?/<type>`:

- **Validation:** the server validates every submission with Zod ([`src/lib/server/leads.ts`](src/lib/server/leads.ts)) and returns friendly field errors plus an error summary that receives focus.
- **Without JavaScript:** forms still work. Valid posts redirect to `/thank-you`, and invalid ones re-render with errors.
- **Spam protection:** a honeypot field, a minimum fill time and a best-effort per-IP rate limit. Put a platform WAF or bot protection in front for high traffic.
- **Consent:** a checkbox with a privacy-policy link is required. The exact consent text shown is stored with the lead.
- **Attribution:** first-touch UTM parameters and the landing page are captured in an httpOnly cookie, with no JS needed. Each lead stores its source route, referrer, selected project or service, timestamp and status.
- **Brochures:** the PDF URL is never in the page source. It is returned only after a valid brochure request.
- **Token safety:** the Sanity write token is server-only (`$env/dynamic/private`) and never reaches the browser.
- **Notifications:** set `LEAD_NOTIFY_WEBHOOK_URL` to receive new leads in Slack, Zapier or similar.

## 6. SEO

- Per-page title, description, canonical URL, Open Graph and Twitter tags, from Sanity with site-wide defaults
- JSON-LD:
  - `GeneralContractor` (organisation and local business) on every page
  - `RealEstateListing` on project pages
  - `Service` on service pages
  - `BlogPosting` and `Article` on insights and guides
  - `FAQPage` wherever FAQs appear
  - `BreadcrumbList` on inner pages
- `/sitemap.xml` built from content. `/robots.txt` blocks indexing on preview and localhost deployments automatically.
- CMS-managed redirects in `hooks.server.ts`

## 7. Accessibility and quality

- Checked against WCAG 2.2 AA:
  - skip link and semantic landmarks
  - visible focus styles and keyboard-operable menus, dialogs, tabs, accordions, carousel, lightbox and filters
  - error summaries and labelled fields
  - 24 px minimum touch targets and reduced-motion support
- An automated axe-core audit of all 17 routes reports **0 violations**.
- Pages are server-rendered and work without JavaScript: filters are GET forms, accordions use `<details>`, and forms post normally.
- Images are responsive (`srcset` from the Sanity image pipeline), with intrinsic dimensions to prevent layout shift, LQIP blur-up, a prioritised LCP image and lazy loading for the rest.
- Latin font subsets are self-hosted and preloaded. Third-party embeds (maps, video, virtual tours) load only on click.

## 8. Scripts

| Command                                         | What it does                                                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                   | Start the website                                                                                                            |
| `npm run build` / `npm run preview`             | Production build and local preview                                                                                           |
| `npm run check`                                 | Type-check (svelte-check)                                                                                                    |
| `npm run lint` / `npm run format`               | Prettier and ESLint                                                                                                          |
| `npm test`                                      | Unit tests: lead validation and spam defences, filters, utilities, image pipeline, and every GROQ query run against the seed |
| `node scripts/generate-demo-images.ts`          | Regenerate the placeholder images in `static/demo`                                                                           |
| `cd studio && npm run dev` / `build` / `deploy` | Studio                                                                                                                       |
| `cd studio && npm run typecheck`                | Type-check the Studio                                                                                                        |
| `cd studio && npm run seed`                     | Import the sample content                                                                                                    |

## 9. Deployment

**Website on Vercel or Netlify:** import the repository. `@sveltejs/adapter-auto` detects the platform. Set the environment variables from `.env.example` (at minimum `PUBLIC_SITE_URL` and `PUBLIC_SANITY_PROJECT_ID`, plus `SANITY_API_WRITE_TOKEN` for leads). The build command is `npm run build`. To pin a platform, swap in `@sveltejs/adapter-vercel` or `@sveltejs/adapter-netlify` in `vite.config.ts`.

**Studio:** run `cd studio && npm run deploy` to host it at `<name>.sanity.studio`, or deploy `studio/dist` to any static host.

**Hardening:** consider adding a Content-Security-Policy through `kit.csp` once your third-party embeds are final. The site already sends `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy`.

## 10. Project structure

```
src/
  routes/                     Pages, form actions (/enquire), sitemap, robots
  lib/
    components/
      home/                   BuildStory (film hero + process), plates, services index, pillars…
      layout/                 Header, mobile menu, footer, contact dock/bar, cursor, dialogs
      projects/ insights/     Cards, gallery, unit plans, progress, article layout
      sections/               Page-builder renderer, page hero, FAQs
      forms/                  Lead form shell + consultation / project / landowner / brochure
      ui/                     Button, Img, Dialog, Accordion, Lightbox, PortableText, Icon…
    hero-film.ts              Construction film timeline (stage → seconds)
    motion/actions.ts         Reveal, magnetic, tilt, spotlight, scroll-progress, count-up
    server/                   Env (Zod), Sanity client, GROQ queries, leads, demo store + seed
    sanity/image.ts           Responsive image + file URL helpers
studio/
  schemaTypes/                Documents, reusable objects, page-builder sections
  structure.ts                Desk structure (singletons, leads inbox, grouped lists)
  seed/build-seed.ts          Converts the shared seed into an importable NDJSON
scripts/generate-demo-images.ts
static/demo/                  Generated placeholder imagery + sample brochure
```
