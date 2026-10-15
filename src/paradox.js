/**
 * WoD20 Dice Improvements v0.2.0: Paradox subsystem migrated from user-provided
 * wod20-paradox/paradox.js (2026-10-15). Dice rolls are created by WoD20.
 * Note: the original separate Paradox module must be DISABLED before this one
 * owns Paradox accounting; a runtime guard avoids duplicate processing.
 */
const MODULE_ID = "wod20-dice-improvements";


// ============================================================================
// HELPERS
// ============================================================================


/**
 * Determine whether an Actor is a Mage.
 *
 * Supports:
 * - Legacy WoD20 Mage Actor: actor.type === "Mage"
 * - New PC Actor configured as Mage
 */
function isMageActor(actor) {

    if (!actor) return false;

    const actorType =
        String(actor.type ?? "").toLowerCase();

    const splat =
        String(
            actor.system?.settings?.splat ?? ""
        ).toLowerCase();

    const variantSheet =
        String(
            actor.system?.settings?.variantsheet ?? ""
        ).toLowerCase();


    return (
        actorType === "mage" ||
        splat === "mage" ||
        variantSheet === "mage"
    );
}


/**
 * Resolve the Actor that actually made the roll.
 *
 * Supports:
 * - normal directory Actors
 * - linked tokens
 * - unlinked/synthetic tokens
 */
function getMessageActor(message, result = null) {

    // Foundry's resolved speaker Actor is preferred.
    if (message.speakerActor) {
        return message.speakerActor;
    }


    // Try scene/token.
    const sceneId =
        result?.sceneId ??
        message.speaker?.scene;

    const tokenId =
        result?.tokenId ??
        message.speaker?.token;


    if (sceneId && tokenId) {

        const scene =
            game.scenes.get(sceneId);

        const token =
            scene?.tokens.get(tokenId);

        if (token?.actor) {
            return token.actor;
        }
    }


    // Fall back to directory Actor.
    const actorId =
        result?.actorId ??
        message.speaker?.actor;


    if (actorId) {
        return game.actors.get(actorId);
    }


    return null;
}


/**
 * Get a unified Paradox accessor.
 *
 * NEW PC ACTOR:
 *   Paradox is an embedded Advantage item.
 *
 * LEGACY MAGE ACTOR:
 *   Paradox lives at actor.system.paradox.
 */
function getParadoxData(actor, itemId = null) {

    if (!actor) return null;


    // ========================================================================
    // NEW PC ACTOR / ADVANTAGE ITEM
    // ========================================================================

    let paradoxItem = null;


    if (itemId) {

        paradoxItem =
            actor.items?.get(itemId) ??
            null;

    }


    if (!paradoxItem) {

        paradoxItem =
            actor.api?.getAdvantage?.("paradox") ??
            null;

    }


    if (paradoxItem) {

        return {

            storageType:
                "item",

            itemId:
                paradoxItem.id,

            get current() {
                return Number(
                    paradoxItem.system?.temporary ?? 0
                );
            },

            get max() {
                return Number(
                    paradoxItem.system?.max ?? 20
                );
            },

            async set(value) {

                await paradoxItem.update({
                    "system.temporary": value
                });

            }

        };
    }


    // ========================================================================
    // LEGACY MAGE ACTOR
    // ========================================================================

    if (actor.system?.paradox) {

        return {

            storageType:
                "actor",

            itemId:
                null,

            get current() {
                return Number(
                    actor.system?.paradox?.temporary ?? 0
                );
            },

            get max() {
                return Number(
                    actor.system?.paradox?.max ?? 20
                );
            },

            async set(value) {

                await actor.update({
                    "system.paradox.temporary": value
                });

            }

        };
    }


    return null;
}


/**
 * Can the current Foundry user modify this Actor?
 */
function canResolveParadox(actor) {

    if (!actor) return false;

    return (
        game.user.isGM ||
        actor.isOwner
    );
}


/**
 * Consistent error handling.
 */
