# Summary
- Gated token counting on explicit plan and model selection while removing auto-detect behavior from the UI.

# Changes
- Stubbed model detection and switched estimates to use the selected model only.
- Added plan/model placeholders and deferred estimates until both are chosen.
- Simplified the overrides UI to just plan and model selection.

# Tests
- Not run (not requested).

# Next
- Consider whether the summary rows should be hidden entirely until selections are made.
