# Tintology v14 – Test report

- Source base: `Tintology_Studio_Detailed_Window_Tint_v13.zip`
- Updated source: `src/CarStudio.tsx`
- ZIP integrity: to be checked after packaging.
- TypeScript/JSX transpilation syntax check: PASS (0 diagnostics).
- Full `tsc --noEmit`: NOT RUN (project dependencies are not installed in this environment).
- Vite production build: NOT RUN.
- Live Sketchfab browser test: NOT RUN; model material IDs/names require runtime inspection.
- Safety behavior in code: no fallback from a rear-glass zone to all glass; no fallback from rear tail lights to front headlights or other lamps.
