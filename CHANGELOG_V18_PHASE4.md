# Tintology Studio V18 – Phase 4: Unified Tint + Wrap application

Base: V18 Phase 3.

## Changes
- Tint and Wrap controls remain visible and independently editable at the same time; neither panel is presented as a mutually exclusive active mode.
- Booking now submits a combined Window Tint + Car Wrap request and includes both selected configurations.
- Reworked the Sketchfab material update pass to serialize source-material restoration, glass tint application, and body-wrap application. This prevents an asynchronous restore call from overwriting a newer tint or wrap update.
- Tint material calculation now returns a material object so it can be applied in the same ordered update queue as Wrap.
- Removed the active-service dependency from the material application effect. Both services are always applied to the same loaded vehicle scene.

## Preserved
- Vehicle list, fixed 30% / 95% policy, five tint options on supported vehicles.
- Existing Wrap catalog, colors and finishes.
- Existing model-specific glass/body target filtering and diagnostic tools.
- Existing site sections and architectural film content.

## Verification
- TypeScript TSX transpilation completed with zero syntax diagnostics.
- Full TypeScript project check and Vite build were not run because the project dependencies (including vite/client) are not installed in this environment.
- Live Sketchfab behavior must still be confirmed in the user's browser. The code now serializes material operations, but no visual claim is made without a live model test.
