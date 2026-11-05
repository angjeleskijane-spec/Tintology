# Tintology V16.9 – Five Verified Cars & Glass Tint Calibration

Based on V16.8 V10 Simulator Restore.

## Changes
- Active simulator selection is limited to the five cars the user confirmed work in both Tint and Wrap: Ford Mustang (Improved), Nissan GT-R R35, Lamborghini Huracán LP 610-4, Škoda Octavia (2005), and Audi A4 (B5).
- Ford Mustang is selected by default as the known-good reference model.
- Calibrated one shared Tint color curve for the five active models: 12% remains the lightest setting but starts from a neutral smoke-grey rather than a near-white color; higher settings progress more strongly toward dark charcoal.
- Preserved original opacity and alpha-mask channels during tinting.
- Kept Wrap material handling, product catalog, and site layout unchanged.
- Other car model definitions remain in the source archive but are not selectable in this version.

## Validation
- CarStudio.tsx TypeScript/JSX transpile syntax check passed.
- Full Vite production build was not run because project dependencies are not installed in this environment.
- Live Sketchfab behavior still requires user-side testing in the browser.
