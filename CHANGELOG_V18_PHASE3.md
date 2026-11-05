# Tintology Studio V18 – Phase 3

Base: V18 Phase 2 (derived from V17.5).

## Changes
- Reworked the simulator control panel so Tint and Wrap controls are visible together for the same selected 3D vehicle.
- Updated the render effect to re-apply both glass tint and body Wrap after material restoration, independently of which control section was last used; this is intended to allow both effects to remain visible simultaneously.
- The most recently interacted section becomes the active application/booking mode; existing service state is retained.
- Added a public “Фолии за објекти” section and desktop/mobile navigation links.
- Added ALU 80XC Silver Stop-Sol overview and the user-specified 65%, 85%, 95% reflection choices. These are explicitly labelled as reflection, not VLT/transmission.
- Added cautious suitability note for glazing compatibility and thermal stress, and a quote CTA.

## Preserved
- Existing vehicle list and fixed 30% / 95% policy for the four configured fixed-tint models.
- Existing Wrap catalog and product data.
- Existing Sketchfab scene and diagnostic panel.

## Not verified
- `npm install` timed out in this environment; dependencies are not installed.
- Vite production build and TypeScript checks were therefore not run.
- Live Sketchfab visual behavior, camera capture and physical accuracy of product specifications require browser/model and manufacturer verification.
- Architectural reflection percentages are presented as options per the user's instruction; exact product SKU mapping/spec sheets must be confirmed before publishing technical claims.
