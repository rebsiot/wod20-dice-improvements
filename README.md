# WoD20 Dice Improvements

**v0.2.1 | Foundry VTT v14 | WoD20 worldofdarkness v7.3.1**

This module formats native WoD20 roll cards and now includes the Paradox-die highlighting and manual Paradox accounting from the user-provided `wod20-paradox` source. **Disable the original Paradox module to use this module's Paradox functionality.** Do not permanently delete your working original until a live test passes.

## Features

- **Compact native chat roll cards (v0.2.1, default):** reduced card padding and header, smaller action title and success strip, inline roll pool/difficulty, 38px dice with natural wrapping, tightened Paradox prompt spacing. This is a CSS-only presentation update; no data or roll behavior changes.

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
3. Upgrade and enable **WoD20 Dice Improvements v0.2.1**, then restart/hard-refresh.
4. Perform the spell-casting smoke test below before removing any old files.

## Compact-card live test

Update to v0.2.1 and hard-refresh (`Ctrl+Shift+R`) in the world. Make Bite/Knife Attack and Knife Damage rolls, then confirm one short title line, traits and difficulty beside each other where space permits, a slim success bar, and six 38px dice in a single row in an approximately 293px-wide chat sidebar. Longer text and larger dice pools should wrap without being truncated. Verify a Mage Paradox roll still grays the proper dice and the Add/Ignore buttons remain usable.

In a Chromium browser mock at 293px width, Bite/Knife Attack decreased **336px to 149px** (56%), Knife Damage **354px to 165px** (53%), and a Paradox prompt card **463px to 243px** (48%). Those are simulated UI measurements, not measurements from your live Foundry installation.

## One live test

On a Mage with **2 temporary Paradox already accumulated**, cast a native **Coincidental** spell with at least 3 dice. The first **2** dice should appear grayscale. If either of those two dice rolls a **1**, the chat card should show an **Add Paradox / Ignore** prompt. Click Add once and verify the Actor's Paradox increased exactly once. Reopen chat to ensure it did not add again.

**Paradox 0 means no special dice** under this implementation. Only eligible spell casts create Paradox dice.

## Verification / limitations

- Static syntax and mock tests pass (Mage/PC Paradox storage, roll matching, display, Add/Ignore, maximum, old-module guard and failed final flag write).
- **The v0.2.1 layout has not yet been live-tested in Foundry.** Player Actions card content, GM/player permissions, Dice So Nice, UI rerenders and multiple simultaneous clients still need live verification.
- Preexisting old Paradox message flags are preserved but are not migrated into new flags. If a chat card becomes stuck at **Resolving** after a partial update, inspect Actor Paradox rather than clicking again.
- The underlying original Paradox logic still uses localized Coincidental/Vulgar markers and each existing Paradox die that rolls a 1 as the trigger.

## Rollback

To revert **only the compact layout**, restore the previously working **v0.2.0** Dice Improvements ZIP while Foundry is stopped, or disable the new `styles/compact-roll-cards.css` reference in a local copy of the manifest (the versioned ZIP is preferred). Restore the prior module folder from backup, then restart and hard-refresh. To revert the entire integrated module, disable Dice Improvements and re-enable your backed-up original `wod20-paradox` module. Do not resolve the same pending chat event with both systems.

**Contract:** Paradox runtime ownership has been moved from St. Louis v2 component 09 to component 08 at the user's explicit request. Update handoffs 08/09 and GLOBAL-02/GLOBAL-04 after live verification.
