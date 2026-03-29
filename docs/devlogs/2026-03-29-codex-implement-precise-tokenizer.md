# Summary

Implemented a working “Precise (tokenizer)” estimation method by bundling a pure-JS tokenizer and wiring it into the content script, with a safety cutoff that falls back to the fast heuristic on very large chats.

# Changes

- Vendored `gpt-tokenizer@3.0.1` UMD encoding bundles (`o200k_base`, `cl100k_base`) under `vendor/`.
- Added `window.__ccxTokenizer` wrapper with model→encoding selection.
- Updated the `precise` estimator to use the tokenizer wrapper.
- Added a large-chat cutoff to skip precise tokenization and show a warning when falling back.
- Updated the learn page copy to reflect the new precise behavior.
- Updated `manifest.json` load order to ensure tokenizer globals are available before estimation.

# Tests

- `node --check` (syntax) on updated JS files.

# Next

- Validate token counts against known examples and tune the model→encoding mapping if needed.
- Consider moving precise tokenization to a Web Worker if UI jank shows up in real use.

