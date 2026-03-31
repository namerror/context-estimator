# Summary

Implemented a minimal GitHub Actions CI/CD setup for the extension: PR/push validation plus tag-based release packaging to a GitHub Release.

# Changes

- Added GitHub Actions workflows for CI validation and tag-triggered releases.
- Added minimal Node scripts to validate `manifest.json` and package a release `.zip`.
- Added Dependabot configuration for GitHub Actions updates.
- Added `.gitignore` entries for `dist/` and packaged zip artifacts.

# Tests

Not run (not requested).

# Next

- Optionally add a CodeQL workflow for scheduled JS security scanning.
- Decide whether to introduce ESLint/Prettier (would require adding a Node toolchain config).