function paradoxError(message, error) {

    console.error(
        `${MODULE_ID} | ${message}`,
        error
    );

    ui.notifications.error(
        `WoD20 Paradox: ${message}`
    );
}


// ============================================================================
// PROCESS NEW ARETE CASTS
// ============================================================================

Hooks.on(
    "createChatMessage",
    async (message) => {

        try {

            if (game.modules?.get?.("wod20-paradox")?.active) return;

            // ----------------------------------------------------------------
            // PROCESS ONLY ON THE CLIENT THAT CREATED THE ROLL
            // ----------------------------------------------------------------

            if (!message.isAuthor) return;
            if (message.getFlag(MODULE_ID, "result")) return;


            // ----------------------------------------------------------------
            // WOD20 ONLY
            // ----------------------------------------------------------------

            if (
                game.system.id !==
                "worldofdarkness"
            ) {
                return;
            }


            // ----------------------------------------------------------------
            // ACTOR
            // ----------------------------------------------------------------

            const actor =
                getMessageActor(message);

            if (!actor) return;


            // ----------------------------------------------------------------
            // MAGE CHECK
            // ----------------------------------------------------------------

            if (!isMageActor(actor)) {
                return;
            }


            // ----------------------------------------------------------------
            // IDENTIFY ARETE / MAGICK ROLL
            // ----------------------------------------------------------------

            const magicMarkers = [

                game.i18n.localize(
                    "wod.spheres.coincidentalspell"
                ),

                game.i18n.localize(
                    "wod.spheres.vulgarspell"
                ),

                game.i18n.localize(
                    "wod.spheres.vulgarspellwitness"
                )

            ].filter(Boolean);


            const isMagicRoll =
                magicMarkers.some(
                    marker =>
                        message.content?.includes(marker)
                );


            if (!isMagicRoll) return;


            // ----------------------------------------------------------------
            // PARADOX
            // ----------------------------------------------------------------

            const paradox =
                getParadoxData(actor);


            if (!paradox) {

                console.warn(
                    `${MODULE_ID} | ` +
                    `Could not locate Paradox for ${actor.name}`,
                    actor
                );

                return;
            }


            const currentParadox =
                paradox.current;

            const paradoxMax =
                paradox.max;


            console.log(
                `${MODULE_ID} | ${actor.name}`,
                {
                    actorType:
                        actor.type,

                    paradoxStorage:
                        paradox.storageType,

                    currentParadox,

                    paradoxMax
                }
            );


            // No accumulated Paradox means no Paradox dice.
            if (currentParadox <= 0) {
                return;
            }


            // ----------------------------------------------------------------
            // DICE
            // ----------------------------------------------------------------

            const rolls =
                Array.from(
                    message.rolls ?? []
                );


            if (!rolls.length) return;


            // Number of Paradox dice is current Paradox,
            // capped by the actual dice pool.
            const paradoxDiceCount =
                Math.min(
                    currentParadox,
                    rolls.length
                );


            // First N dice are the Paradox dice.
            const paradoxValues =
                rolls
                    .slice(
                        0,
                        paradoxDiceCount
                    )
                    .map(
                        roll =>
                            Number(roll.total)
                    );


            // Each Paradox die showing 1 generates 1 Paradox.
            const generated =
                paradoxValues.filter(
                    value => value === 1
                ).length;


            console.log(
                `${MODULE_ID} | Roll processed`,
                {
                    actor:
                        actor.name,

                    actorType:
                        actor.type,

                    paradoxStorage:
                        paradox.storageType,

                    currentParadox,

                    paradoxDiceCount,

                    paradoxValues,

                    generated
                }
            );


            // ----------------------------------------------------------------
            // INITIAL RESULT STATUS
            // ----------------------------------------------------------------

            let status =
                "none";


            if (generated > 0) {

                status =
                    currentParadox >= paradoxMax
                        ? "maxed"
                        : "pending";

            }


            // ----------------------------------------------------------------
            // STORE RESULT IN CHAT MESSAGE FLAG
            // ----------------------------------------------------------------

            const result = {

                actorId:
                    actor.id,

                sceneId:
                    message.speaker?.scene ??
                    null,

                tokenId:
                    message.speaker?.token ??
                    null,

                paradoxItemId:
                    paradox.itemId,

                paradoxStorage:
                    paradox.storageType,

                paradoxDice:
                    paradoxDiceCount,

                values:
                    paradoxValues,

                generated,

                before:
                    currentParadox,

                max:
                    paradoxMax,

                status,

                added:
                    0,

                after:
                    currentParadox,

                resolvedBy:
                    null

            };


            await message.setFlag(
                MODULE_ID,
                "result",
                result
            );

        }
        catch (error) {

            paradoxError(
                "Error processing Arete roll.",
                error
            );

        }

    }
);


