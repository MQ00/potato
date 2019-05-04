const redisUtils = require('./redis-utils');
const Group = require('./GroupManager');
const IntervalManager = require('./IntervalManager');
const user32 = require('./user32');

// TODO:  Lots of improvements can be made here to make auto heal more robust
// Validate heal target is in range of healer
// Stagger heal instructions across multiple healers
async function autoHeal() {
  for (let member of Group.getGroup()) {
    if ((member.current_health < 75
      || (!Group.getGroup().indexOf(member) // 0 for Tank so have to do different math
        && member.current_health < member.max_health * 0.75))
      && member.id && !member.first_name.includes('corpse')) {
      for (let healer of Group.getHealers()) {
        if (!healer.locked && !Group.isBeingHealed(member.first_name) && healer.spawn.current_mana > 10) {
          console.log(member.first_name + ' needs a heal!');
          Group.addBeingHealed(member.first_name);
          console.log('Being Healed - ' + Group.getBeingHealed());
          console.log('Assigning ' + healer.name + ' to heal ' + member.first_name);
          Group.lockHealer(healer.name);
          if (healer.list[Group.getGroup().indexOf(member)]) {
            redisUtils.publishKey('F' + healer.list[Group.getGroup().indexOf(member)], 0, healer.name);
          } else {
            await redisUtils.publishKeySequence(`/target ${member.first_name}`, healer.name, true);
          }
          redisUtils.publishKey('3', 0, healer.name);
          setTimeout(async () => {
            console.log(member.first_name + ' has been healed');
            Group.removeBeingHealed(member.first_name);
            console.log(healer.name + ' is now available to heal more folks');
            await user32.sleep(1000);
            Group.lockHealer(healer.name);
          }, 5000);
        }
      }
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