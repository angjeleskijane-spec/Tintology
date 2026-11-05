# Test report — V16.12

Changes checked:
- Opacity target is no longer clamped upward to the source opacity; the target factor is assigned directly within 0.18–0.92.
- Existing Opacity channel fields are retained; an Opacity channel is created if absent.
- Original albedo channel properties (including any source texture references) are retained by object spread; tint blending is reduced and capped at 0.82.
- Tint presets remain 12, 50, 65, 85, 95.
- Active car presets and Wrap/catalog source files were not modified.

Not performed:
- Live Sketchfab viewer validation on actual model assets.
- Visual confirmation of transparency/reflections under the user's browser/GPU/lighting.

Please test the five tint stops on Mustang first, then the other four approved cars. In particular, verify that 12% is visibly transparent and 95% is near-black but not a flat opaque patch.
