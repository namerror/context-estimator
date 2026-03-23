## Summary
Implemented the initial ChatGPT context counter extension per the approved architecture plan, including UI overlay, DOM parsing, token estimation, and settings storage.

## Changes
- Added MV3 extension scaffold with `manifest.json`, `content.js`, and `styles.css` for chatgpt.com.
- Built overlay UI with collapsed bar, expanded breakdown panel, and warning state.
- Implemented heuristic token estimation, model detection with overrides, attachment heuristics, and local settings storage.
- Added mutation observer with debounced recalculation and manual refresh control.

## Tests
Not run (not requested).

## Next
- Validate selectors against the live ChatGPT DOM and refine model detection.
- Consider adding an options page for advanced settings like virtualization strategy.
