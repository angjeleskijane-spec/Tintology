# Tintology V16 – test report

- ZIP source: `Tintology_Studio_Detailed_Window_Tint_v15.zip`.
- ZIP extraction and archive integrity: PASS.
- Requested V16 catalog and simulator edits from the V15-based build retained.
- User-provided Sketchfab diagnostics applied for Porsche 911 (930) Turbo: only `glass` / stateSetID 7 is mapped as glass.
- `930_lights_refraction` ID 12, `coat` ID 10, `paint` ID 9, and all other materials are excluded from the Porsche 930 glass mapping.
- Confirmed glass ID 7 is excluded from Car Wrap/body targets.
- TSX syntax transpilation: PASS for `CarStudio.tsx` and `ProductCatalog.tsx`.
- Full `tsc`/Vite build: NOT RUN; project dependencies are not installed in this environment.
- Live Sketchfab/browser validation: NOT RUN. The model's live response and whether glass ID 7 is shared across all window panes must still be confirmed in the running simulator.


## V16.2 validation
- Diagnostic glass list uses filtered glass targets, not the full Sketchfab material list: PASS (source inspection).
- Diagnostic body/Wrap list uses filtered body targets, not the full Sketchfab material list: PASS (source inspection).
- Confirmed Porsche 930 `glass` ID 7 is the authoritative all-glass target and is not merged with generic glass-name matches: PASS (source inspection).
- Darkness levels 12/50/65/85/95 remain available; source calculation is monotonic from lightest to darkest and leaves original opacity untouched: PASS (source inspection).
- `CarStudio.tsx` TSX transpilation: PASS.
- ZIP archive integrity: PASS.
- Full TypeScript/Vite build and live Sketchfab/browser test: NOT RUN. Confirm actual tint response and verify that ID 7 affects only glazing in the live viewer before treating the original runtime issue as fully resolved.


## V16.3 source validation
- Diagnostic counters now use the simulator's resolved glass/body target lists rather than only generic name classification: PASS (source inspection).
- Porsche 911 (930) `glass` stateSetID 7 is counted as one glass target by the same resolver used for tint application: PASS (logic inspection).
- Live Sketchfab visual validation remains NOT RUN; this environment cannot confirm the rendered result or whether the model material is shared across multiple panes.
