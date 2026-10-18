# WoD20 Dice Improvements + Paradox

**v0.2.3 | Foundry VTT v14 | WoD20 worldofdarkness v7.3.1**

Native WoD20 chat cards are more readable, with compact dice and clearer success/failure results. Mage spell rolls also highlight Paradox dice and show **Add Paradox / Ignore** controls when Paradox is generated.

**In Foundry Manage Modules:** Enable **WoD20 Dice Improvements + Paradox** (`wod20-dice-improvements`). Keep the older **WoD20 Paradox** (`wod20-paradox`) **disabled**, but backed up. Running both Paradox processors could count the same roll twice. Updating the module does not switch either checkbox for you.

**Example:** A Mage with two temporary Paradox rolls four native WoD20 dice. The first two show as grayscale in the Foundry ChatMessage. If a marked die triggers Paradox, **Add Paradox** requests the Actor update; **Ignore** leaves the Actor unchanged. A two-client test for duplicate accounting is still pending. Dice So Nice animation by itself is not the chat result.

## Features

- **More readable compact layout (v0.2.2, default):** 14px chat header and details, 19px roll title, 18px success/fail text, and **45px dice** (up from 38px in v0.2.1). The card retains the compact structure but adds a little breathing room for comfortable scanning.
- **Subtle player color on roll headers:** for an authored native WoD20 roll, Foundry's *chat author* User.color is blended at 40% into the speaker-name text and 35% into a narrow left header stripe. No tint if the author color is unknown. GM-authored NPC rolls use the GM's user color. No card-wide color, and the original success/fail/Paradox dice colors are unchanged.

- **Compact native chat roll cards (introduced in v0.2.1):** tighter spacing, inline roll pool/difficulty, naturally wrapped dice, and slimmed Paradox prompts. v0.2.2 increases sizes without changing the underlying roll data.

- Dark/light successes, zero successes, fail and botch result styling.
- Detects Mage Coincidental/Vulgar spell casts, reads existing temporary Paradox from legacy Mage Actors or PC Advantage items.
- Grays out the first N dice, where N is existing temporary Paradox capped by the dice pool.
- A displayed Paradox die rolling a 1 generates a manual **Add Paradox / Ignore** prompt. The Actor changes only after Add, capped by the Actor's maximum.
- New results are stored at `flags.wod20-dice-improvements.result`; old flags from `wod20-paradox` are left intact.
- Uses the native WoD20 dice/chat system, not a duplicate roller. The new Paradox listener is automatically disabled when `wod20-paradox` is active.

## Install / upgrade

Use **Foundry Setup > Add-on Modules > Install Module**, with this Manifest URL:

`https://github.com/rebsiot/wod20-dice-improvements/releases/latest/download/module.json`

Enable WoD20 Dice Improvements in the world and hard-refresh your client. To install manually, stop Foundry and extract the GitHub ZIP to `Z:\Data\modules\wod20-dice-improvements` with `module.json` at the folder root; restart Foundry and enable the module.

### Switching from the original Paradox module

1. Back up `Z:\Data\modules\wod20-paradox`, the existing Dice Improvements folder and relevant world data.
2. **Disable** `wod20-paradox` in Manage Modules. Do not delete it yet.
3. Upgrade and enable **WoD20 Dice Improvements + Paradox v0.2.3**, then restart/hard-refresh.
4. Perform the spell-casting smoke test below before removing any old files.

## Readability and speaker-color live test

Update to v0.2.3 and hard-refresh (`Ctrl+Shift+R`) in the world. Make Bite/Knife Attack and Knife Damage rolls. Confirm titles, trait/difficulty text and dice are large enough to read without squinting, six 45px dice fit on one row at a typical chat sidebar width, and larger pools wrap naturally. The sender name should take on a soft tint from the user who posted that roll, with a subtle left header line. Other text messages, dice colors and green/red results should not change. If the user has no accessible color, the standard uncolored header remains.

Check a Mage Paradox roll: selected dice remain grayscale and the Add/Ignore prompt stays visible and clickable. v0.2.1 had reached about half the original card height in a 293px browser mock; v0.2.2 intentionally grows a little to improve legibility. **Exact resulting height and color contrast in live Foundry have not been measured.**

## One live test

On a Mage with **2 temporary Paradox already accumulated**, cast a native **Coincidental** spell with at least 3 dice. The first **2** dice should appear grayscale. If either of those two dice rolls a **1**, the chat card should show an **Add Paradox / Ignore** prompt. Click Add once and verify the Actor's Paradox increased exactly once. Reopen chat to ensure it did not add again.

**Paradox 0 means no special dice** under this implementation. Only eligible spell casts create Paradox dice.

## Verification / limitations

- Static syntax and mock tests pass (Mage/PC Paradox storage, roll matching, display, Add/Ignore, maximum, old-module guard and failed final flag write).
- **The compact layout, player-color accents, and two-client Paradox exactly-once behavior have not yet been fully live-tested in Foundry.** Player Actions card content, GM/player permissions, Dice So Nice, UI rerenders and multiple simultaneous clients still need live verification.
- Preexisting old Paradox message flags are preserved but are not migrated into new flags. If a chat card becomes stuck at **Resolving** after a partial update, inspect Actor Paradox rather than clicking again.
- The underlying original Paradox logic still uses localized Coincidental/Vulgar markers and each existing Paradox die that rolls a 1 as the trigger.

## Rollback

For the **earlier, smaller compact layout**, restore the **v0.2.1** Dice Improvements release. For the original full-size layout, use **v0.2.0**. Back up the module directory before replacing it; stop Foundry, restore the older ZIP to the same module folder, restart, and hard-refresh. To revert the entire integrated module, disable Dice Improvements and re-enable the backed-up original `wod20-paradox` module. Do not resolve the same Paradox chat event in both systems.

**Contract:** Paradox runtime ownership has been moved from St. Louis v2 component 09 to component 08 at the user's explicit request. Update handoffs 08/09 and GLOBAL-02/GLOBAL-04 after live verification.
