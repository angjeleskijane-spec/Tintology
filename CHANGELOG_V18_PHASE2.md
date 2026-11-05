# Tintology Studio V18 – Phase 2

Base: V18 Phase 1 (based on V17.5).

## Changes
- Added a Sketchfab Viewer API screenshot action at 1920×1080, with status feedback and a PNG download name based on the selected vehicle. The action reports when the loaded Viewer API does not expose `getScreenShot` or when capture fails.
- Normalized wrap variants identified as black to pure `#000000` in the simulator and stopped blending the original material color into those black selections. Non-black wrap behavior is unchanged.
- Updated Tintology AI server instructions to remove obsolete TIF rear-section and tail-light-tint offers and to reflect the simulator's current tint stops and fixed 30%/95% model policy.

## Preserved
- V18 Phase 1 model list and per-model tint policy.
- Existing Sketchfab viewer, material classification/mapping, Wrap catalog, finish options, and booking flow.

## Validation status
- Source changes applied.
- Dependency installation was attempted but timed out; no `node_modules` directory was created, so production build/type-check could not be run in this environment.
- Screenshot behavior requires a live Sketchfab session to validate; the code handles unsupported API and capture errors without claiming success.
- Black-wrap appearance still requires visual validation against several live vehicle models because each model may expose different body materials.
