# Tintology V18 – Phase 12

## Implemented in this phase

### 1. Catalog price and profit system (highest priority)
- Added a private Admin catalog-pricing editor for each Wrap catalog product.
- Admin can enter the supplier's regular CFS price and select EUR or MKD.
- EUR conversion rate is editable per product (default 61.5 MKD/EUR).
- Default supplier discount is 20% and is adjustable per product.
- Default Tintology markup is 10% above the regular CFS price and is adjustable per product.
- Admin sees the estimated net purchase cost, suggested/overridden selling price, gross difference and gross margin.
- Manual selling-price override is supported.
- Private supplier costs and discounts are stored behind Admin authentication.
- Public catalog endpoint returns only final selling prices in MKD; it never returns CFS costs, discounts, or margin data.
- Catalog cards display the final MKD price when configured, otherwise “Цена на барање”.

### 2. Homepage structure
- Kept the 3D simulator immediately before the catalog.
- Kept the catalog on the homepage, directly after the simulator.
- Removed the Auto Glass / manufacturer / repair section blocks from the homepage.
- Added a dedicated `/avto-stakla` page, linked from the top navigation.
- Consolidated auto glass replacement, repair, mirror bonding/service, small windshield-chip repair, and the five agreed manufacturers on that page.
- Replaced the previous mixed service grid with three large homepage groups:
  1. Автомобилски фолии
  2. Wrap и промена на боја
  3. Автомобилска заштита
- Each group opens its own detailed page.
- Added a single homepage feature for “Фолии за домови и објекти”, linking to its dedicated page.
- Added MK / AL / EN language selection and translated core content on the new dedicated service pages; translated the new homepage service groups.
- Added four categories on that page: solar, privacy, glass safety/security, and decorative films.
- Retained the ALU 80 XC / Silver Stop-Sol reference and its reflective-option notes.

### 3. Navigation
- Cleaned the top navigation.
- Removed Catalog, “Фолии за домови и објекти”, Experiences, and Contact from the top navigation only.
- Kept all of those sections/content available elsewhere on the homepage/footer as appropriate.
- Added “Автостакла” as a top-navigation link to the dedicated page.
- Mobile navigation follows the same reduced structure.

### 4. Preserved
- Existing 3D simulator component and models were not edited.
- Existing catalog product data, colors, filters, and horizontal rail were preserved.
- Existing homepage hero image was intentionally left unchanged pending the user's selection from 3–4 candidate images.
- Existing booking/contact forms and admin content settings were retained.

## Data-entry note
The archive did not contain verified CFS regular prices for each catalog item. The Admin system is ready for those values to be entered per product; no supplier prices were fabricated or guessed.

## Validation
- ZIP source archive passed integrity check before edits.
- TypeScript/TSX syntax transpilation check passed for App, Admin, ProductCatalog, ServicePages, main, and server.
- Full Vite production build and browser rendering were not verified because dependency installation timed out in this environment.
- Live 3D simulator behavior was not re-tested; its source component was preserved without edits.
