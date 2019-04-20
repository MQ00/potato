const user32 = require('./user32');
const moveUtils = require('./move-utils');
const EQMemory = require('../e-cue/structs');
const redisUtils = require('./redis-utils');
let eq = EQMemory.instance;
const config = require('../../config');

// TODO:  Include Group List
const whitelist = config.user.whitelist || [];

async function findTarget(r) {
  let radius = r || 200;
  redisUtils.log(`Finding target within ${radius} units`);
  let me = eq.charData;
  let target = eq.target;
  if (!isValidTarget()){
    eq.target = 0;
  }
  let distance = target ? moveUtils.getDistance(me, target) : undefined;
  while (!target || !target.id) {
    for (let spawn of eq.spawnInfoList.all()) {
      distance = moveUtils.getDistance(me, spawn);
      if (distance < radius && isValidTarget(spawn)) {
        eq.target = spawn;
        redisUtils.log('Target Found: ' + eq.target.first_name + ' : ' + eq.target.id);
        return;
      }
    }
  }
}

function isValidTarget(spawn) {
  let target = spawn || eq.target;
  let possiblePet;
  if (target.last_name.includes('Pet')) {
    possiblePet = target.last_name.split("'")[0];
  }
  // target.type is a boolean - 0=Player, 1=NPC
  // TODO:  PC pets only in the future, use ignorelist for contains
  return !(!target.type || whitelist.includes(target.first_name) || possiblePet || target.id === eq.charData.id);
}

async function pullTarget(range, key) {
  let me = eq.charData;
  let target = eq.target;
  let pullKey = key || '5';  // Default pull key (spell hotkey) to 5 because that's what mine is!
  let pullRange = range || 200; // Defaulting pull range to 200 because that's beyond the range of most spells.
  redisUtils.log('Pulling ' + target.first_name);
  let distance = moveUtils.getDistance(me, target);
  let pulled = false;
  while (distance > 30) { // While mob is not fully in camp
    if (distance > pullRange) { // Something went wrong, mob ran out of range during cast, or out of LOS, or something.
      redisUtils.log('Pull failed - restart!');
      await user32.keyTap('ESCAPE');
      return;
    }

    // TODO:  This hackjob can be resolved if we have target's target or agro info.
    if (!pulled) { // Press pull key a lot
      await user32.keyTap(pullKey);
      await user32.sleep(500);
      await user32.keyTap(pullKey);
      await user32.sleep(500);
      await user32.keyTap(pullKey);
      await user32.sleep(500);
      await user32.keyTap(pullKey);
      await user32.sleep(500);
      await user32.keyTap(pullKey);
      pulled = true;
    }
    me = eq.charData;
    target = eq.target;
    distance = moveUtils.getDistance(me, target);
  }
}

async function mezAdds(assistKey, range, mezKey, castDelay) {
  redisUtils.log('Starting to Mez Adds');
  await user32.keyTap(assistKey); // Get groups current fight target
  whitelist.push(eq.target.first_name); // whitelist it
  redisUtils.log('Whitelisted : ' + whitelist);
  let radius = range || 25;
  redisUtils.log(`Looking for adds within ${radius} units`);
  let me = eq.charData;
  let target = eq.target;
  for (let spawn of eq.spawnInfoList.all()) {
    let distance = moveUtils.getDistance(me, spawn);
    redisUtils.log(`Distance to ${spawn.first_name} is ${distance} units`);
    if (distance < range && isValidTarget(spawn)) {
      eq.target = spawn;
      redisUtils.log(`Mezzing Target: ${eq.target.first_name}: ${eq.target.id}`);
      await user32.keyTap(mezKey);
      await user32.sleep(castDelay);
    }
  }

}

module.exports = {
  pullTarget: pullTarget,
  findTarget: findTarget,
  mezAdds: mezAdds
};
