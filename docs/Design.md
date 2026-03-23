You are designing a Chrome extension for ChatGPT (chatgpt.com) that estimates how much of the model’s context window is being used in the current conversation.

This is a **product + technical specification task only**. Do NOT write full implementation code. Focus on clear architecture, data flow, UX behavior, and system design decisions.

---

## Product Overview

The extension overlays a small UI inside chatgpt.com that shows:

* % of context window used (or remaining)
* A progress visualization (bar or circular)

It is **purely informational**.

An expanded panel provides a deeper breakdown.

---

## Core Requirements

### 1. Execution Environment

* Chrome extension (Manifest V3)
* Runs as a content script on chatgpt.com
* Must work on Chrome + Chromium browsers (Edge, Brave)

---

### 2. Context Definition

We are estimating **full conversation context**, not just visible messages.

Important constraints:

* ChatGPT may virtualize or lazy-load older messages
* Not all messages may be present in the DOM at once

System must:

* Parse as much of the conversation as is available
* Detect when parsing is incomplete
* Warn user when estimate may be incomplete

---

### 3. Token Counting Strategy

#### Visible Content

* Extract all user + assistant messages from DOM
* Convert text → token estimates

#### Hidden Overhead

* Add a configurable heuristic estimate for:

  * system prompts
  * formatting / role metadata
* This should be clearly separated in the breakdown

#### Attachments (v1 Placeholder)

* Detect presence of attachments in the chat
* Apply a heuristic token estimate per attachment
* Allow manual override in UI

---

### 4. Model Handling

* Attempt to auto-detect active model from ChatGPT UI
* Maintain a mapping of model → context window size
* Allow user to manually override model

System must handle:

* Unknown models
* Missing or changing UI labels

---

### 5. Accuracy Philosophy

* Prioritize **accuracy over speed**
* Allow recalculation passes for improved precision
* Never present estimates as exact

If parsing is incomplete:

* Show estimate
* Display warning (in expanded UI)

---

### 6. UI Requirements

#### Collapsed UI (always visible)

* % of context used or remaining
* Progress visualization (bar or circle)
* Minimal, non-intrusive

#### Expanded UI (on click)

Include:

* Total estimated tokens
* Breakdown:

  * chat text tokens
  * attachment tokens (estimated + editable)
  * overhead tokens
* Model selection (auto-detected + override)
* Context window size
* Warning state if incomplete parsing

---

### 7. Performance Strategy

* Accuracy-first (not real-time-first)
* Avoid excessive DOM re-parsing
* Use incremental updates where possible
* Support recalculation/refinement passes

---

## What to Produce

Create a structured spec with:

1. **System Architecture**

   * content script responsibilities
   * UI layer
   * token estimation module
   * model detection module

2. **Data Flow**

   * from DOM → parsed messages → token estimation → UI

3. **DOM Parsing Strategy**

   * how to identify messages
   * how to handle missing/virtualized content

4. **Token Estimation Approach**

   * exact vs heuristic layers
   * where approximations occur

5. **Model Detection Strategy**

   * how to read from UI
   * fallback behavior

6. **UI State Model**

   * collapsed vs expanded
   * loading / partial / complete states

7. **Failure & Edge Cases**

   * incomplete DOM
   * unknown model
   * rapid chat updates
   * very long chats

8. **Extensibility Notes**

   * how to later support:

     * attachments more accurately
     * streaming updates
     * multi-model comparisons

Be explicit about tradeoffs, assumptions, and risks.

Do NOT write full code. Focus on clarity and decision-making quality.
