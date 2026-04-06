# Summary

Updated overlay positioning so the saved `overlayPosition` tracks the collapsed progress-bar anchor instead of the full expanded overlay box. Expanded panels may shift upward to stay visible, but minimizing now restores the bar to its original anchored position unless the user dragged it.

# Changes

- Reworked overlay position math in `content.js` to clamp the saved anchor against `#ccx-collapsed` dimensions.
- Derived the rendered root `right` and `bottom` from the saved anchor plus the current open/closed layout offsets.
- Kept the persisted settings shape unchanged and left transient open-state overflow adjustments out of stored position data.

# Tests

- `node --check content.js`
- `node --check content/ui/overlay-drag.js`
- `node --check content/ui/overlay-view.js`
- `node scripts/validate.mjs`

# Next

- Manually verify the overlay near the bottom of a live ChatGPT page to confirm open/minimize and resize behavior feels stable.
