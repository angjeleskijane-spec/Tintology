# Tintology Studio V18 – Phase 1

Base: Tintology Studio V17.5.

## Changes
- Restored the archived car entries to the selectable model list (13 entries in source order).
- Added a per-model fixed-tint policy for Nissan GT-R R35, BMW M3 GTR GT2, Mercedes-Benz 190E, and Porsche 911 (1970s): only 30% and 95% are offered.
- Other models retain the existing five tint options (30%, 50%, 65%, 85%, 95%).
- Selecting a fixed-tint model normalizes an existing unsupported selection to 30%.
- Existing Sketchfab scene, Wrap catalog, material application, and booking flow were not intentionally changed.

## Validation status
- Source-level patch applied.
- Production build and live Sketchfab model loading have not yet been verified.
- Archived models are selectable in code, but each model still requires live loading and visual validation before being described as fully supported.
