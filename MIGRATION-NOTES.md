# Migration and deployment – component 08

This is a **new v0.1.0 module** with ID `wod20-dice-improvements`, not an in-place upgrade to the unrecovered older Dice Improvements module.
The original supplied `paradox.js` and `paradox.css` mix generic formatting with Paradox mechanics. Only generic result formatting moved here. Paradox processing remains owned by module 09.

**Disabling or uninstalling `wod20-paradox` stops Paradox accumulation, Add/Ignore prompts and its Actor updates.** Do not treat this package as a complete replacement.

Back up current module folders before removing or updating. Install using the manifest URL in README or the complete versioned ZIP. Test success, zero successes, botch, both themes, native Mage casting, Dice So Nice, and Paradox once-only behavior if Paradox remains enabled.

Local mock and static checks were performed. No live Foundry v14 integration verification was performed.
