# V16.15 source validation report

- Verified the model ID is passed into the tint function.
- Verified Mustang follows the original shared tint stops and blend values unchanged.
- Verified GT-R uses a model-specific blend/color only below 100%; its 100% stop and blend remain the original shared values.
- Verified Audi A4 uses a separate five-stop calibration: 65% equals the former 85% preset, 85% approximates the former 95% preset, and 100% is darker.
- Verified named headlamp/taillamp/brake/stop/indicator/turn-signal/fog-lamp materials are rejected by the glass-candidate filter.
- Verified Wrap persistence logic and catalog source were not changed.
- Exact Huracán/Octavia glass IDs were not invented; live material diagnostics are still required.
- `npm install` did not complete before timeout, so build/lint were not run.
- Live Sketchfab visual validation was not available.
