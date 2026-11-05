# Tintology V16 – changes

Base: `Tintology_Studio_Detailed_Window_Tint_v15.zip`.

## Confirmed changes
- Removed the simulator option `Предно ветробранско`.
- Removed the simulator option `TIF – заден дел`.
- Kept the other window-tint zones, including `Предни две стакла`, `Заден дел`, and `Сите стакла`.
- Kept the Wrap simulator and its product/colour data.
- Restricted the customer-facing product catalog to Wrap products only. Automotive window-tint films, PPF and architectural films are no longer displayed in the catalog. The Wrap catalog remains accessible through the existing navigation.
- Versioned the manual glass mapping storage key to V16 so stale mappings from earlier versions (including incorrectly selected door-sill IDs) are not automatically reused.
- Tightened automatic glass classification to explicit window/glazing material names and excluded names indicating sills, thresholds, rocker panels, trim, seals, bodywork, and other non-glass parts.
- Removed generic `glass` fallback matching for `all` windows; the all-glass target list is built only from explicitly identified window zones and valid manual selections.
- Prevented duplicate material IDs from being tinted repeatedly across zones; the currently selected zone takes priority if a model reuses a material ID across zones.

## Validation limitations
- TSX syntax transpilation passed for `src/CarStudio.tsx` and `src/ProductCatalog.tsx`.
- Full TypeScript/Vite build could not be run because dependencies were not installed in the execution environment (installation timed out; `vite` is unavailable).
- Live Sketchfab material validation was not performed. The material list and mesh/material sharing are only available when the model loads in a browser with an active internet connection. Therefore the glass-only behavior must still be confirmed against the Porsche models in the live simulator before claiming the original glass-detection issue is fully resolved.

## V16.1 – Porsche 911 (930) confirmed glass material mapping
- Added a model-specific Sketchfab glass mapping for Lionsharp Studios Porsche 911 (930) Turbo.
- Uses only the exact material named `glass` with `stateSetID` 7, as supplied by the user's live Sketchfab diagnostics.
- Does not tint `930_lights_refraction` (ID 12), `coat` (ID 10), `paint` (ID 9), or any other material.
- Explicitly prevents the confirmed glass ID from being used as a Car Wrap/body target.
- This is a material-level mapping. If Sketchfab uses the same material for all window panes, the API may not support independent per-pane tinting until the model exposes separate glass materials/meshes.


## V16.2 – role-specific material lists and tint percentage controls
- The `Материјали за стакла` diagnostic panel now lists only glass targets confirmed for the selected model (plus that model's safe saved glass selections); it no longer repeats the complete Sketchfab material list.
- The `Материјали за каросерија` panel now lists only current body/Wrap targets; glass/window materials and the confirmed Porsche 930 glass ID 7 are excluded.
- For Porsche 911 (930), the model-specific `glass` ID 7 mapping is authoritative for `Сите стакла`; it is no longer mixed with generic name matches or other saved IDs.
- Kept the five requested darkness levels: 12%, 50%, 65%, 85%, and 95% (12% lightest, 95% darkest). The existing material tint calculation changes the material colour while preserving its original opacity/transparency channel.
- No unrelated site, Wrap catalogue, or simulator options were intentionally changed.


## V16.3 – diagnostic target count correction
- Corrected the `Стакла` diagnostic counter to count the exact glass targets returned by the same resolver used by the tint application, including confirmed model-specific IDs.
- Corrected the `Каросерија` counter to count the actual body/Wrap targets used by the simulator.
- This prevents the Porsche 911 (930) confirmed glass material ID 7 from appearing as zero merely because its material name is generic and handled by an authoritative model-specific mapping.
- No new fallback materials or unrelated mesh targets were introduced.

## V16.4 – BMW 3 Series E90 sedan as primary glass-mapping test model
- Added the Sketchfab BMW 3 Series E90 (2004–2012) sedan model by Merc_TV (CC BY) as the first active simulator model.
- Set BMW 3 Series E90 as the default selected vehicle when opening the simulator.
- Retained Porsche 911 (930) and Cayenne as selectable models; their existing behavior and model-specific Porsche glass mapping remain intact.
- No guessed BMW material IDs were added. BMW glass targets must be confirmed from the live Sketchfab material list and mapped by exact material/mesh evidence; no fallback to door sills or body panels is permitted.
