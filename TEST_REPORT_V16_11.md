# Test report — V16.11

Static checks performed:
- Confirmed the five preset values are exactly 12, 50, 65, 85, 95.
- Confirmed active car IDs remain Ford Mustang, Nissan GT-R, Lamborghini Huracan, Skoda Octavia, and Audi A4 B5.
- TypeScript/TSX transpilation syntax check performed separately.
- ZIP integrity check performed after packaging.

Not performed:
- Production build (dependencies are not installed in this environment).
- Live Sketchfab viewer/material validation.

Please test 12%, 50%, 65%, 85%, and 95% on all five cars. The 95% target is near-black; actual appearance can still vary by model material and lighting.
