# Summary

Refactored the content script into focused content modules and reduced `content.js` to a composition root that wires state, callbacks, and observers. Browser behavior still needs manual verification on live ChatGPT pages.

# Changes

- Added `content/namespace.js` to host shared content-script factories on `window.__ccxContent`.
- Extracted overlay drag behavior into `content/ui/overlay-drag.js`.
- Extracted overlay DOM creation and rendering into `content/ui/overlay-view.js`.
- Extracted page parsing and support detection into `content/core/page-context.js`.
- Extracted estimation and option helpers into `content/core/estimate-engine.js`.
- Extracted debounce and observer setup into `content/core/runtime-observers.js`.
- Reworked `content.js` into a small bootstrap layer and updated `manifest.json` to load the new modules in order.

# Tests

- `node --check content.js`
- `node --check content/namespace.js`
- `node --check content/ui/overlay-drag.js`
- `node --check content/ui/overlay-view.js`
- `node --check content/core/page-context.js`
- `node --check content/core/estimate-engine.js`
- `node --check content/core/runtime-observers.js`
- `node scripts/validate.mjs`
- Manual browser verification not run

# Next

- Verify drag, expand/minimize, and persisted positioning in a live ChatGPT tab.
- Verify supported and unsupported page transitions plus estimator fallback behavior after SPA navigation.
