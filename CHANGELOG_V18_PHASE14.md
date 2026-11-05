# Tintology V18 – Phase 14

## Implemented

### 1. Main service menu
- Replaced the plain top-level Services link with `TINTOLOGY · УСЛУГИ` as the first navigation item.
- Added seven image-led service links: automotive window tinting, windshield replacement, films for homes/buildings, windshield repair, taillight film, PPF paint protection, and Car Wrap colour change.
- Removed the standalone Auto Glass navigation item because windshield services are now grouped inside the service menu.
- Added the same image-led service list to the mobile menu.
- Kept existing service routes and service pages intact; replacement and repair point to the existing Auto Glass page, and taillight film points to the existing Automotive Films page.
- No small service icons are used in the dropdown rows.

### 2. Simulator model list
- Removed SEAT Leon, Škoda Octavia, Honda Civic, and Porsche 911 (1970s) from the model records and selectable list.
- Kept Porsche 911 (930) Turbo selectable.
- Left the other approved vehicles unchanged.

### 3. Simulator right panel cleanup
- Removed the complete visible diagnostics/manual material mapping panel, including Node Map text, copy-node control, material IDs/channels, and body/wrap material lists.
- Removed the visible warning that directed customers to open diagnostics.
- Removed the category label (`Возило / Купе`), booking CTA, and price-list note from the right panel.
- Removed the now-unused Node Map fetch and diagnostic opacity-test UI logic.
- Preserved the underlying automatic material-list classification and saved per-model material mappings.
- Tightened the right panel spacing and reduced explanatory copy.
- Restored the approved five tint options for every selectable model: 10%, 30%, 50%, 70%, 90% (10% lightest, 90% darkest).

## Image sourcing note
- Service-menu photos are real, non-generated photographs sourced from Pexels and Unsplash. Source pages and license references are listed in `IMAGE_SOURCES_PHASE14.md`.
- The current build references the verified source images from their image CDNs. The working environment could not download external image bytes into the project ZIP, so the photographs are not yet bundled as local assets. The site therefore needs an internet connection to load these images.

## Validation
- TypeScript transpilation/syntax diagnostics passed for the edited `src/App.tsx` and `src/CarStudio.tsx`.
- Model-list checks confirmed the four requested models are not in the selectable order and Porsche 911 (930) Turbo remains.
- Source checks confirmed the visible diagnostics/Node Map panel and booking/price block are removed.
- ZIP integrity check passed after packaging.
- Full dependency installation and Vite production build were not run: dependencies are not cached in this environment and external package downloads are unavailable. Live browser/mobile rendering and simulator runtime behavior were not retested.
