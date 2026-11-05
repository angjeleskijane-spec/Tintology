# Tintology v15 – focused simulator and homepage changes

## Changes in this build
- Kept Porsche 911 (930) Turbo first and Porsche Cayenne Turbo GT second in the simulator model selector.
- Removed the rear tail-light tint control, related material mapping UI, and tint application logic.
- Preserved the Window Tint and Car Wrap services and the existing wrap catalog/selection flow.
- Hid the product catalog from the default homepage; it is rendered when the user selects Catalog from the desktop or mobile navigation.
- Replaced the yellow-car images for PRIME XR Black 88, PRIME CS Black 70 and PRIME CS Black 50 with product-line imagery.
- Retained V14's glass diagnostics and manual per-zone glass mapping rather than guessing model-specific Sketchfab material IDs.

## Verification limits
- Glass material IDs for the two Sketchfab models still require live browser inspection; no material IDs have been fabricated.
- Product image URLs for PRIME XR Black 88, PRIME CS Black 70 and PRIME CS Black 50 remain the existing image sources pending confirmation of replacement assets.
- Run dependency-backed TypeScript/Vite checks and live Sketchfab validation before treating this build as production-ready.
