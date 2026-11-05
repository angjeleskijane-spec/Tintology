# Tintology V16.7 – verification report

## Passed
- TypeScript/TSX syntax transpilation: 6 source files checked, 0 syntax diagnostics.
- Static checks confirm the simulator offers only TINT and WRAP.
- Static checks confirm only `Заден дел` and `Сите стакла` are selectable Tint zones.
- Static checks confirm the front windshield is excluded from the Tint UI and booking summary.
- Static checks confirm Tesla Model 3, Toyota Supra MK4, Mazda RX-7 (both listed variants), Jeep Wrangler, and BMW 3 Series E90 are not in the selectable model list.
- Tint and Wrap material classification are mode-specific. The inactive mode's targets are not resolved for application or shown in the diagnostics list.
- Wrap target selection uses explicit body/paint names with exclusions for glass, windows, sills, thresholds, trim, seals, wheels, lamps, mirrors and interior parts; no broad fallback is used.
- `src/App.tsx` and `src/ProductCatalog.tsx` SHA-256 hashes match the V16.6 baseline, confirming these files were not changed.
- ZIP archive integrity check passed.

## Not verified in this environment
- Full TypeScript typecheck and Vite production build: dependencies were not available; `npm install --legacy-peer-deps` timed out.
- Live Sketchfab model/material validation: not performed. The actual material/mesh assignments must still be checked in the browser with an internet connection. If a model shares one material between the front windshield and other panes, that material is deliberately not auto-mapped because the windshield must remain untinted.
