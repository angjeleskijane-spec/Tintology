# Tintology V16.7.3 – Tint material application repair

- Fixed material updates being sent without waiting for Sketchfab callbacks. Original materials are restored in sequence before the active Tint or Wrap changes are applied, preventing a late reset from overwriting the visible result.
- Added a per-run guard so an old Tint/Wrap update queue stops when the user changes mode or settings. This prevents stale operations from continuing across the Tint/Wrap boundary.
- Tint now creates/enables an `AlbedoPBR` color channel when a model exposes no supported color channel, while preserving the original `Opacity` and `AlphaMask` channels.
- Added named but unclassified glass candidates to the manual glass mapping checklist. These candidates are not automatically tinted; the user must explicitly map them to a zone.
- Preserved the V16.7.2 camera setting (`camera: 1`), vehicle list, Tint choices, Wrap mode, catalog, and site content.

## Validation
- TypeScript TSX transpilation of `src/CarStudio.tsx`: 0 syntax diagnostics.
- ZIP archive integrity checked after packaging.
- Full dependency install / Vite production build not run: npm offline cache does not contain required packages.
- Live Sketchfab rendering and real vehicle material changes not testable in this environment; those still require a browser with internet access.
