import assert from "node:assert/strict";

// Mock-only verification of native WoD20-shaped messages, not a live Foundry test.
const hooks = new Map();
globalThis.Hooks = {on: (event, fn) => hooks.set(event,[...(hooks.get(event)??[]),fn])};
globalThis.ui = {notifications:{error(){},warn(){}}};
globalThis.game = {
 system:{id:"worldofdarkness"},user:{id:"test",isGM:true},
 modules:new Map([["wod20-paradox",{active:false}]]),
 i18n:{localize:key=>({"wod.spheres.coincidentalspell":"Coincidental Spell",
 "wod.spheres.vulgarspell":"Vulgar Spell",
 "wod.spheres.vulgarspellwitness":"Vulgar Spell with Witnesses"})[key]??key},
 scenes:{get:()=>null},actors:{get:()=>null}
};
await import("../src/paradox.js");
const create=hooks.get("createChatMessage")[0];
const render=hooks.get("renderChatMessageHTML")[0];
const scope="wod20-dice-improvements";
function mage(pc=false) {
 const a={id:"mage",name:"Example Mage",type:pc?"PC":"Mage",isOwner:true,
 system:pc?{settings:{splat:"Mage"}}:{paradox:{temporary:2,max:20}},
 async update(x){this.system.paradox.temporary=x["system.paradox.temporary"];}};
 if(pc){const item={id:"paradox",system:{temporary:2,max:20},
 async update(x){this.system.temporary=x["system.temporary"];}};a.api={getAdvantage:k=>k==="paradox"?item:null};a.items={get:k=>k==="paradox"?item:null};}
 return a;
}
function message(actor,faces=[1,8,1],content="Coincidental Spell") {
 const flags=new Map();
 return {isAuthor:true,speakerActor:actor,speaker:{actor:actor.id},
 content,rolls:faces.map(total=>({total,terms:[{results:[{result:total}]}]})),
 getFlag:(id,key)=>flags.get(id+":"+key),
 async setFlag(id,key,value){flags.set(id+":"+key,structuredClone(value));}};
}
function card(n=3) {
 const dice=Array.from({length:n},()=>({set:new Set(),classList:null}));
 dice.forEach(d=>d.classList={add:x=>d.set.add(x)});
 const buttons={};
 const box={classList:{add(){}},innerHTML:"",querySelector(k){
 if(!this.innerHTML.includes(k.slice(1)))return null;
 if(!buttons[k])buttons[k]={disabled:false,addEventListener(_event,fn){this.action=fn;},
 async click(){await this.action({preventDefault(){}});}};
 return buttons[k];},querySelectorAll:()=>Object.values(buttons)};
 let added=false;
 globalThis.document={createElement:()=>box};
 const root={querySelector:k=>k===".wod20-roll"?{appendChild(){added=true;}}:
 (k===".wod20-paradox-result"&&added?box:null),
 querySelectorAll:k=>k===".wod20-roll .wod-svg"?dice:[]};
 return {dice,box,buttons,root};
}
let actor=mage();let msg=message(actor);
await create(msg);
assert.equal(msg.getFlag(scope,"result").paradoxDice,2);
assert.deepEqual(msg.getFlag(scope,"result").values,[1,8]);
assert.equal(msg.getFlag(scope,"result").generated,1);
let html=card();render(msg,html.root);
assert(html.dice[0].set.has("wod20-paradox-die"));
assert(html.dice[1].set.has("wod20-paradox-die"));
assert(!html.dice[2].set.has("wod20-paradox-die"));
await html.buttons[".wod20-paradox-add"].click();
assert.equal(actor.system.paradox.temporary,3);
assert.equal(msg.getFlag(scope,"result").status,"added");
await html.buttons[".wod20-paradox-add"].click();
assert.equal(actor.system.paradox.temporary,3,"do not add twice");
actor=mage(true);msg=message(actor);
await create(msg);html=card();render(msg,html.root);
await html.buttons[".wod20-paradox-ignore"].click();
assert.equal(actor.api.getAdvantage("paradox").system.temporary,2);
assert.equal(msg.getFlag(scope,"result").status,"ignored");
actor=mage(true);msg=message(actor);
await create(msg);html=card();render(msg,html.root);
await html.buttons[".wod20-paradox-add"].click();
assert.equal(actor.api.getAdvantage("paradox").system.temporary,3);
game.modules.get("wod20-paradox").active=true;
actor=mage();msg=message(actor);await create(msg);
assert.equal(msg.getFlag(scope,"result"),undefined,"skip if original module active");
game.modules.get("wod20-paradox").active=false;
actor=mage();msg=message(actor,[1,8],"Ordinary attack");
await create(msg);assert.equal(msg.getFlag(scope,"result"),undefined);
console.log("Paradox die marking, Add/Ignore, PC/legacy Mage and old-module guards passed.");
