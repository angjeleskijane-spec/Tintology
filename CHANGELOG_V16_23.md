# Tintology V16.23

- Temporarily removed Škoda Octavia (2005) from the active vehicle selector. Its model metadata and asset reference remain archived in source.
- Replaced the combined `all/rear` tint selector with independent `front/rear` controls.
- Added a 35% tint choice while retaining the existing 12%, 50%, 65%, 85%, and 100% choices.
- Front zone targets front-side glazing; rear zone targets rear-side glazing and rear windshield. The front windshield remains excluded.
- Manual glass mappings are now stored separately per model and per front/rear zone.
- If a 3D model exposes one shared material for both front and rear glass, separate appearances cannot be guaranteed until its geometry/materials are split or separate zone materials are identified. Shared IDs are applied only once to avoid conflicting updates.
- No calibration values for Audi A4, Nissan GT-R R35, Ford Mustang, or Wrap materials/catalog were changed.
