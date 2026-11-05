Tintology V17.5 – Nissan GT-R R35 Node Map Diagnostic

Based on V17.4. Adds a read-only Sketchfab getNodeMap() diagnostic for Nissan GT-R R35.
When the Nissan model is selected and its Sketchfab viewer reaches viewerready, the app requests Node Map and shows the raw returned structure in the existing diagnostics panel. A copy button lets the user paste the result into ChatGPT.

No material assignments, material cloning, tint targets, Wrap logic, catalog, or other car mappings were changed. This diagnostic does not yet prove which node is which glass surface; live Node Map output is needed first.

Build status: not verified. Dependencies were not installed in this environment; npm install timed out. Live Sketchfab viewer behavior also requires the user's browser session and internet connection.
