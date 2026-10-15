# Migration & integration contract — 2026-10-15

Owning component: **08 – Dice Rolling Improvements**. The user explicitly requested replacing the old Paradox module. v0.1.0 lacked Paradox functionality and caused missing Paradox die highlights. v0.2.0 includes the user-supplied original `paradox.js` and `paradox.css` behavior (scoped to the new module) alongside generic roll formatting.

**Ownership:** Dice Improvements (08) now handles Paradox dice/prompts/accounting when `wod20-paradox` (09) is disabled. Runtime guards skip the new Paradox hooks if the old module is enabled. Update both module handoffs and GLOBAL-02/GLOBAL-04 after live validation.

**Contract:** Foundry/WoD20 remains the source of dice and ChatMessages. The upstream WoD20 v7.3.1 roller creates one 1d10 Roll per die. Player Actions (05) should emit native magic-roll chat cards with localized spell-type markers. Dice So Nice is only animation. New flags use `wod20-dice-improvements.result`; existing `wod20-paradox.result` flags are not overwritten or migrated.

**Safety:** Back up module folders and world data first, disable old Paradox rather than deleting, and verify one cast with two existing Paradox. No automatic Actor or world migration runs at install. Manual Add/Ignore buttons control new Paradox points.

**Testing:** source syntax and mock tests passed. Live Foundry v14/World of Darkness v7.3.1 and Player Actions integration not yet verified.
