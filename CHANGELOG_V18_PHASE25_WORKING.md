# Tintology Phase25 — working changes

Base: `Tintology-phase24-working.zip` (Phase24 preserved as the source archive).

## Requested changes in this working build
- Added a custom Full Screen mode for the complete 3D configurator layout. The model and Tint/Wrap controls remain visible together; the external viewer's isolated fullscreen action is disabled.
- Kept the user's existing owl PNG as the only owl artwork. The project import asset `src/assets/images/tintology-owl-metallic.png` is replaced byte-for-byte from `public/tintology-owl.png`; no generated bird/owl art is used.
- Replaced the service-card and service-page hero image for windshield repair with a generated close-up showing a windshield crack and professional resin repair tool.
- Replaced the tinting service image with a generated/cropped photographic view of a car with dark tinted windows.
- Reduced the desktop and mobile main navigation links to exactly: `За Нас`, `Услуги`, `Контакт`; added a real About section anchor/content.
- Added public EUR/m² pricing for five individually verified Wrap catalogue items using the 2026-11-05 official middle rate 1 EUR = 117.6018 RSD and the agreed 10% markup. Internal supplier costs/rate inputs stay in server-side `data/product-prices.json`; the public API returns only calculated selling prices.

## Verified public Wrap prices
- Avery Dennison Supreme Wrapping Film Satin Black — 33.69 €/m²
- KPMF K88021 Black Gloss — 15.71 €/m²
- ORACAL 970 GRA 070 Black Glossy — 27.03 €/m²
- ORACAL 970 GRA 076 Telegrey — 29.88 €/m²
- Avery Dennison Supreme Wrapping Film Cool Teal Satin Metallic — 33.69 €/m²

Other Wrap variants remain `Цена на барање` until exact supplier pricing is verified. Supplier identity, source prices, URLs and stock status are not exposed in the public catalogue.

## Validation status
- TypeScript/TSX syntax transpilation passed for `App.tsx`, `CarStudio.tsx`, and `ProductCatalog.tsx`.
- JSON parse and public price calculations checked.
- Full `vite build` and project-wide typecheck could not be run in this environment because npm dependency installation timed out and the offline npm cache lacks a required package (`ws@8.22.1`).

## Phase25.2 implementation pass — 7 November 2026
- Wrap catalogue ordering now prioritizes variants with an assigned vehicle-photo image before variants that only have a color swatch; brand/finish ordering is retained within each group.
- Full Screen layout now assigns each of its two panels to one grid column, matching the explicit two-column grid template. This avoids the previous `lg:col-span-7` / `lg:col-span-5` spans being applied to a two-column layout.
- Pricing audit: `data/product-prices.json` contains five verified Wrap price records. All other variants continue to show “Цена на барање”; no unverified price was fabricated.
- Validation limitation: `npm run build` could not start because the extracted `node_modules` directory does not contain the Vite executable. The source ZIP remains unchanged; this is a separate working copy.
