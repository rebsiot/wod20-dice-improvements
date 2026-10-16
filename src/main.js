/**
 * WoD20 Dice Improvements v0.2.2
 * Native WoD20 roll-result formatting plus transferred Paradox lifecycle.
 */
import { formatWoD20RollResult } from "./roll-result-formatting.js";
import { applyRollSpeakerAccent } from "./speaker-accent.js";
import "./paradox.js";

const MODULE_ID = "wod20-dice-improvements";

Hooks.on("renderChatMessageHTML", (message, html) => {
    if (game.system?.id !== "worldofdarkness") return;

    try {
        formatWoD20RollResult(html);
        applyRollSpeakerAccent(message, html);
    } catch (error) {
        console.error(`${MODULE_ID} | Could not format roll card.`, error);
    }
});
