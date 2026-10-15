# WoD20 Dice Improvements

**Foundry VTT v14 | World of Darkness 20 | v0.1.0 (2026-10-15)**

This is a NEW, installable module providing native WoD20 chat-card styling. It was extracted from the generic formatting in the user-provided Paradox source; it is NOT the unrecovered original Dice Improvements module.

## Features
- Colors native WoD20 success totals green, zero successes red, and fail/botch danger cards red.
- Works with light and dark themes and uses Foundry v14 renderChatMessageHTML.
- Does not roll dice, create ChatMessages, modify Actors, award Paradox, or replace system mechanics.

## Install using Foundry Setup
Setup → Add-on Modules → Install Module → Manifest URL:

`https://raw.githubusercontent.com/rebsiot/wod20-dice-improvements/main/module.json`

Enable **WoD20 Dice Improvements** in Manage Modules in the intended World of Darkness 20 world, then hard-refresh.
For manual ZIP installation: stop Foundry, extract to the module folder named `wod20-dice-improvements` inside `Z:\Data\modules`, verify that `module.json` is immediately inside this folder, restart Foundry and enable the module.

## Paradox safety warning
**This module DOES NOT include Paradox dice processing, the Add/Ignore UI, or Actor Paradox changes.** Those belong to the separate `wod20-paradox` module. Disabling/uninstalling that module removes those features. Back up its folder before removing it.
If both modules run, their generic result formatting can overlap. Verify in a test world before disabling Paradox or migrating its remaining code.

## Limitations and testing
- Depends on current WoD20 `.wod20-roll .tray-success-area`, `.danger` and English `Successes:` markup.
- No settings, migrations, data writes, or document modifications.
- Local syntax and mock tests have passed. Live Foundry v14 testing has not been run.
- Run `npm test` for simulated result and hook tests. Live-test successes, zero, botch, light/dark themes, Mage casting, and any enabled Paradox integration.

## Rollback
Disable this module to revert its display effects. For a source rollback, stop Foundry and restore the backed-up module directory, then restart and refresh. A module folder backup does not reverse independent world-document changes.

Component ownership: Dice Improvements 08. Paradox remains component 09. See MIGRATION-NOTES.md.
