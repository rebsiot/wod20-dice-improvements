/* Reference-only extraction of the generic result formatter from the
 * user-supplied wod20-paradox/paradox.js (2026-10-15).
 * Not registered as a hook until the original Dice Improvements source is recovered.
 */
export function formatWoD20RollResult(html) {
  const successArea = html.querySelector(".wod20-roll .tray-success-area");
  if (successArea) {
    successArea.classList.remove("wod20-result-success", "wod20-result-zero");
    const hasDanger = !!successArea.querySelector(".danger");
    if (!hasDanger) {
      const text = successArea.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const match = text.match(/Successes:\s*(-?\d+)/i);
      if (match) {
        const successes = Number(match[1]);
        if (successes > 0) {
          successArea.classList.add("wod20-result-success");
        } else {
          successArea.classList.add("wod20-result-zero");
        }
      }
    }
  }
}