// ============================================================================
// RENDER CHAT MESSAGE
// ============================================================================

Hooks.on(
    "renderChatMessageHTML",
    (message, html) => {

        try {

            if (game.system?.id !== "worldofdarkness") return;
            if (game.modules?.get?.("wod20-paradox")?.active) return;

            // =================================================================
            // PARADOX DATA
            // =================================================================

            const result =
                message.getFlag(
                    MODULE_ID,
                    "result"
                );


            if (!result) return;


            // ----------------------------------------------------------------
            // IDENTIFY PARADOX DICE
            // ----------------------------------------------------------------

            const dice =
                html.querySelectorAll(
                    ".wod20-roll .wod-svg"
                );


            for (
                let i = 0;
                i < Math.min(
                    result.paradoxDice,
                    dice.length
                );
                i++
            ) {

                dice[i].classList.add(
                    "wod20-paradox-die"
                );

            }


            // ----------------------------------------------------------------
            // NOTHING GENERATED
            //
            // Mark the dice but add no extra UI.
            // ----------------------------------------------------------------

            if (result.generated <= 0) {
                return;
            }


            // ----------------------------------------------------------------
            // CREATE PARADOX RESULT BOX
            // ----------------------------------------------------------------

            let box =
                html.querySelector(
                    ".wod20-paradox-result"
                );


            if (!box) {

                const rollCard =
                    html.querySelector(
                        ".wod20-roll"
                    );


                if (!rollCard) return;


                box =
                    document.createElement(
                        "div"
                    );


                box.classList.add(
                    "wod20-paradox-result"
                );


                rollCard.appendChild(box);

            }


            // ----------------------------------------------------------------
            // CURRENT ACTOR
            // ----------------------------------------------------------------

            const actor =
                getMessageActor(
                    message,
                    result
                );


            const canResolve =
                canResolveParadox(actor);


            // ----------------------------------------------------------------
            // ALREADY ADDED
            // ----------------------------------------------------------------

            if (
                result.status ===
                "added"
            ) {

                box.innerHTML = `
                    <div class="wod20-paradox-final">
                        <strong>Paradox:</strong>
                        +${result.added}
                        (${result.before} → ${result.after})
                    </div>
                `;

                return;

            }


            // ----------------------------------------------------------------
            // IGNORED
            // ----------------------------------------------------------------

            if (
                result.status ===
                "ignored"
            ) {

                box.innerHTML = `
                    <div class="wod20-paradox-final">
                        <strong>Paradox:</strong>
                        ${result.generated}
                        generated — not added
                    </div>
                `;

                return;

            }


            // ----------------------------------------------------------------
            // MAXIMUM
            // ----------------------------------------------------------------

            if (
                result.status ===
                "maxed"
            ) {

                box.innerHTML = `
                    <div class="wod20-paradox-prompt">

                        <div class="wod20-paradox-heading">
                            <strong>
                                Paradox Generated:
                                ${result.generated}
                            </strong>
                        </div>

                        <div>
                            Current Paradox:
                            ${result.before}
                        </div>

                        <div class="wod20-paradox-max">
                            Paradox is already at
                            maximum (${result.max}).
                        </div>

                    </div>
                `;

                return;

            }


            // ----------------------------------------------------------------
            // CURRENTLY RESOLVING
            // ----------------------------------------------------------------

            if (
                result.status ===
                "resolving"
            ) {

                box.innerHTML = `
                    <div class="wod20-paradox-prompt">

                        <div class="wod20-paradox-heading">
                            <strong>
                                Resolving Paradox…
                            </strong>
                        </div>

                    </div>
                `;

                return;

            }


            // ----------------------------------------------------------------
            // READ ONLY
            // ----------------------------------------------------------------

            if (!canResolve) {

                box.innerHTML = `
                    <div class="wod20-paradox-prompt">

                        <div class="wod20-paradox-heading">
                            <strong>
                                Paradox Generated:
                                ${result.generated}
                            </strong>
                        </div>

                        <div>
                            Current Paradox:
                            ${result.before}
                        </div>

                        <div class="wod20-paradox-readonly">
                            Waiting for the Mage's owner
                            or GM to resolve.
                        </div>

                    </div>
                `;

                return;

            }


            // ----------------------------------------------------------------
            // PENDING
            // ----------------------------------------------------------------

            box.innerHTML = `
                <div class="wod20-paradox-prompt">

                    <div class="wod20-paradox-heading">
                        <strong>
                            Paradox Generated:
                            ${result.generated}
                        </strong>
                    </div>

                    <div>
                        Current Paradox:
                        ${result.before}
                    </div>

                    <div class="wod20-paradox-buttons">

                        <button
                            type="button"
                            class="wod20-paradox-add"
                        >
                            Add ${result.generated} Paradox
                        </button>

                        <button
                            type="button"
                            class="wod20-paradox-ignore"
                        >
                            Ignore
                        </button>

                    </div>

                </div>
            `;


            // =================================================================
            // ADD PARADOX
            // =================================================================

            const addButton =
                box.querySelector(
                    ".wod20-paradox-add"
                );


            addButton?.addEventListener(
                "click",
                async event => {

                    event.preventDefault();


                    const buttons =
                        box.querySelectorAll(
                            "button"
                        );


                    buttons.forEach(
                        button =>
                            button.disabled = true
                    );


                    let actorUpdated = false;

                    try {

                        // ----------------------------------------------------
                        // GET FRESH CHAT STATE
                        // ----------------------------------------------------

                        const freshResult =
                            message.getFlag(
                                MODULE_ID,
                                "result"
                            );


                        if (
                            !freshResult ||
                            freshResult.status !==
                                "pending"
                        ) {

                            ui.notifications.warn(
                                "This Paradox event has already been resolved."
                            );

                            return;

                        }


                        // ----------------------------------------------------
                        // MARK RESOLVING
                        // ----------------------------------------------------

                        await message.setFlag(
                            MODULE_ID,
                            "result",
                            {
                                ...freshResult,

                                status:
                                    "resolving",

                                resolvedBy:
                                    game.user.id
                            }
                        );


                        // ----------------------------------------------------
                        // ACTOR
                        // ----------------------------------------------------

                        const currentActor =
                            getMessageActor(
                                message,
                                freshResult
                            );


                        if (!currentActor) {

                            throw new Error(
                                "Could not find the Mage actor."
                            );

                        }


                        if (
                            !canResolveParadox(
                                currentActor
                            )
                        ) {

                            throw new Error(
                                "You do not have permission to modify this Mage."
                            );

                        }


                        // ----------------------------------------------------
                        // PARADOX ACCESSOR
                        //
                        // Works with BOTH:
                        // legacy Mage Actor and new PC Actor.
                        // ----------------------------------------------------

                        const paradox =
                            getParadoxData(
                                currentActor,
                                freshResult.paradoxItemId
                            );


                        if (!paradox) {

                            throw new Error(
                                "Could not locate the Mage's Paradox."
                            );

                        }


                        // ----------------------------------------------------
                        // CURRENT VALUES
                        // ----------------------------------------------------

                        const current =
                            paradox.current;


                        const max =
                            paradox.max;


                        const available =
                            Math.max(
                                0,
                                max - current
                            );


                        const actuallyAdded =
                            Math.min(
                                freshResult.generated,
                                available
                            );


                        const newParadox =
                            current +
                            actuallyAdded;


                        // ----------------------------------------------------
                        // HIT MAX BEFORE BUTTON WAS CLICKED
                        // ----------------------------------------------------

                        if (
                            actuallyAdded <= 0
                        ) {

                            await message.setFlag(
                                MODULE_ID,
                                "result",
                                {
                                    ...freshResult,

                                    status:
                                        "maxed",

                                    before:
                                        current,

                                    after:
                                        current,

                                    added:
                                        0,

                                    max,

                                    resolvedBy:
                                        game.user.id
                                }
                            );

                            return;

                        }


                        // ----------------------------------------------------
                        // ACTUALLY UPDATE PARADOX
                        // ----------------------------------------------------

                        await paradox.set(
                            newParadox
                        );
                        actorUpdated = true;


                        // ----------------------------------------------------
                        // UPDATE CHAT STATE
                        // ----------------------------------------------------

                        await message.setFlag(
                            MODULE_ID,
                            "result",
                            {
                                ...freshResult,

                                status:
                                    "added",

                                before:
                                    current,

                                after:
                                    newParadox,

                                added:
                                    actuallyAdded,

                                max,

                                resolvedBy:
                                    game.user.id
                            }
                        );

                    }
                    catch (error) {

                        paradoxError(
                            "Could not add Paradox.",
                            error
                        );


                        // Restore pending only if no Actor update happened.
                        // Otherwise leave "resolving" for manual review to avoid double-add.
                        if (actorUpdated) {
                            ui.notifications.warn(
                                "Paradox was changed, but the chat card could not be finalized. Contact the GM before retrying."
                            );
                            return;
                        }
                        try {

                            const currentState =
                                message.getFlag(
                                    MODULE_ID,
                                    "result"
                                );


                            if (
                                currentState
                                    ?.status ===
                                "resolving"
                            ) {

                                await message.setFlag(
                                    MODULE_ID,
                                    "result",
                                    {
                                        ...currentState,

                                        status:
                                            "pending",

                                        resolvedBy:
                                            null
                                    }
                                );

                            }

                        }
                        catch (restoreError) {

                            console.error(
                                `${MODULE_ID} | ` +
                                `Could not restore pending state.`,
                                restoreError
                            );

                        }

                    }

                }
            );


            // =================================================================
            // IGNORE PARADOX
            // =================================================================

            const ignoreButton =
                box.querySelector(
                    ".wod20-paradox-ignore"
                );


            ignoreButton?.addEventListener(
                "click",
                async event => {

                    event.preventDefault();


                    const buttons =
                        box.querySelectorAll(
                            "button"
                        );


                    buttons.forEach(
                        button =>
                            button.disabled = true
                    );


                    try {

                        const freshResult =
                            message.getFlag(
                                MODULE_ID,
                                "result"
                            );


                        if (
                            !freshResult ||
                            freshResult.status !==
                                "pending"
                        ) {

                            ui.notifications.warn(
                                "This Paradox event has already been resolved."
                            );

                            return;

                        }


                        await message.setFlag(
                            MODULE_ID,
                            "result",
                            {
                                ...freshResult,

                                status:
                                    "ignored",

                                added:
                                    0,

                                after:
                                    freshResult.before,

                                resolvedBy:
                                    game.user.id
                            }
                        );

                    }
                    catch (error) {

                        paradoxError(
                            "Could not ignore Paradox.",
                            error
                        );

                    }

                }
            );

        }
        catch (error) {

            paradoxError(
                "Error rendering chat card.",
                error
            );

        }

    }
);