# Tintology v12 – Test report

Date: 2026-11-03

## Passed checks

| Check | Result | Detail |
|---|---|---|
| TSX/source transpilation | PASS | `CarStudio.tsx`, `App.tsx`, `ProductCatalog.tsx`, `Admin.tsx`, `siteContent.ts`, and `server.ts` transpiled with zero syntax diagnostics. |
| Model identifiers | PASS | 18 car entries; no duplicate model IDs. |
| Sketchfab identifiers | PASS | 18 car entries; no duplicate Sketchfab UIDs. |
| Tint progression | PASS | Computed tint brightness decreases monotonically for 12%, 50%, 65%, 85%, 95%. |
| Rear-zone fallback | PASS | Rear-only selection uses rear-side and rear-windshield groups; it does not fall back to all glass. |
| Old tint helper | PASS | No remaining calls to the replaced tint helper. |
| Chameleon price | SOURCE CHECK | One Chameleon option is priced at 5,000 MKD in the configurator. |
| Car retention | PASS | All 18 v11 car entries remain in the v12 source. |

## Tint scale calculation

The configured tint swatches are progressively darker:

- 12%: RGB 198, 210, 221 (lightest)
- 50%: RGB 132, 143, 154
- 65%: RGB 102, 112, 123
- 85%: RGB 61, 70, 81
- 95%: RGB 39, 48, 59 (darkest)

These RGB values are the tint overlay used by the simulator, not a laboratory measurement of real film VLT.

## Not verified in this environment

- `tsc --noEmit` cannot complete because `node_modules` is absent and the `vite/client` type package is unavailable.
- Vite production build was not run for the same dependency reason.
- Sketchfab live viewer and the 18 remote models were not reachable because DNS/network access to `static.sketchfab.com` failed in this environment.
- Real model material mapping, Chameleon appearance, windshield behavior, and wrap application still require a live browser test with Sketchfab access. The configurator includes a manual material-mapping fallback for models with unusual material names.
