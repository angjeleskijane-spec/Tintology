# Tintology Studio V18 – Phase 10: POLETO Service Visuals & Language Selector

Base: `Tintology_Studio_V18_Phase9_Auto_Glass_Images_Headings.zip`.

## Changes
- Added the three user-approved POLETO generated visuals as optimized local WebP assets:
  - Kameleon windshield film / Sky Blue display.
  - PVC tail-light tinting.
  - Windshield chip repair.
- Added POLETO branding labels to the three corresponding service cards.
- Kept the exact requested Kameleon options: XR88, Sky Blue and Sky Blue Dark, with the existing compliance/specification note.
- Kept the exact windshield chip-repair description (up to approximately 3 cm; every chip inspected before intervention).
- Removed the displayed one-tail-light and both-tail-lights prices from the public POLETO PVC service card. Existing internal/admin price data was not changed.
- Reordered the architectural gallery heading to: “Фолии за објекти” → “Tintology · Архитектонски фолии” → “Решенија за секој тип објект”.
- Added Macedonian / Albanian / English language selectors for desktop and mobile, with initial translations for the navigation, hero area, selected major section headings and the three POLETO cards.
- Sets the document language attribute when the selector changes.

## Preserved
- V18 Phase 9 site and simulator source as the base.
- Existing catalog, Wrap catalog, vehicle models, booking flow, admin data and other site sections.
- Existing price values in internal site configuration; only public PVC service-card price display was removed.

## Validation
- ZIP source integrity from Phase 9 was verified before editing.
- TypeScript/TSX syntax transpilation passed for App.tsx, CarStudio.tsx, ProductCatalog.tsx, Admin.tsx, siteContent.ts and server.ts.
- Full dependency installation timed out; therefore Vite production build and full project type-check were not completed.
- Browser layout, responsive rendering and live Sketchfab model behavior have not been visually tested in this environment.
- The language selector is an initial translation layer; untranslated content elsewhere in the site remains Macedonian and requires a complete translation pass before multilingual support can be called finished.
