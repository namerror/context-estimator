# Summary
Added a pluggable estimation-method registry with a new UI selector, and split estimator logic into separate modules to keep the content script compact.

# Changes
- added a global estimator registry plus Fast and Method B estimator modules
- wired an estimation method selector into the overlay and persisted it in settings
- updated the learn page to mention multiple estimation methods

# Tests
Not run (not requested).

# Next
- verify the estimator selector and defaults in the live extension UI
