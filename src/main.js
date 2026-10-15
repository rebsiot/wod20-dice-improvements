/**
 * WoD20 Dice Improvements v0.1.0
 * Presentation-only Foundry module. No roll or Paradox processing.
 */
import { formatWoD20RollResult } from "./roll-result-formatting.js";

const MODULE_ID = "wod20-dice-improvements";

Hooks.on("renderChatMessageHTML", (_message, html) => {
    if (game.system?.id !== "worldofdarkness") return;

    try {
        formatWoD20RollResult(html);
    } catch (error) {
        console.error(`${MODULE_ID} | Could not format roll card.`, error);
    }
});
