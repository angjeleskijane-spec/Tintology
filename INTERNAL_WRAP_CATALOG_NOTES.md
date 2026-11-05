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


## Follow-up supplier audit — 5 November 2026
Exchange-rate reference: official NBS middle rate for 5 November 2026, 1 EUR = 117.6018 RSD (rate list 212). NBS explains the official middle rate is published on business days and applies from 08:00 the following day; use the date applicable to the audit. Reference: https://nbs.rs/sr/finansijsko_trziste/kurs-dinara-napomene/index.html

Verified product details and supplier prices (internal only; RSD incl. VAT, per m²):
- Avery Dennison Supreme Wrapping Film Satin Black, 1.52 m roll, 3,602 RSD/m², in stock, up to 12-year warranty stated on supplier page. ID: avery-satin-black. Formula: 3,602 / 117.6018 × 1.10 = 33.69 EUR/m². Product page: https://www.cfs.rs/proizvod/743/saten-crna-auto-folija-avery-dennison-satin-black-152-cm/
- KPMF K88021 Black Gloss, 1.52 m roll, 1,680 RSD/m². The supplier's category/featured listing confirms price; the current search extract did not establish stock status for this exact item. ID: kpmf-gloss-black. Calculated public price: 15.71 EUR/m². Supplier listing: https://cfs.rs/proizvodi/20/strana/
- KPMF K89021 Black Matt, 1.52 m roll, 1,680 RSD/m², 100 micron, manufacturer recommended warranty 5–7 years. ID needs matching against the exact existing catalogue record before pricing. Supplier product page: https://www.carfoilshop.com/proizvod/279/crna-mat-folija-kpmf-k89021/
- Avery Dennison Satin Metallic Black Rock Grey, Supreme Wrapping Film, 1.52 m roll, 3,602 RSD/m², in stock, 3-year manufacturer recommended warranty stated on supplier page. Product page: https://cfs.rs/proizvod/939/avery-dennison-satin-metallic-black-rock-grey/

Additional candidate KPMF colors appearing in current supplier category results at 3,602 RSD/m²: K75438 Surge Green; K75447 Midnight Crimson Bloom; K75448 Phantom Black Metallic; K75454 Dynamic Lime; K75457 Desert Storm; K75459 Hypnotic Black Violet; K75460 Green/Black Iridescent; K75465 Purple/Black Chameleon Gloss; K75470 Morpheus Black Starlight; K75472 Gold/White Starlight; K75477 Zenith Grey Metallic; K75479 Copper/Black Starlight; K75501 Matt Iced Silver Titanium; K75502 Matt Iced Orange Titanium; K75504 Matt Iced Pink Titanium. These are candidate rows only until each exact product detail page, width, unit, stock and warranty are individually verified. Listing page: https://cfs.rs/proizvodi/20/strana/

Pricing rule for verified supplier prices: RSD / applicable official NBS RSD-per-EUR middle rate × 1.10; round to 2 decimal places; public unit €/m². Never expose supplier identity, source price, supplier links, or stock status publicly. No product/catalog code, website, ZIP, or simulator was changed as part of this audit.


## Follow-up supplier audit — verified additions, 5 November 2026

Official NBS middle-rate basis used for this update: 1 EUR = 117.6018 RSD, applicable rate date 2026-11-05. Formula remains RSD/m² ÷ 117.6018 × 1.10, rounded to 2 decimals. Public prices are EUR/m² only.

New catalogue entries and verified source details (internal procurement data; never expose source prices or supplier identity publicly):

- ORACAL 970 GRA 070 Black Glossy — catalogue ID `orafol-070-g`; 2,890 RSD/m² incl. VAT; 1.52 m; 110 μm; RapidAir; listed in stock; manufacturer-recommended warranty up to 12 years subject to installation and exposure conditions. Public EUR price: 27.03 €/m². Product page: https://www.cfs.rs/proizvod/855/oracal-970-gra-070-black-glossy/
- ORACAL 970 GRA 076 Telegrey — catalogue ID `orafol-076-g`; 3,195 RSD/m² incl. VAT; 1.52 m; 110 μm; RapidAir; listed in stock; manufacturer-recommended warranty up to 10 years subject to installation and exposure conditions. Public EUR price: 29.88 €/m². Product page: https://www.cfs.rs/proizvod/1055/oracal-970-gra-076-telegrey/
- Avery Dennison Supreme Wrapping Film Cool Teal Satin Metallic — catalogue ID `avery-cool-teal-satin-metallic`; 3,602 RSD/m² incl. VAT; 1.52 m; Satin Metallic finish; Easy Apply RS; listed in stock; manufacturer-recommended warranty 3 years subject to installation and exposure conditions. Public EUR price: 33.69 €/m². Product page: https://www.cfs.rs/proizvod/745/cool-teal-satin-metallic-avery-dennison/

KPMF K89021 Black Matt was added to the product catalogue with verified product details and a genuine vehicle image, but no public price has been assigned. The supplier evidence is inconsistent: a recent search/category extract showed 1,680 RSD/m², while an older cached product-page extraction showed 1,600 RSD/m². Keep its public price as “Цена на барање” until a current supplier confirmation resolves the difference. Verified technical details: K89000 VWS AR, 1.52 m, 100 μm, Air Release, stated 5–7 year manufacturer-recommended warranty. Product page: https://www.cfs.rs/proizvod/279/crna-mat-folija-kpmf-k89021/

Image references for the newly added entries are supplier/product vehicle photos, not invented mockups:
- ORACAL 070: https://img.carfoilshop.com/optassets/1c1/8f4/oracal-black-gloss-medium.jpg
- ORACAL 076: https://img.carfoilshop.com/optassets/e02/cac/oracal_telegrey-medium.jpg
- Avery Cool Teal: https://img.carfoilshop.com/optassets/938/aff/avery_dennison_satin_metallic_cool_teal_1-medium.jpg
- KPMF K89021: https://img.carfoilshop.com/optassets/fea/bd4/kpmf_matt_black_7-medium.jpg

Do not expose these procurement references, supplier links, source prices, or stock status on the public site. New public Wrap prices are rounded to two decimal places and show only EUR/m².