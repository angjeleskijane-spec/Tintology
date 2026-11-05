# Tintology V16.8 – Restore proven V10 simulator updates

## Changes
- Used V10's direct Sketchfab `setMaterial()` update flow for tint and wrap. Removed the serial callback queue that had been introduced in later revisions.
- Restored the V10 window tint color/opacity behavior while retaining the current V16 rear/all-glass controls and darkness scale (12% lightest, 95% darkest).
- Added the Mustang (Improved) material mapping from the user's confirmed working V10 diagnostics: `080814MSCL_windows`, stateSetID 7. It is used only by Window Tint (`rear` and `all`) and excluded from Wrap targets.
- Restored Sketchfab `camera: 0` setting used by V10. The iframe/container markup is unchanged from V10; rotation still requires live browser verification.
- Kept V16 site layout, product catalog, wrap catalog, current model list and existing service UI.

## Validation
- TypeScript/JSX transpilation of `src/CarStudio.tsx`: passed with zero transpilation diagnostics.
- Full Vite production build: not run; dependency installation did not complete in the available execution window.
- Live Sketchfab interaction (Mustang tint, wrap, 360° drag) has not been tested in a browser. Do not treat this archive as live-verified until tested locally.
