# Tintology V17 – Simplified Glass Tint Simulator

Base: Tintology Studio V16.23.

## Simulator changes
- Replaced separate front-side and rear-side selections with one combined control for all recognized side and rear glazing.
- Kept the front windshield as a separate tint zone with its own percentage selection.
- Simplified the customer-facing tint percentages to 30%, 50%, 65%, 85%, and 95%; removed 12%, 35%, and 100% from the selector.
- Updated the tint calibration stops to use the new five percentage values while retaining the Audi A4 and Nissan GT-R model-specific visual calibration curves.
- Removed film-package selection from the simulator.
- Removed price display and price calculation from the simulator and booking payload. Prices remain in the website price list/catalog.
- Kept glass tinting restricted to recognized glass materials; front windshield materials are excluded from the combined side/rear zone.

## Preserved
- V16.23 website structure, vehicle selector, Wrap simulator, Wrap catalog, and existing assets.
- Škoda Octavia remains absent from the active vehicle selector; its archived model metadata/assets are retained.

## Validation note
- ZIP archive integrity and source-level checks are performed for this build.
- Sketchfab model rendering and per-model material behavior still require live browser testing with an internet connection; code changes alone do not certify every 3D model's glass mapping.
