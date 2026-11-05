# Tintology – Window Tint Update (v12)

## Window tint changes
- Reworked the visual tint scale so the user's scale is respected: 12% is the lightest setting and 95% is the darkest.
- The five available settings remain 12%, 50%, 65%, 85%, and 95%, with a stronger visual difference between each step.
- Tint is applied as a blend over the material's existing color instead of replacing the color channel outright.
- The original glass opacity is preserved. The simulator no longer increases opacity as a shortcut for making glass look darker.
- Chameleon is now a distinct blue/purple reflective-style material treatment, separate from ordinary percentage tint.
- Chameleon remains one option at 5,000 MKD. XPEL XR 88 remains 3,000 MKD; XPEL CS 70 remains quote-based.

## Glass-zone recognition
- Expanded recognition patterns for front side windows, rear side windows, quarter glass, front windshield, and rear windshield.
- Rear section includes recognized rear side glass (including quarter glass) plus rear windshield.
- Rear-only selection never silently falls back to all glass.
- Manual material mapping remains available when a model uses unnamed or unusual material names.
- The simulator warns when the selected zone has no detected material instead of changing an unrelated area.
- The all-glass option continues to include the front windshield, which can be configured separately with percentage tint, Chameleon, XR 88, or CS 70.

## Preserved
- No car models were removed.
- Porsche 911 (930) Turbo remains the preferred reference model.
- Wrap catalog, Light Tint options, pricing structure, and overall page design were not intentionally redesigned.

## Validation
- TypeScript/TSX transpilation and syntax checks passed for all six application source files.
- Automated source checks passed for 18 unique car model IDs and 18 unique Sketchfab UIDs.
- Automated checks passed for removal of the old tint helper and for the rear-zone no-fallback rule.
- The calculated tint values are strictly darker in order from 12% through 95%.
- Full project type-check and Vite production build were not completed: project dependencies are not installed in this environment (`vite/client` is unavailable).
- Live Sketchfab model/material behavior could not be tested from this environment because external DNS/network access to Sketchfab is unavailable. Each model must still be visually verified in a browser with internet access; material naming differs by model.
