# Migration & integration contract — 2026-10-15

Owning component: **08 – Dice Rolling Improvements**. The user explicitly requested replacing the old Paradox module. v0.1.0 lacked Paradox functionality and caused missing Paradox die highlights. v0.2.0 includes the user-supplied original `paradox.js` and `paradox.css` behavior (scoped to the new module) alongside generic roll formatting.

**Ownership:** Dice Improvements (08) now handles Paradox dice/prompts/accounting when `wod20-paradox` (09) is disabled. Runtime guards skip the new Paradox hooks if the old module is enabled. Update both module handoffs and GLOBAL-02/GLOBAL-04 after live validation.

**Contract:** Foundry/WoD20 remains the source of dice and ChatMessages. The upstream WoD20 v7.3.1 roller creates one 1d10 Roll per die. Player Actions (05) should emit native magic-roll chat cards with localized spell-type markers. Dice So Nice is only animation. New flags use `wod20-dice-improvements.result`; existing `wod20-paradox.result` flags are not overwritten or migrated.

**Safety:** Back up module folders and world data first, disable old Paradox rather than deleting, and verify one cast with two existing Paradox. No automatic Actor or world migration runs at install. Manual Add/Ignore buttons control new Paradox points.

**Testing:** source syntax and mock tests passed. Live Foundry v14/World of Darkness v7.3.1 and Player Actions integration not yet verified.

## v0.2.1 compact card presentation

New style entry point: `styles/compact-roll-cards.css` (loaded **after** the result and Paradox styles). It targets only native `.wod20-roll` chat cards with `.tray-roll-area` and the corresponding message containers. **No source changes** to native WoD20, Player Actions, Mage Actor data, ChatMessage flags, or Paradox accounting. Both dark and light palettes and original Paradox die grayscale remain in place.

Local browser mock: Bite and Knife Attack 336→149 px, Knife Damage 354→165 px at 293px width. One six-die pool now fits on a line; larger pools wrap. Not a live Foundry confirmation. In v0.2.0 the user confirmed the Paradox dice display after a hard reset, but the Add/Ignore once-only live test remains outstanding. Component **08** owns these presentation changes; no update to component 09's Paradox API is required.

## v0.2.2 readable compact cards and restrained speaker color

- Retains Section 08 ownership and all existing native WoD20/Paradox behavior, with no new flags or Actor/world migrations.
- Keeps the compact stylesheet last. Display values increase to 14px header/details, 19px title, 18px success/failure text, 45px native SVG dice. Dice order, wrapping and filter/grayscale remain unchanged.
- A `renderChatMessageHTML` helper (`src/speaker-accent.js`) reads the chat **author's** Foundry `User.color`, hex-validates it, and only decorates WoD20 dice-roll message header DOM with a CSS variable/class. The sender name is blended 40% with a neutral dark/light base; a slim 35%-blend left border provides a second low-key cue. There are no document updates.
- Since a GM can roll for an NPC, its sender header reflects the **rolling user** color rather than a fictional Actor-owner color. No author color results in unchanged header.
- Static/mock validation can verify logic and CSS targeting; actual ChatMessage DOM structure, readability and palette should be checked in Foundry v14. The previous user's hard refresh was required to see the Paradox dice styling after an earlier update.
- For the original tighter v0.2.1 layout, roll back the v0.2.2 install to the v0.2.1 ZIP. Project source handoff `08-DICE-ROLLING-IMPROVEMENTS.md` requires release-status update; the Paradox handoff `09-PARADOX-MODULE.md` and GLOBAL-02/04 still need cross-module status reconciliation from v0.2.0, not changes to their runtime APIs.
