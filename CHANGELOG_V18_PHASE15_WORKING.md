# Tintology V18 – Phase 15 (working update)

## Completed in the working copy

### 1. Customer-facing names
- Renamed the 3D configurator heading to `Конфигуратор на автомобили`.
- Renamed the wrap catalog heading to `Каталог за Фолии`.
- Unified the windshield Chameleon price option at 5,000 MKD; XR88 remains 3,000 MKD.

### 2. Approved tint percentage restoration
- Restored the exact five user-approved controls: 12%, 50%, 65%, 85%, 95%.
- Restored the matching material-calibration stop keys and interpolation range.
- Updated the configurator's visible explanation: 12% is the lightest and 95% is the darkest.
- Preserved the existing calibrated Mustang, Audi and Nissan material response logic while mapping the first stop to 12%.

### 3. Homepage service presentation
- Moved the `TINTOLOGY · УСЛУГИ` service block to immediately below the main header/navigation and before the 3D configurator.
- Replaced the three generic icon cards with seven photo-led service cards using the existing Pexels/Unsplash source images and the seven approved service destinations.
- Added short service descriptions and responsive card layout.
- Removed the service dropdown from desktop and mobile navigation; kept `Автостакла` as a direct menu link.
- Kept the hero removed, the 3D configurator intact, and the catalog below the configurator.

## Existing older priorities verified in source
- The wrap catalog currently contains 200 entries with 200 unique IDs and no duplicate brand/color/finish combinations in the current structured records. No extra shades were fabricated in this update. Visual car-example image coverage is incomplete and remains a follow-up item.
- Admin product pricing system already contains the 20% supplier discount, 10% markup over regular supplier price, editable EUR/MKD conversion rate, manual MKD retail override, acquisition/selling/profit calculations, and save flow.
- Public catalog prices are served separately through `/api/catalog-prices`; internal acquisition cost and margin are not part of that public response.
- Existing simulator cleanup from Phase14 remains: customer-facing diagnostics panel and Node Map controls are removed; underlying material classification/mapping remains.
- Existing model exclusions remain: SEAT Leon, Škoda Octavia, Honda Civic, and Porsche 911 (1970s) removed; Porsche 911 (930) Turbo retained.

## Still pending from the older plan
- Live runtime validation of the 3D glass targeting on the problematic models (Golf 7, Mercedes-Benz, BMW, Porsche 911 (1970s) history) and the validated Ford Mustang reference. No model is to be deleted beyond the four explicitly approved removals.
- Expansion of the wrap catalog toward 150–200 verified, non-duplicate real variants, especially Oracal, Metamark, KPMF and Avery. Do not invent shades or technical specifications.
- Populate product pricing only from actual supplier prices; no fabricated prices. The financial calculation flow exists, but supplier data entry/import and validation remain.
- Verify all seven service photos in desktop/mobile browser and confirm external image source/licensing and network loading.
- Run full dependency installation, TypeScript checks, Vite production build, and live desktop/mobile checks before packaging the final ZIP.

## Validation performed for this working update
- TypeScript TSX transpilation/syntax diagnostics passed for `App.tsx`, `CarStudio.tsx`, `ProductCatalog.tsx`, and `Admin.tsx`.
- Source checks confirmed the exact five tint stops, renamed headings, seven service cards, service-block placement before the simulator, and direct Auto Glass navigation link.
- Full type-check, Vite build, and live 3D/browser tests have not yet been run.
