import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Static packaging/style guard; browser layout is checked separately.
const manifest = JSON.parse(readFileSync(new URL("../module.json", import.meta.url), "utf8"));
const css = readFileSync(new URL("../styles/compact-roll-cards.css", import.meta.url), "utf8");

assert.equal(manifest.id, "wod20-dice-improvements");
assert.equal(manifest.styles.at(-1), "styles/compact-roll-cards.css", "compact CSS must override the base/Paradox styles");
assert(css.includes(".message:has(.wod20-roll .tray-roll-area)"), "only style dice-roll chat messages");
assert(css.includes(".tray-info-area > .tray-action-area"), "keep pool and difficulty compact");
assert(css.includes(".tray-success-area"), "preserve visible result tray");
assert(css.includes("img.wod-svg"), "resize native WoD20 SVG dice without changing their order");
assert(css.includes("width: 45px !important"), "45px dice remain comfortably readable");
assert(css.includes("font-size: 19px !important"), "roll titles are larger");
assert(css.includes("font-size: 18px"), "success and failure text are larger");
assert(css.includes(".message-header .message-sender"), "speaker name tint is scoped to message header");
assert(css.includes("--wod20-roll-player-color"), "Foundry user's accent color is available");
assert(css.includes("color-mix(in srgb"), "player color is blended subtly with neutral text");
assert(css.includes(".wod20-paradox-buttons button"), "Paradox controls must be accounted for");
assert(!/\bdisplay\s*:\s*none\b/.test(css), "no hidden content");
assert(!/\bvisibility\s*:\s*hidden\b/.test(css), "no hidden content");
assert(!/\bfilter\s*:/.test(css), "Paradox die grayscale filter must not be overridden");

console.log("Compact roll stylesheet and packaging checks passed.");
