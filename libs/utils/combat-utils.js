const redisUtils = require('./redis-utils');
const IntervalManager = require('./IntervalManager');
const EQMemory = require('../e-cue/structs');
const user32 = require('./user32');
let eq = EQMemory.instance;


function toggleBash() {
  if (!IntervalManager.getInterval('bash')) {
    redisUtils.log('Bash On');
    IntervalManager.setInterval('bash', async () => {
      redisUtils.log('BASH!');
      await user32.keyTap('3');
    }, 7800);
  } else {
    redisUtils.log('Bash Off');
    IntervalManager.clearInterval('bash');
  }
}

function toggleTaunt() {
  if (!IntervalManager.getInterval('taunt')) {
    redisUtils.log('Taunt On');
    IntervalManager.setInterval('taunt', async () => {
      redisUtils.log('Taunt!');
      await user32.keyTap('4');
    }, 6500);
  } else {
    redisUtils.log('Taunt Off');
    IntervalManager.clearInterval('taunt');
  }
}

function toggleSnare() {
  if (!IntervalManager.getInterval('snare')) {
    redisUtils.log('Snare On');
    IntervalManager.setInterval('snare', async () => {
      if (eq.target.id && eq.target.current_health < 90) {
        redisUtils.log('Snaring');
        await user32.keyTap('5');
      }
    }, 15000);
  } else {
    redisUtils.log('Snare Off');
    IntervalManager.clearInterval('snare');
  }
}

function toggleCombatAbilities() {
  toggleTaunt();
  toggleBash();
  toggleSnare();
}


module.exports = {
  toggleSnare: toggleSnare,
  toggleTaunt: toggleTaunt,
  toggleBash: toggleBash,
  toggleCombatAbilities: toggleCombatAbilities
};