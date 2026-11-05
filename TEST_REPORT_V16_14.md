# V16.14 validation report

- Confirmed V16.13 source used as the base.
- Confirmed glass/body classification is no longer conditional on the active Windows/Wrap tab.
- Confirmed the material update effect restores original materials, reapplies selected glass tint on every update, then applies wrap to body targets only when Wrap is selected.
- Confirmed the existing five-model allowlist and 12/50/65/85/100 scale are unchanged.
- ZIP archive integrity checked.
- Not tested: `npm run build`, TypeScript lint, live Sketchfab rendering, and visual material matching on Nissan GT-R R35, Lamborghini Huracán LP 610-4, Škoda Octavia (2005), Audi A4 (B5). Dependencies were not installed and the live Sketchfab models were not available for interactive validation in this environment.
