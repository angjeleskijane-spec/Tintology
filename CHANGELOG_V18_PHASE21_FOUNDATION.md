# Tintology V18 Phase 21 – Foundation pass

Base archive: `Tintology_Studio_V18_Phase20_Vehicle_Expansion_Stage1_23_Cars.zip`

## Applied
- Removed the six vehicle entries explicitly approved for deletion: Audi Q5 Quattro S-Line (2023), Audi A5 Sportback S-Line (2021), Audi A3 (2021) – Model 2, Mercedes-Benz E-Class AMG Line (2022), Fiat 500 Abarth, and Audi A3 Sedan (2022).
- Updated the selectable tint stops to 30%, 50%, 65%, 85%, and 95%.
- Re-keyed the former 12% calibration entries to 30%, retaining the prior lightest-stop values as the first-stop starting point. This does not claim physically accurate tint appearance; per-model visual calibration remains a later phase.
- Updated the simulator's explanatory Macedonian text to state that 30% is the lightest stop and 95% the darkest.
- Kept Mustang Improved's geometry, model identity, glass mapping, Wrap behavior, and unrelated settings unchanged; only the shared percentage scale/calibration key was changed.

## Important count discrepancy
The supplied Stage1 archive contained 23 active model definitions. Removing the six approved deletions leaves **17**, not 18. The previously approved keep-list included Audi A3 (2002), but that model is not present in the supplied archive. No replacement or unapproved model was invented or added. The current build therefore contains 17 models until the user supplies/approves the missing Audi A3 (2002) model.

## Not completed / requires live model diagnostics
Four Wrap problems remain intentionally unresolved in this foundation pass:
- Opel Grandland X (2019): mixed body colors.
- Opel Insignia Grand Sport (2020): Wrap does not apply.
- Citroën C3 (2020): mixed body colors.
- Fiat 500F (1965): Wrap does not apply.

The current source classifies body targets from Sketchfab material names and available manual mappings. The archive contains no verified per-model body-material IDs for these four models. Guessing IDs or applying a broad fallback risks coloring glass, trim, wheels, or interior. These four fixes need each model's actual Sketchfab material list/diagnostic output before a safe targeted mapping can be made.

## Validation
- Original ZIP archive integrity: passed before editing.
- Source-level model count after pruning: 17.
- Approved deleted IDs: absent from the active source model catalogue/order.
- Selectable tint stops: exactly `[30, 50, 65, 85, 95]`.
- No 12% user-facing option or 12-key tint-stop calibration remains in `src/CarStudio.tsx`.
- Build/lint: not run successfully; dependency installation timed out in this environment. No live browser/Sketchfab visual test was performed.
