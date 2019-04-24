const redisUtils = require('./redis-utils');
const Group = require('./GroupManager');
const user32 = require('./user32');
const IntervalManager = require('./IntervalManager');

// TODO:  Lots of improvements can be made here to make auto heal more robust
// Validate heal target is in range of healer
// Stagger heal instructions across multiple healers
async function autoHeal() {
  for (let member of Group.getGroup()) {
    if ((member.current_health < 75
      || (!Group.getGroup().indexOf(member) // 0 for Tank so have to do different math
        && member.current_health < member.max_health * 0.75))
      && member.id && !member.first_name.includes('corpse')) {
      await toggleAutoHeal();
      for (let healer of Group.getHealers()) {
        if (healer.list[Group.getGroup().indexOf(member)]) {
          redisUtils.publishKey('F' + healer.list[Group.getGroup().indexOf(member)], 0, healer.name);
        } else {
          await redisUtils.publishKeySequence(`/target ${member.first_name}`, healer.name, true);
          redisUtils.publishKey('3', 300, healer.name);
        }
      }
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
    }, 100);
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

module.exports = {
  toggleAutoDamageShield: toggleAutoDamageShield,
  toggleAutoHeal: toggleAutoHeal
};