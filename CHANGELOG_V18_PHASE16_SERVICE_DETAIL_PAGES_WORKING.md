# Tintology V18 Phase16 – Service detail pages and homepage correction

## Homepage corrections
- Removed the “Избери услуга” heading; retained the small “TINTOLOGY · УСЛУГИ” label and supporting description.
- Homepage now presents exactly six primary service cards: window tinting, windshield replacement, windshield repair, architectural films, PPF, and Car Wrap.
- Removed the taillight-film card from this six-service overview; this does not remove any separate taillight/PVC service functionality elsewhere.
- Set the desktop grid to four compact cards per row (six cards total: 4 + 2) and reduced card image height and spacing.

## Detail pages and routes
- `/zatemnuvanje-stakla` – WindowTintingPage
- `/zamena-avtostakla` – WindshieldReplacementPage
- `/reparacija-avtostakla` – WindshieldRepairPage
- `/folii-za-domovi-i-objekti` – ArchitecturalFilmsPage
- `/ppf-zastita` – PPFPage
- `/wrap` – WrapPage

The detail pages are separate routes opened by selecting a homepage service card; they are not six long sections stacked on the homepage. Existing additional service routes/components are preserved.
