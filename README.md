# WoD20 Dice Improvements

**Status: source-recovery / migration staging, not an installable Foundry release.**

This repository is the intended GitHub home of the **existing** WoD20 Dice Improvements module in the St. Louis v2 toolkit (component `08`). The installed module's full source tree, original `module.json`, exact module ID, and version **have not yet been recovered**. Do **not** install this repository over a working Foundry module.

## Code available so far

The provided `paradox.js` and `paradox.css` (2026-10-15) belong to a different existing module, `wod20-paradox`. They currently contain some **general-purpose WoD20 roll-result presentation** mixed with Paradox logic. This repository contains an isolated, **reference-only extraction** of that shared presentation code:

- `src/roll-result-formatting.js`: decorates existing native WoD20 chat cards to distinguish successes, zero successes, and danger/botch states.
- `styles/roll-result-formatting.css`: the associated dark/light Foundry chat-card presentation.
- `tests/roll-result-formatting.test.js`: standalone mock checks, **not** Foundry integration tests.

This extraction does **not** replace the current installed Dice Improvements module, create rolls or ChatMessages, change Actors, resolve magick, or calculate/add Paradox.

## Module ownership

- **Dice Improvements (08):** roll presentation only; native WoD20 remains the dice/ChatMessage authority.
- **Player Actions (05):** casting/action UI; emits native WoD20 roll cards (not another dice engine).
- **Paradox (09):** the existing `wod20-paradox` module owns Paradox detection, results, flags, and Actor mutations.
- **Dice So Nice:** visual dice animation is not a substitute for a real ChatMessage.

Some styling remains in Paradox's installed code today. Do not activate **two copies** of the generic style or migrate/remove Paradox styling before testing both modules together.

## Completing the GitHub migration

1. Back up the installed Dice Improvements module under `Z:\Data\modules\<actual-module-folder>`.
2. Supply its **complete directory/ZIP**, particularly the **original** `module.json`; inspect the manifest for exact module ID, version, entrypoints, and dependencies.
3. Reconcile this extracted roll formatting with the actual working Dice Improvements source. Preserve all existing features and installed world settings.
4. Produce and test a **complete, independently versioned Foundry module ZIP**. Only then publish an installable GitHub release and manifest/update links.
5. In a separate Paradox (09) release, remove duplicate presentation hooks/CSS **only after** verifying module interaction in Foundry v14 with WoD20.

## Verification and risk notes

- Basic syntax and simulated chat-render checks can be run outside Foundry.
- No live Foundry v14 + WoD20 integration verification has occurred for this extracted code.
- The source checks for English `Successes:` text and WoD20 CSS selectors. Non-English card labels and future native chat markup changes remain unverified.
- The original Paradox listener has its own unverified roll-structure/exactly-once concerns. Those are **out of scope** here.

See [MIGRATION-NOTES.md](MIGRATION-NOTES.md) for deployment, rollback, and cross-module test conditions.

**Licensing:** no license is asserted by this snapshot; clarify licensing before redistributing a public module release.
