# Tintology Studio V16.15 — Model-specific tint calibration safeguards

Based on V16.14.

## Changes
- Preserved the Ford Mustang (Improved) calibration unchanged as the reference model.
- Added a Nissan GT-R R35-specific lighter/less white tint blend for 12–85%; retained its existing 100% setting unchanged.
- Added an Audi A4 (B5)-specific scale: the former 85% appearance is assigned to 65%, the former near-black 95%-equivalent appearance to 85%, and 100% is made darker. The 12% and 50% stops remain ordered as lighter steps.
- Expanded the glass-material exclusion rules for headlamps, taillamps, brake/stop lights, indicators, turn signals, and fog lamps. This prevents these materials from being selected as window glass when their names identify them as lighting components.
- Preserved the V16.14 behavior that reapplies window tint while Wrap is active and colors/finishes are changed.
- No changes to Wrap catalog, products, pricing, car list, or site design.

## Asset-specific mappings still requiring live diagnostics
- Lamborghini Huracán LP 610-4: exact material/stateSetID mapping for front side glass, quarter windows, and rear windshield is not present in the supplied V16.14 project. No guessed IDs were added.
- Škoda Octavia (2005): light-material name exclusions are strengthened, but exact glass stateSetIDs and the source asset's opacity behavior still require live diagnostics.
- Nissan GT-R R35 and Audi A4 (B5): tint curves are adjusted in source; visual appearance still requires live Sketchfab validation.

## Validation limits
- Source edits and ZIP integrity checked.
- Production build was not completed: dependency installation did not finish in this environment.
- No live Sketchfab viewer session was available; visual material mapping and transparency remain unverified.
