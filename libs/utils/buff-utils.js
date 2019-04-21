const redisUtils = require('./redis-utils');
const user32 = require('./user32');
const moveUtils = require('./move-utils');

async function buffTarget(){
  redisUtils.log('Buffing ' + moveUtils.getTarget());

  // Use assist key to gain the target to buff, don't spam so add delay randoms
  redisUtils.publishKey('1', 100, 'CASTER');
  redisUtils.publishKey('1', 100, 'HEALER');
  await user32.sleep(2000);

  await Promise.all([doEnchanterBuffs(), doClericBuffs(), doMiscBuffs()]);
}

async function doMiscBuffs() {

  redisUtils.publishKey('NUMPAD8', 500, 'MAGICIAN');
  redisUtils.publishKey('NUMPAD8', 500, 'DRUID');

  await user32.sleep(6000);

  redisUtils.publishKey('2', 200, 'MAGICIAN');
  redisUtils.publishKey('2', 2000, 'DRUID');
}

async function doEnchanterBuffs() {

  // Load Buff Spellset
  redisUtils.publishKey('9', 0, 'ENCHANTER');
  await user32.sleep(9000);

  // Clarity
  redisUtils.publishKey('NUMPAD8', 200, 'ENCHANTER');
  await user32.sleep(6000);

  // Haste
  redisUtils.publishKey('NUMPAD9', 200, 'ENCHANTER');
  await user32.sleep(11000);

  // GMR
  redisUtils.publishKey('NUMPAD7', 0, 'ENCHANTER');
  await user32.sleep(8000);

  // Sit
  redisUtils.publishKey('2', 0, 'ENCHANTER');
  await user32.sleep(1000);

  // Load Fight Spell Set
  redisUtils.publishKey('0', 0, 'ENCHANTER');
}

async function doClericBuffs() {

  // Load Buff Spell Sets
  redisUtils.publishKey('9', 0, 'CLERIC');
  await user32.sleep(6000);

  // Base HP
  redisUtils.publishKey('NUMPAD8', 200, 'CLERIC');
  await user32.sleep(7000);

  // Symbol
  redisUtils.publishKey('NUMPAD9', 200, 'CLERIC');
  await user32.sleep(7000);

  // Sit
  redisUtils.publishKey('2', 0, 'CLERIC');
  await user32.sleep(1000);

  // Load Fight Spell Set
  redisUtils.publishKey('0', 0, 'CLERIC');
}

async function doGroupClarity() {
  redisUtils.log('Doing Group Clarity');
  redisUtils.publishKey('9', 1000, 'ENCHANTER');
  await user32.sleep(10000);
  for (let i = 0; i < 6; i++) {
    let fkey = 'F' + (i + 1);
    redisUtils.publishKey(fkey, 0, 'ENCHANTER');
    await user32.sleep(200);
    redisUtils.publishKey('NUMPAD8', 200, 'ENCHANTER');
    await user32.sleep(6000);
  }
  redisUtils.publishKey('2', 200, 'ENCHANTER');
  await user32.sleep(1000);
  redisUtils.publishKey('0', 1000, 'ENCHANTER');
}

// CMON KUUUUNARK!
async function doGroupBuffs() {
  redisUtils.log('Doing Group Buffs');
  await redisUtils.publishKeySequence('/memspellset groupbuffs', 'ENCHANTER', true);
  await redisUtils.publishKeySequence('/memspellset groupbuffs', 'CLERIC', true);
}

module.exports = {
  doGroupClarity: doGroupClarity,
  buffTarget: buffTarget,
  doGroupBuffs: doGroupBuffs
};