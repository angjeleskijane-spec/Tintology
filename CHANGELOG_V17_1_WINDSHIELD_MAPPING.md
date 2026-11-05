# Tintology V17.1 – Front windshield mapping

- Added a Sketchfab 3D node-picking workflow for the front windshield.
- The operator activates windshield selection and clicks the actual windshield surface in the 3D viewer.
- The selected node receives a cloned copy of an existing side/rear glazing material via Sketchfab `createMaterial` + `assignMaterial`; no unrelated fallback material is used.
- The cloned material is then controlled by the existing independent windshield VLT slider.
- The selected node ID is saved per vehicle in local storage and the material is recreated/reassigned when the model is loaded again.
- Existing combined side/rear tint, Wrap configurator, catalog, and pricing location remain unchanged.

## Validation notes

- ZIP integrity is checked after packaging.
- TypeScript parser check reports only unresolved imports because dependencies could not be installed in this environment; no syntax diagnostics were reported for `CarStudio.tsx`.
- Live Sketchfab model interaction still requires browser validation with the selected model loaded and the windshield surface clicked.
