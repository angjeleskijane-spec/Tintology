# Tintology Studio V16.14 — Multi-model glass calibration and persistent tint

Based on V16.13.

## Changes
- Kept the V16.13 glass tint curve and glass-material treatment as the shared calibration for the five approved vehicles.
- Material classification now discovers glass and exterior body materials independently of the active configurator tab.
- The selected window tint is reapplied after source materials are restored, including while the Wrap tab is active.
- Changing Wrap color or finish now reapplies the body wrap while retaining the current window tint settings.
- Wrap remains restricted to positively identified exterior body-paint materials; glass is still excluded from body targets.
- No vehicle list, tint percentage options, Wrap products/catalog, pricing, or site design changes.

## Validation
- Source-level inspection completed.
- ZIP integrity checked after packaging.
- Production build and live Sketchfab validation were not run because project dependencies are not installed in this environment. The four non-Mustang models still require visual confirmation in the user's live viewer because their asset-specific glass material names/mappings have not been independently confirmed here.
