/**
 * Apply a restrained chat-speaker accent from the Foundry user who authored
 * a native WoD20 roll. Only presentation is affected; no document writes.
 * Keep this independent of the Actor's ownership: the rolling user is what
 * Foundry identifies by its player color.
 */
export function applyRollSpeakerAccent(message, html) {
    const rollArea = html?.querySelector?.(".wod20-roll .tray-roll-area");
    if (!rollArea) return;

    // In v14 the hook normally receives the chat-message element itself.
    // Also tolerate a descendant/root wrapper supplied by chat extensions.
    const container =
        (html.matches?.(".message") ? html : null) ??
        rollArea.closest?.(".message") ??
        html.querySelector?.(".message") ??
        html.closest?.(".message");

    if (!container?.style?.setProperty || !container.classList?.add) return;

    const authorId = message?.user?.id ?? message?.user;
    const rawColor =
        message?.author?.color ??
        message?.user?.color ??
        game.users?.get?.(authorId)?.color;

    // Foundry's User.color is normally a Color instance; String(color)
    // yields the CSS hex value. Never put arbitrary text in a style value.
    const color = rawColor == null ? "" : String(rawColor).trim();
    if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) return;

    container.style.setProperty("--wod20-roll-player-color", color);
    container.classList.add("wod20-roll-player-accent");
}
