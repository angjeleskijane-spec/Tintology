# Tintology V16.7 – simulator menu and strict material separation

Base: `Tintology_Studio_Detailed_Window_Tint_v16_6_front_windshield.zip`.

## Changes
- Simulator main menu now exposes only `TINT` and `WRAP`. The separate `LIGHT TINT` mode is not present.
- Tint zones are limited to `Заден дел` and `Сите стакла`.
- `Сите стакла` targets identified side windows and rear glazing only; the front windshield is excluded from automatic classification, selection, tint application, and booking summary.
- Front windshield tint controls and price add-ons were removed from the simulator UI and booking logic.
- Tint and Wrap target resolvers are separated. Tint mode resolves only safe glass candidates; Wrap mode resolves only explicit body/paint candidates. No cross-mode fallback is used.
- Diagnostics and manual mapping display only the material family relevant to the active mode. Body candidate filtering excludes glass, windows, sills, thresholds, trim, seals, wheels, lamps, mirrors, and interior parts.
- A shared generic glass material is not assumed to be safe for windshield-excluded tinting. Models without independently identifiable side/rear glass show the existing warning rather than tinting an uncertain material.
- Removed Tesla Model 3, Toyota Supra MK4, Mazda RX-7 (both listed variants), Jeep Wrangler, and BMW 3 Series E90 from the available model list. The default vehicle is Porsche Cayenne Turbo GT.
- Preserved Wrap products, colours, finishes, and the existing website/catalog content.

## Validation
- TSX syntax transpilation is checked separately with the globally available TypeScript compiler API.
- Full project typecheck and Vite build require project dependencies. `npm install --legacy-peer-deps` timed out in this environment, so a full build is not claimed.
- Live Sketchfab validation is still required to verify each model's material/mesh separation in the browser.
