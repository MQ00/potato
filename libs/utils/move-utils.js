const user32 = require('./user32');
const redisUtils = require('./redis-utils');

const EQMemory = require('../e-cue/structs');
let eq = EQMemory.instance;

async function stick(location) {
  let target = location || eq.target;
  let me = eq.charData;

  while (target.id && target.first_name !== me.first_name) {
    await face(location);
    await moveToTarget(location);
  }
}

// CANT HOLD W IF YOU'RE FACING THE SAME FUCKING DIRECTION IDIOT
async function moveToTarget(location, r) {
  let range = r || 10;
  let me = eq.charData;
  let target = location || eq.target;
  let distanceToTarget = getDistance(me, target);

  if (distanceToTarget > range) {
    await user32.keyTap('W');
  }
}

async function face(location) {
  let me = eq.charData;
  let target = location || eq.target;

  let heading = getHeading(me, target);
  if (heading < -15 || heading > 260) {
    while (heading < -15 || heading > 260) {
      await user32.keyTap('D');
      heading = getHeading(me, target);
    }
  }
  if (heading > 15 && heading <= 260) {
    while (heading > 15 && heading <= 260) {
      await user32.keyTap('A');
      heading = getHeading(me, target);
    }
  }
}

function getDistance(me, target) {
  return Math.sqrt(
    Math.pow((me.loc_x - target.loc_x), 2) +
    Math.pow((me.loc_y - target.loc_y), 2) +
    Math.pow((me.loc_z - target.loc_z), 2)
  );
}

function getTarget(targetId, targetName) {
  if (!targetId && !targetName) {
    return eq.target.first_name;
  }
  for (let spawn of eq.spawnInfoList.all()) {
    if (spawn.id === targetId || spawn.first_name === targetName) {
      redisUtils.log(`Targeting '${spawn.first_name}`);
      eq.target = spawn;
    }
  }
}

function getHeading(me, target) {
  let distToTarget = getDistance(me, target);
  let angle = me.heading;

  if (target.loc_y - me.loc_y > 0) {
    angle = 128 - (Math.asin((target.loc_x - me.loc_x) / distToTarget) * 256.0 / Math.PI);
  } else if (target.loc_y - me.loc_y < 0) {
    angle = 384 + (Math.asin((target.loc_x - me.loc_x) / distToTarget) * 256.0 / Math.PI);
  }

  return angle - me.heading;
}

async function moveBackToCamp(camp) {
  // Move Back to Camp
  let me = eq.charData;
  let distanceToCamp = getDistance(me, camp);
  if (distanceToCamp > 10) {
    redisUtils.log('Too far outside of camp, moving back');
    while (distanceToCamp > 2) {
      await face(camp);
      await moveToTarget(camp, 2);
      me = eq.charData;
      distanceToCamp = getDistance(me, camp);
      redisUtils.log('Distance to Camp: ' + distanceToCamp);
    }
  } else {
    redisUtils.log('In Camp');
  }
}

module.exports = {
  stick: stick,
  face: face,
  moveToTarget: moveToTarget,
  getDistance: getDistance,
  getTarget: getTarget,
  moveBackToCamp: moveBackToCamp
};
