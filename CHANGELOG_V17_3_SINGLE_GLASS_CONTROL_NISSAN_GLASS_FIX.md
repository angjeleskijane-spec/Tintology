# Tintology V17.3 — Single Glass Control + Nissan GT-R Glass Tuning

- Removed the separate front-windshield tint zone and manual windshield mapping UI.
- One control remains: “Затемнување стакла” with 30%, 50%, 65%, 85%, 95%.
- Front-windshield-named materials are excluded from tint targets for every vehicle.
- Automatic tinting now requires explicitly named side/rear glass materials. Generic shared `glass` / `windows` materials are not auto-tinted because they may include the front windshield; they can be selected manually in Diagnostics after visual confirmation.
- Nissan GT-R receives a dedicated charcoal-glass calibration to reduce the pale/white plastic appearance while preserving original material maps.
- Wrap code, catalog files, model list, and Audi A4 calibration are otherwise preserved.

Validation: archive integrity and static source checks only. No live Sketchfab browser test was available; Nissan material selection and visual result still require in-browser confirmation.
