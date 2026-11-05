# Tintology V17.2 – Nissan GT-R Audi Glass Calibration Experiment

- Used Audi A4 (B5) as the reference for the Nissan GT-R R35 window-tint response.
- Matched the five tint stops (30%, 50%, 65%, 85%, 95%), blend response, glossy roughness, and non-metallic glass tuning.
- Preserved the Nissan model's own geometry and texture maps; this is a material-response calibration, not a literal cross-model mesh/material copy.
- No other vehicle calibration, Wrap catalog, Wrap simulator, or site content was intentionally changed.

## Validation
- Source-level patch applied to `src/CarStudio.tsx`.
- Full browser/Sketchfab validation was not available in this environment. Test the Nissan GT-R in the running site before applying the same calibration to other models.
