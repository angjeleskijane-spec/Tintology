# Tintology V16.12 — Glass Transparency & Material Preservation

Based on V16.11. This update targets the reported matte/plastic-looking glazing.

- Fixed the opacity logic: V16.11 used `Math.max(originalOpacity, targetOpacity)`, which left materials with original opacity `1` fully opaque. V16.12 applies the calibrated opacity factor directly while retaining the rest of the original Opacity channel properties.
- Creates/enables the Opacity channel when a target glass material does not expose one, while preserving AlphaMask and other source channels.
- Reduced the tint-color blend so original glass shading, texture and highlights are not flattened into a solid color.
- Retains the five tint stops: 12, 50, 65, 85, 95. The opacity curve moves from lighter/more transparent to darker/less transparent, while retaining some transparency at 95.
- No changes to active car list, Wrap logic, Wrap catalog, product catalog, or homepage.

## Validation status

- Source-level inspection confirms the old `Math.max(oldOpacity, options.opacity)` behavior is removed.
- Static checks and archive integrity are performed during packaging.
- Live Sketchfab rendering/material validation is not available in this environment; user testing is still required on all five approved cars.
