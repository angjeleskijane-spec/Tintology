# Tintology Phase25.3 test report

- Wrap variants: 203.
- Wrap variants with vehicle photos: 45.
- Wrap variants without vehicle photos: 158.
- Photo-first ordering: PASS (45 photo variants appear before the remaining 158).
- Price records: 57; every price ID exists in the Wrap catalog.
- Price calculation: PASS using NBS 1 EUR = 117.6018 RSD (rate list 2026-11-05) and 10% markup.
- Tint options: PASS — 12%, 50%, 65%, 85%, 95%; all calibration maps include the 12% light stop.
- Full-screen simulator controls: PASS — explicit TINT and WRAP controls are present.
- Service images: PASS — windshield-repair crack/resin image and tinted-window image exist and are assigned in App.tsx.
- JSON parse: PASS.
- TypeScript/TSX syntax transpilation: PASS for App.tsx, CarStudio.tsx, ProductCatalog.tsx, and server.ts.
- Full Vite build/typecheck: NOT RUN — dependency installation in the working container timed out; the Vite and type packages are not fully installed here.

No change was made to the Phase25.2 archive. This is a separate Phase25.3 working copy.
