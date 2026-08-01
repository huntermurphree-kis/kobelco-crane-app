# Kobelco Crane Specs

An installable Progressive Web App (PWA) for browsing Kobelco crane models and
opening their spec sheets. Tap the icon → browse models → tap a model → its spec
PDF opens in the phone's native viewer.

**Stack:** React (Vite) + a single JSON data file + `vite-plugin-pwa`.
Deployed to GitHub Pages.

---

## Adding a crane — two ways

### A) In-app "Add" (quick, this device only)

Tap **+ Add** in the header, fill in Model / Series / Spec URL, and Save. The
crane appears immediately with an **Added** badge and can be edited (✎) or
deleted (🗑). These are stored in the browser's `localStorage`, so they live on
**that one device/browser only** — they are not shared with other users and are
not part of a deploy. Good for trying something out or a personal add.

Implementation: `src/useCustomCranes.js` (storage) + `src/CraneForm.jsx` (form).
The built-in list and device-local additions are merged in `src/App.jsx`.

### B) Edit the data file (permanent, shared with everyone)

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

## Branding & icons

The app uses the official Kobelco logo and brand palette.

- `public/kobelco-logo.png` — cropped blue wordmark (transparent), used for icons
- `public/kobelco-logo-white.png` — white version, used in the teal header
- `public/icons/` — home-screen icons generated from the logo
  (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`)

To refresh from a new logo file, drop the new PNG in and re-run the icon
generation step, or regenerate the four icon sizes from the wordmark.

**Brand palette:**

| Role                | Hex       |
| ------------------- | --------- |
| Header teal         | `#00B0AB` |
| CTA / button yellow | `#FBB015` |
| Footer blue         | `#33A2DB` |
| Body text           | `#2D2D2D` |
| Muted / labels      | `#838391` |
| Button text         | `#333333` |
| Page background     | `#FFFFFF` |

---

## Future upgrades (not needed for v1)

- Move `cranes.json` to a hosted source (Google Sheet / Airtable) so
  non-technical staff can add cranes without touching code.
- Add `category` to each entry + a top-level tab for non-crane product lines.
- Add `thumbnailUrl` and render per-model thumbnails.
- Swap the tap-to-open handoff for an in-app PDF viewer (`react-pdf`).
