# Changelog

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
