# Changelog

## v0.2.2 — 2026-10-15
- **Readability:** enlarge compact roll-card fonts ~15–20% and native dice from 38px to 45px (about 18%); add modest spacing while preserving the compact layout and wrapping.
- **Speaker identification:** apply Foundry chat author's player color as a low-intensity blend on speaker name and slim header stripe, dark/light aware. Only native WoD20 roll messages are tinted; no color available means no accent.
- **Safety:** no changes to roll evaluation, result flags, Paradox detection/addition, Actor data, or Dice So Nice; color is strictly validated before CSS injection.
- **Tests:** mock author-color cases, CSS/manifest guards, prior roll/Paradox tests and GitHub packaging workflow. Live Foundry v14 visual verification still pending.
- **Rollback:** restore v0.2.1 (smaller compact version) or v0.2.0 (pre-compact). 


## v0.2.1 — 2026-10-15
- **Compact by default:** reduce native WoD20 dice chat-card height by approximately half in a 293px-wide browser mock; attack examples 336→149px and damage 354→165px.
- **Presentation:** shorter chat header and action title, inline pool/difficulty information, 28px result strip, 38px dice with tighter wrap, reduced margins and compact Paradox prompt/buttons.
- **Safety:** CSS-only changes to roll cards. No JavaScript, Roll, Actor, ChatMessage, flags or Paradox logic modified. Ordinary chat and non-roll WoD20 cards remain untouched.
- **Tests:** Foundry-shaped browser layout mock including both themes, multi-row dice, preserved grayscale/filter, Paradox controls, and CSS/manifest guards. Live Foundry testing remains pending.
- **Rollback:** restore the earlier v0.2.0 ZIP to remove only this layout change.


## v0.2.0 — 2026-10-15
- **Fixed:** v0.1.0 did not detect, shade or resolve Paradox dice after disabling the original Paradox module.
- **Added:** migrated native Mage cast detection, Paradox dice marking, Paradox generation and manual Add/Ignore chat prompt, legacy Actor and PC embedded Advantage updates, maximum cap.
- **Safety:** skip Paradox processing when `wod20-paradox` is active; store results in the new module flag namespace; do not restore "pending" if the Actor changed but the final ChatMessage flag fails.
- **Preserved:** original WoD20 dice rolls/chat cards, existing world Actor values, result styling and explicit player/GM approval of Paradox additions.
- **Testing:** static syntax + mock regression tests passed. **Live Foundry verification not yet run.**
- **Limitations:** historical old message flags remain separate; multi-client race, Player Actions and render refresh timing need live confirmation.
- **Rollback:** disable v0.2.0 and re-enable original backed-up Paradox module.

## v0.1.0 — 2026-10-15
- Standalone native WoD20 success/failure/botch formatting only.
