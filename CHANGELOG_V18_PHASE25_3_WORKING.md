# Tintology Phase25.3 — working changes

Base: `Tintology-Phase25.2-working.zip`. The Phase25.2 archive remains unchanged; this is a separate working copy.

## Implemented
- Preserved the existing Wrap ordering: variants with vehicle photos remain first, followed by variants without vehicle photos. No colors or brands were removed.
- Added fifty-two additional exact matched Wrap price records, bringing priced catalogue entries from 5 to 57. Five Metamark shade candidates remain unpriced until the supplier confirms the exact MM-CC product code. Public prices remain EUR/m², based on the exact supplier item price in RSD, official NBS EUR/RSD rate 117.6018 applicable on 2026-11-08, and the agreed 10% markup.
- Unverified catalogue variants continue to display `Цена на барање`; no prices are estimated or copied across similar-but-not-identical products.
- Added a prominent selling-price panel inside each expanded Wrap product detail, so the price is visible when a color is opened. Supplier details and source URLs remain internal only.
- Changed simulator tint options to the user's approved 12%, 50%, 65%, 85%, 95% scale and added a light 12% calibration point to all model response curves.
- Added explicit TINT and WRAP quick controls to the full-screen simulator control panel. The vehicle preview and both adjustment sections remain visible; the buttons select the active simulator mode without removing either control set.
- Kept the existing Phase25 service images: windshield repair image visibly shows a crack and resin repair tool; tinting image shows a car with dark tinted windows. They are already assigned to the homepage service cards and service-page links in this base.

## Price coverage
- Total Wrap variants in the base: 203 (preserved).
- Priced variants after this pass: 57 (52 additional exact name/code or shade/finish matches).
- Remaining variants without a usable supplier match: 146, including five Metamark candidates held at `Цена на барање` pending exact code confirmation. — these continue to show `Цена на барање`.
- Internal source/rate audit: `data/WRAP_PRICE_AUDIT_PHASE25_3_INTERNAL.md`.

## Validation
- ZIP integrity checked before editing.
- `data/product-prices.json` parses and contains 57 entries.
- All 57 price IDs were matched to product IDs in `src/ProductCatalog.tsx`.
- Public EUR/m² calculation checked against the official NBS rate and 10% markup.
- TypeScript transpilation syntax checks passed for `App.tsx`, `CarStudio.tsx`, `ProductCatalog.tsx`, and `server.ts`. Wrap ordering was checked programmatically: 45 vehicle-photo variants appear before the 158 variants without vehicle photos.
- Full Vite build / project typecheck could not be completed in this container because dependency installation timed out and the Vite/type packages are not fully available. Run the normal dependency installation on the Windows project copy before local build testing.

## Phase25.3 continuation — user-approved changes
- Restored the Ценовник action to desktop and mobile primary navigation; retained existing admin-managed price entries and editor.
- Consolidated shower enclosure film as one of six categories under Фолии за домови и објекти; removed the separate homepage shower-service card/section.
- Added six image-led architectural-film category cards and prominent ТЕРМО ИЗОЛАЦИЈА messaging with product-dependent performance wording.
- Updated the About heading to `Секој детаљ. Совршен финиш.`
- Changed Wrap catalogue ordering to verified public EUR/m² price ascending; unpriced variants remain at the end and continue to display `Цена на барање`. Existing vehicle photos are retained.
- Made each of the six building-film cards clickable and added a matching detail section; the shower-film legacy URL now opens the combined building-films page.
- Replaced visible supplier-brand labels in the admin price editor with generic purchasing-price terminology.
- The 3D simulator source was not edited in this continuation.

## Supplier price verification continuation — 2026-11-08
- Added 15 further exact supplier matches: 13 KPMF variants and 2 Arlon variants.
- Verified Wrap price records now total 72 of 203; 131 variants remain without an exact confirmed supplier match and display `Цена на барање`.
- Added individual supplier page references and the dated official EUR/RSD conversion basis to the internal-only audit file.
- No prices were extrapolated to unverified variants or neighbouring product codes.

- Continued exact-match checks across KPMF, Mactac and ORACAL: added 7 further in-stock exact supplier matches. Total verified Wrap price records now 79/203; 124 variants remain unpriced pending exact in-stock supplier confirmation.

- Added 4 more exact in-stock Avery Dennison Supreme Wrapping Film matches. Total verified Wrap price records: 83/203; 120 variants remain unpriced pending exact supplier confirmation.

- Added the exact ORACAL code 933 G Tin Metallic supplier match at 3,265 RSD/m². Verified Wrap price records: 84/203; 119 variants remain unpriced.

- Added 21 further product-specific car-example photos and replaced one generic image with its exact product photo from verified supplier galleries (KPMF, Arlon, Mactac, ORAFOL and Avery). Total Wrap catalogue image references: 69. No generic substitute images were invented for variants without an example photo.
