# V16.10 Source Validation Report

## Confirmed in source
- Active simulator dropdown is restricted to the five user-approved cars: Ford Mustang (Improved), Nissan GT-R R35, Lamborghini Huracán LP 610-4, Škoda Octavia (2005), and Audi A4 (B5).
- Tint controls now offer 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, and 100%.
- UI labels 10% as lightest and 100% as darkest and clarifies that this is a simulator darkness scale, not physical VLT.
- Standard tint now uses a neutral grey-to-near-black curve and writes the calibrated tint color directly rather than mixing it with a bright source albedo.
- Original opacity and alpha-mask channels remain preserved; Wrap and catalog source files were not changed.

## Validation limits
- TypeScript/JSX transpilation syntax check: passed (0 syntactic diagnostics).
- ZIP integrity: checked after packaging.
- Full dependency-based production build: not run because dependencies are not installed in this environment.
- Live Sketchfab visual behavior: not tested here. The user must verify appearance on all five models, especially 10%, 50%, and 100%.
