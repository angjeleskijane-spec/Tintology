# Tintology Studio V16.19 — Audi A4 Black Glass Calibration

- Focused change: Audi A4 (B5) glass tint calibration only.
- 50% and 65% use much darker albedo blending to suppress the pale/white source-glass appearance and make black tint dominate.
- 85% is calibrated to the previous 100%-equivalent near-black appearance.
- 100% is a deeper near-black maximum than 85%.
- Audi glass roughness is reduced to 0.12 to avoid a chalky/matte surface.
- The tint opacity ceiling is raised to 0.99 so Audi 100% can reach the intended maximum.
- Other vehicle calibration, Mustang, Wrap catalog, and Wrap behavior are unchanged.
- Huracán remains excluded from the active vehicle selector; its source entry is retained in the archive list.

Validation: ZIP integrity checked. A full Vite build was not run because dependencies (`node_modules`) are not present in this working environment. Live Sketchfab appearance requires user-side validation.
