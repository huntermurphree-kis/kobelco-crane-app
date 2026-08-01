# Kobelco Crane Specs

An installable Progressive Web App (PWA) for browsing Kobelco crane models and
opening their spec sheets. Tap the icon → browse models → tap a model → its spec
PDF opens in the phone's native viewer.

**Stack:** React (Vite) + a single JSON data file + `vite-plugin-pwa`.
Deployed to GitHub Pages.

---

## Adding or editing a crane (the common task)

Everything is driven by one file — you never touch app logic to add a crane.

1. Open `src/data/cranes.json`.
2. Add a new object following the existing shape:
   ```json
   {
     "id": "ck9999g-3",
     "series": "CK-G3 Series",
     "model": "CK 9999G-3",
     "specUrl": "https://.../CK9999G-3_spec.pdf"
   }
   ```
   - `id` — a stable, unique slug. **Never reuse or change it** once created
     (it's the React key).
   - `series` — used to group models into sections and to filter search.
   - `model` — the display name.
   - `specUrl` — the link opened when the row is tapped (PDF or web page).
3. Deploy:
   ```bash
   npm run deploy
   ```
4. Changes are live within a minute or two. No app-store review, and installed
   users get the update automatically (the service worker is set to
   `autoUpdate`).

---

## Local development

```bash
npm install        # first time only
npm run dev        # start local dev server
```

Open the printed URL (note it includes the base path, e.g.
`http://localhost:5173/kobelco-crane-specs/`).

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally to sanity-check
```

---

## Deployment (GitHub Pages)

1. Create a GitHub repo. The name **must match** the `base` in
   `vite.config.js` (currently `/kobelco-crane-specs/`). If you use a different
   repo name, update `base` to `'/<your-repo-name>/'` or the deployed site will
   load a blank page.
2. Push this project to the repo's `main` branch.
3. Deploy:
   ```bash
   npm run deploy
   ```
   This builds and pushes `dist/` to a `gh-pages` branch.
4. In the repo → **Settings → Pages**, set the source to the `gh-pages` branch.
5. Live URL: `https://<your-username>.github.io/kobelco-crane-specs/`

---

## Installing on a phone

- **iPhone:** Open the URL in **Safari** → Share → **Add to Home Screen**.
- **Android:** Open the URL in **Chrome** → **Install app** banner, or the
  three-dot menu → **Add to Home Screen**.

After one successful visit the app shell is cached and opens offline, though the
spec sheets themselves link to external Kobelco pages and need connectivity.

---

## Icons — replace the placeholders

The icons in `public/icons/` are **generated placeholders** (an orange "K").
Replace them with the official Kobelco logo (same filenames / sizes) when the
brand team provides artwork:

- `icon-192.png` — 192×192
- `icon-512.png` — 512×512
- `icon-512-maskable.png` — 512×512, safe-area padded for Android maskable icons
- `apple-touch-icon.png` — 180×180 (iOS home screen)

Brand palette placeholders in use: accent `#E4572E`, background `#1A1A1A`.
Swap for exact Kobelco brand hex values if provided.

---

## Future upgrades (not needed for v1)

- Move `cranes.json` to a hosted source (Google Sheet / Airtable) so
  non-technical staff can add cranes without touching code.
- Add `category` to each entry + a top-level tab for non-crane product lines.
- Add `thumbnailUrl` and render per-model thumbnails.
- Swap the tap-to-open handoff for an in-app PDF viewer (`react-pdf`).
