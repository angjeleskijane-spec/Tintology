# Tintology — internal Wrap catalogue notes

This file is an internal research note, not a public website page.

## Current selection and order
1. 3M — 30 variants
2. Avery Dennison — 30 variants
3. KPMF — 30 variants
4. Metamark — 30 variants
5. ORAFOL / ORACAL — 30 variants
6. Arlon — 25 variants
7. Mactac — 25 variants

Total: 200 Wrap variants. The catalogue and 3D simulator consume the same `WRAP_PRODUCTS` data source. The manufacturer order is defined in `src/ProductCatalog.tsx` and reused in `src/CarStudio.tsx`.

## Manufacturer references used for product names and codes
- 3M Wrap Film Series 2080: https://multimedia.3m.com/mws/media/1635871O/3m-wrap-film-series-swatch-color-poster-2080.pdf
- Avery Dennison Supreme Wrapping Film range: https://graphics.averydennison.com/ap-en/home/graphics-products/vehicle-wrapping-films/swf900-supreme-wrapping-film/range.html
- KPMF vehicle-wrap product listings: https://www.kpmf.com/products
- Metamark MM-CC: https://metamark.co.uk/products/metamark-colour-change ; MetaCast MCX brochure: https://cdn.shopify.com/s/files/1/0916/9158/1769/files/MetaCast_MCX_Brochure_-_2025.pdf?v=1759847517
- ORAFOL ORACAL 970RA: https://www.orafol.com/en/europe/products/oracal-970ra-premium-wrapping-cast
- Arlon Premium Colour Change: https://www.arlon.com/anz_en/products/car-colour-change-wraps-anz-en
- Mactac ColourWrap poster: https://www.mactacgraphics.eu/content/dam/averymactac/sites/default/files/MT%20CWS%20Poster%20-%20Horizontal.pdf

## Important limitations
- Product codes and names are sourced from manufacturer references. Regional catalogues and availability may differ; inclusion is not a promise of local stock.
- Swatch HEX values are approximate display values for the website and simulator, not laboratory colour measurements. A physical swatch is required for final shade confirmation.
- New entries without a verified exact vehicle photograph use colour swatches rather than misleading substitute photos.
- Do not expose internal supplier details, supplier links, stock status or procurement prices on the public website.
