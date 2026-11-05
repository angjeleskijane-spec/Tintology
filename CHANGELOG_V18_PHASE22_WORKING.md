# Tintology Phase22 – simulator calibration

Base: V18 Phase21 Foundation (17 active vehicle definitions).

## Applied in the working branch
- Kept the approved tint choices at 30%, 50%, 65%, 85%, and 95%; no 12% option was reintroduced.
- Mercedes-Benz G-Class AMG G 63 (2025): former 95% appearance is now the 65% anchor; recalibrated 30/50/85/95 around that anchor.
- Volkswagen Golf GTI MK2 (1992): former 95% appearance is now the 65% anchor; recalibrated 30/50/85/95 around that anchor.
- Audi RS6 Avant (2020): former 95% appearance is now the 65% anchor; recalibrated 30/50/85/95 around that anchor.
- Volkswagen Passat Pro 380TSI (2025): former 95% appearance is now the 85% anchor; recalibrated 30/50/65/95 around that anchor.
- Nissan GT-R R35 is forced to an effective 95% tint and its percentage buttons are replaced with a fixed-95% notice. Wrap remains available.
- Ford Mustang (Improved), Audi A4 (B5), Porsche 911 (930) Turbo, and Lamborghini Huracán LP 610-4 remain unchanged.

## Still pending / must not be guessed
- Permanently deleted the Opel Astra model definition and Sketchfab reference from the simulator code; it is not retained in the archive. Reason: the linked model's license could not be verified and no confirmed glass-material mapping exists.
- Permanently deleted the Fiat 500F model definition and Sketchfab reference from the simulator code; it is not retained in the archive. Reason: the linked Sketchfab model is explicitly CC BY-NC-SA (non-commercial), unsuitable for Tintology's commercial website without separate permission.
- Active vehicle selector now contains 11 approved models after removing every Opel and Fiat model; Citroën C3 (2020) and Audi S3 (2007) remain.
- Live Sketchfab visual verification for the four new calibration curves has not been performed.
- TypeScript/build validation and ready-to-run ZIP packaging have not yet been confirmed. A GitHub Actions build/package workflow has been added, but no workflow run has appeared yet.


- Permanently removed the Fiat Tipo 5-Door (2021), Opel Corsa GSi (2019), Opel Insignia Grand Sport (2020), and Opel Grandland X (2019) model definitions and selector entries at the user's clarification to remove all Fiat and Opel vehicles.
- Together with the earlier permanent removal of Opel Astra and Fiat 500F, no Opel or Fiat model remains in the simulator's archived model definitions or active selector. Citroën C3 is retained.
- Final approved active list: Ford Mustang (Improved), Nissan GT-R R35, Audi A4 (B5), Porsche 911 (930) Turbo, Lamborghini Huracán LP 610-4, Audi RS6 Avant (2020), Mercedes-Benz G-Class AMG G 63 (2025), Volkswagen Golf GTI MK2 (1992), Volkswagen Passat Pro 380TSI (2025), Citroën C3 (2020), and Audi S3 (2007).

## Safety
No broad automatic material fallback was added. Do not guess glass or body material IDs; inspect the actual model material list before adding per-model mappings.
