# Changelog

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
