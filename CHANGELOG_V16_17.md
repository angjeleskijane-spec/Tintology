# Tintology V16.17 – Huracán layered rear-glass calibration

- Based on the user's V16.16 ZIP.
- Scope limited to Lamborghini Huracán LP 610-4 glass material application.
- User's live diagnostic testing showed that each of `GlassClear`, `Window`, `GlassRed`, and `WindowDark` affects the same rear windshield and both rear quarter windows; front side glass is unaffected.
- Treat those four named materials as overlapping/layered rear glazing, not four independent window zones.
- `GlassClear` remains the single alpha/opacity carrier. The other three named layers retain their original opacity/alpha-mask channels and receive a restrained color blend only, reducing compounded opacity and matte/white appearance.
- No changes to front side glass behavior, other vehicle mappings, Wrap catalog, or Wrap behavior.

## Validation
- ZIP structure and source edits checked.
- Full Vite build and live Sketchfab visual validation were not available in this environment. The Huracán result must be visually checked in the user's browser before treating the calibration as confirmed.
