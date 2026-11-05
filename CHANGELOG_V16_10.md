# Tintology V16.10 — Tint Scale & Neutral Glass Calibration

- Replaced the old 12/50/65/85/95 controls with a 10–100% darkness scale in 10% increments.
- Clarified in the simulator UI that this is a visual darkness scale, not physical VLT.
- Recalibrated the shared standard-tint curve from neutral smoke grey at 10% to near-black at 100%.
- Removed the bright source-albedo blend for standard tint so white base color no longer washes out the applied grey tint.
- Preserved original opacity and alpha-mask channels, glass-zone detection, Wrap code, catalog, and the five approved models.

## Validation
- Source-level checks and archive integrity checks performed.
- Production build and live Sketchfab visual behavior have not been validated in this environment; please verify the 10%, 50%, and 100% appearances on all five cars.
