import assert from "node:assert/strict";
import { applyRollSpeakerAccent } from "../src/speaker-accent.js";

// Standalone DOM-shaped mock checks; not a live Foundry client test.
function makeRoot(hasRoll = true) {
    const vars = new Map();
    const classes = new Set(["message"]);
    const roll = {closest: (s) => s === ".message" ? root : null};
    const root = {
        matches: s => s === ".message",
        querySelector: s => (s === ".wod20-roll .tray-roll-area" && hasRoll) ? roll : null,
        style: {setProperty: (k,v) => vars.set(k,v)},
        classList: {add: x => classes.add(x)}
    };
    return {root, vars, classes};
}

const color = "#5D81C4";
globalThis.game = {users: new Map([["player", {color}]])};

{
    const x = makeRoot();
    applyRollSpeakerAccent({author: {color}, user: "player"}, x.root);
    assert.equal(x.vars.get("--wod20-roll-player-color"), color);
    assert(x.classes.has("wod20-roll-player-accent"));
}
{
    const x = makeRoot();
    applyRollSpeakerAccent({user: "player"}, x.root);
    assert.equal(x.vars.get("--wod20-roll-player-color"), color, "falls back to Foundry game.users");
}
{
    const x = makeRoot();
    const foundryColor = {toString: () => "#A1B2C3"};
    applyRollSpeakerAccent({author: {color:foundryColor}}, x.root);
    assert.equal(x.vars.get("--wod20-roll-player-color"), "#A1B2C3");
}
{
    const x = makeRoot(false);
    applyRollSpeakerAccent({author: {color}}, x.root);
    assert.equal(x.vars.size, 0, "ordinary text messages are unchanged");
}
{
    const x = makeRoot();
    applyRollSpeakerAccent({author: {color:"red; color: black"}}, x.root);
    assert.equal(x.vars.size, 0, "reject untrusted CSS");
    assert(!x.classes.has("wod20-roll-player-accent"));
}
{
    const x = makeRoot();
    applyRollSpeakerAccent({author: {color:"#000"}}, x.root);
    assert.equal(x.vars.get("--wod20-roll-player-color"), "#000");
}
{
    const x = makeRoot();
    const wrapper = {
        matches: () => false,
        querySelector: s => s === ".wod20-roll .tray-roll-area" ? {closest: k => k === ".message" ? x.root : null} : null
    };
    applyRollSpeakerAccent({author:{color}}, wrapper);
    assert.equal(x.vars.get("--wod20-roll-player-color"), color, "nested render wrapper supported");
}
{
    const x = makeRoot();
    applyRollSpeakerAccent({}, x.root);
    assert.equal(x.vars.size, 0, "no author color: no accent");
}
console.log("Speaker color mock checks passed (8).");
