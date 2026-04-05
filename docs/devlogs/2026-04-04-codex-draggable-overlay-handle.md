# Summary

Added draggable positioning for the overlay using the progress-bar handle and persisted the overlay position across page reloads. Dragging now clamps within the viewport and preserves click-to-expand behavior.

# Changes

- Added `overlayPosition` defaults to persisted settings in `config.js`.
- Implemented pointer-based drag handling on `#ccx-collapsed` in `content.js` with a movement threshold to avoid accidental toggle clicks.
- Added viewport clamping logic for overlay position and persisted final position after drag end.
- Applied saved overlay position at startup and re-clamped on panel open/minimize and window resize.
- Added drag cursor and temporary no-select styling in `styles.css` during active drag.

# Tests

- `node --check content.js`
- `node --check config.js`
- `node scripts/validate.mjs`

# Next

- Validate behavior on live ChatGPT mobile layouts to confirm drag + clamp ergonomics on narrow viewports.
