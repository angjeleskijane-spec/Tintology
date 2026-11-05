# Tintology v14 – Simulator stabilization

## Changes in this build
- The simulator's main service selector now contains only **Window Tint** and **Car Wrap**.
- Added the single **„Затемни стоп-светла“** checkbox. It applies only to materials identified as rear tail lamps and is independent of Window Tint / Car Wrap; turning it off restores the original material state.
- Removed the separate Light Tint service and all front-headlight tint controls.
- Tightened automatic rear-lamp matching to avoid reverse lamps, reflectors, indicators, turn signals and fog lamps.
- Added model-specific manual rear-lamp mapping and persistent storage.
- Expanded the material diagnostics panel to show every Sketchfab material name, state-set ID and available channel names.
- Manual glass mappings now take precedence over automatic name matching for that selected zone, preventing extra automatically matched materials from being tinted after an explicit mapping is made.
- Explicit “All Windows” selection now applies to the model's general glass set and saved manual glass selections.
- Kept the two visible test models: Porsche 911 (930) Turbo and Porsche Cayenne Turbo GT. Other model definitions remain archived.
- Kept the user's darkness scale: 12% lightest, 95% darkest.

## Important verification limits
- The Sketchfab models were not live-loaded in a browser during this build. Their runtime material names/IDs have not been independently verified here.
- The new diagnostics panel is intended to expose those exact names/IDs in the browser so the correct glass and rear-lamp materials can be mapped per model without guessing.
- A TypeScript/JSX transpilation syntax check passed. A full dependency-backed Vite build and live Sketchfab interaction test were not run.
