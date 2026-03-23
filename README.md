# ChatGPT Context Counter

A lightweight Chrome/Chromium extension that estimates how much of a ChatGPT conversation's context window is currently used. It adds a small overlay on chatgpt.com showing percent used and a quick breakdown of tokens.

## What It Does

- Estimates total tokens for the current conversation
- Shows percent of context used with a progress bar
- Breaks down chat text, attachments, and overhead
- Detects model when possible and lets you override
- Warns if history looks incomplete

## Install (Chrome / Chromium)

1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked".
4. Select this repository folder.
5. Open https://chatgpt.com and start a conversation.

## Usage

- The overlay appears in the bottom-right corner.
- Click the collapsed bar to expand details.
- Use "Recalculate" if you scroll or load more history.
- Override model or context size in the panel if needed.

## Dev Logs

Agent session logs live in `docs/devlogs/`. See `docs/devlogs/README.md` for the required format and `docs/devlogs/Index.md` for the log index.

## Project Layout

- `content.js`: Content script that parses the DOM and computes estimates
- `styles.css`: Overlay UI styles
- `manifest.json`: Chrome extension manifest
- `docs/`: Design and devlog documentation
