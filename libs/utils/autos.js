const redisUtils = require('./redis-utils');
const Group = require('./GroupManager');
const user32 = require('./user32');
const config = require('../../config');
const IntervalManager = require('./IntervalManager');

const memberKeyIndexes = config.user.groupMembers;

async function autoHeal() {
  for (let member of Group.getGroup()) {
    if ((member.current_health < 75
      || (member.first_name === memberKeyIndexes[0]
        && member.current_health < member.max_health * 0.75))
        && member.id && !member.first_name.includes('corpse')) { // && moveUtils.getDistance(healer, member) < 100  - do this at some point
      await toggleAutoHeal();
      redisUtils.log('Healing ' + member.first_name);
      let fkey = 'NUMPAD' + memberKeyIndexes.indexOf(member.first_name);
      redisUtils.publishKey(fkey, 0, 'HEALER');
      await user32.sleep(500);
      redisUtils.publishKey('3', 200, 'HEALER');
      await user32.sleep(5000);
      await toggleAutoHeal();
    }
  }
}

async function toggleAutoHeal() {
  if (!IntervalManager.getInterval('autoHeal')) {
    redisUtils.log('Auto Heal Toggled On');
    IntervalManager.setInterval('autoHeal', async () => {
      await autoHeal();
    }, 200);
  } else {
    redisUtils.log('Auto Heal Toggled Off');
    IntervalManager.clearInterval('autoHeal');
  }
}

function toggleAutoDamageShield(toggle, delay) {
  let d = delay || 600000;
  if (!IntervalManager.getInterval('autoDamageShield')) {
    redisUtils.log('Auto Damage Shield On');
    redisUtils.publishKey('5', 0, 'MAGICIAN');
    IntervalManager.setInterval('autoDamageShield', async () => {
      redisUtils.log('Casting Damage Shield');
      redisUtils.publishKey('5', 3000, 'MAGICIAN');
    }, d);
  } else if (!toggle) {
    redisUtils.log('Auto Damage Shield Off');
    IntervalManager.clearInterval('autoDamageShield');
  }
}

function toggleBardMelody() {
  redisUtils.publishKey('4', 0, 'BARD');
}

function toggleAutoMez() {
  if (!IntervalManager.getInterval('autoMez')) {
    redisUtils.log('Auto Mez On');
    IntervalManager.setInterval('autoMez', async () => {
      // Magical Code
    }, 5000);
  } else {
    redisUtils.log('Auto Mez Off');
    IntervalManager.clearInterval('autoMez');
  }
}

function toggleAutoBuffs() {
  if (!IntervalManager.getInterval('autoBuffs')) {
    redisUtils.log('Auto Buffs On');
    doClericBuffs();
    doGroupClarity();
    IntervalManager.setInterval('autoBuffs', async () => {
      doClericBuffs();
      doGroupClarity();
    }, 1200000);
  } else {
    redisUtils.log('Auto Buffs Off');
    IntervalManager.clearInterval('autoBuffs');
  }
}

module.exports = {
  toggleAutoDamageShield: toggleAutoDamageShield,
  toggleAutoHeal: toggleAutoHeal,
  toggleBardMelody: toggleBardMelody,
};