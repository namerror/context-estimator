Summary
Set the attachment display to a static "not implemented" placeholder and removed every attachment token heuristic so totals now only use chat and overhead counts.

Changes
- initialized the attachments row with the placeholder text and stopped updating it from JS
- removed attachment counting, per-attachment math, and `attachmentTokens` fields from the estimator
- simplified the overlay state/UI bindings so the widget only tracks chat, overhead, and total tokens

Tests
Not run (not requested)

Next
- Watch for future attachment-estimation work so we can swap the placeholder for real numbers and log that change.
