# Migration notes — 2026-10-15

Owning thread: **08 – Dice Rolling Improvements**. This is a **reference-only source baseline**, not a deployable replacement for the existing Foundry module.

The supplied `paradox.js` and `paradox.css` belong to the separately owned `wod20-paradox` module. Extracted generic formatting here preserves success, zero-success, and danger styling but **does not** transfer Paradox ownership or original module identity.

Before shipping: obtain the complete installed Dice Improvements module ZIP including its original `module.json`, confirm its exact ID and current version, compare existing hooks and CSS to avoid duplicates, and test together with Player Actions, Paradox, Dice So Nice, Foundry v14 and WoD20. No live verification has been done.

To protect the current installation, back up `Z:\Data\modules\<actual-module-folder>` and relevant world data before future deployment. Do not copy this source-only repository over the installed module.

Only the Paradox thread (09) should eventually remove its generic styling, after coordinated integration tests. Do not change `wod20-paradox.result` flags, its `createChatMessage` listener, or Paradox Actor updates here.

Smoke tests for future release: positive/zero/botch rolls in dark and light themes; ordinary and magick native chat messages; Paradox once-only addition; owner and GM behavior; Dice So Nice; page refresh/re-render. Roll detection currently recognizes the English `Successes:` label, so localization remains unverified.

Testing status: JavaScript syntax and local mock checks; **not** tested in Foundry. Version/release tag is deliberately not assigned.
