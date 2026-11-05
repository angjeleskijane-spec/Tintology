# Tintology V17.4 — Glass target restoration

- Restores the V16-era generic glass fallback when a model exposes no explicitly named side/rear window materials.
- Keeps explicit front-windshield materials excluded from automatic tint targets.
- Restores the previously confirmed Ford Mustang glazing ID 7 as a rear/side target only.
- Keeps the single “Затемнување стакла” control and 30/50/65/85/95% options.
- Keeps Nissan calibration and the rest of V17.3 unchanged.
- Does not change Wrap simulator/catalog or other site features.

Validation: source-level patch and ZIP integrity only. No local TypeScript compiler or live Sketchfab/browser validation was available; generic shared glass materials can still require per-model visual confirmation.
