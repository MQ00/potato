const moveUtils = require('../utils/move-utils');
const pullUtils = require('../utils/pull-utils');
const user32 = require('../utils/user32');

const EQMemory = require('../e-cue/structs');
let eq = EQMemory.instance;

const config = require('../../config.json');

process.on('message', async (msg) => {
  let campZone = eq.zoneData.name;
  await process.send('Current Zone: ' + eq.zoneData.toStruct().name);

  let camp = {
    loc_x: eq.charData.loc_x,
    loc_y: eq.charData.loc_y,
    loc_z: eq.charData.loc_z
  };
  await process.send('Camp is set: ' + JSON.stringify(camp));
  while (eq.zoneData.name === campZone) {
    process.send('Starting the cycle');

    // TODO:  Do this, conceptually, but better once possible without having to target and math
    // eq.target = eq.spawnInfoList.final(); // Target self6
    // process.send('Current Mana ' + eq.target.current_mana);
    //
    // // Med Up if under 25% of user configured max mana
    // if (eq.target.current_mana < (config.user.maxMana * 0.25)) {
    //   process.send('Mana is under threshold, medding...');
    //   await user32.keyTap('8'); // Make sure I'm standing before I sit
    //   await user32.sleep(500);
    //   await user32.keyTap('2'); // Sit
    //   while (eq.target.current_mana < config.user.maxMana) {
    //     user32.sleep(10000);
    //     process.send('Medding ... ');
    //   }
    //   process.send('Full Mana, ready to rock!');
    //   await user32.keyTap('8');  // Stand
    // }

    await pullUtils.findTarget(100); // Find a valid target within specified radius
    await pullUtils.pullTarget(100, '5'); // Pull target if within range

    await user32.keyTap('8'); // Stand (in case mob was already in camp and not pulled with cast)

    process.send('Attacking ' + eq.target.first_name);
    process.send('Combat On');
    await user32.keyTap('6'); // Attack on#
    await user32.keyTap('6'); // Attack on#
    await user32.keyTap('6'); // Attack on#

    while (eq.target.id && eq.target.id !== eq.charData.id) {
      await moveUtils.face();
      await moveUtils.moveToTarget();
    }

    process.send('Target Evaporated');
    process.send('Combat Off');
    await user32.keyTap('7'); // Attack off
    await user32.keyTap('7'); // Attack off
    await user32.keyTap('7'); // Attack off

    await moveUtils.moveBackToCamp(camp);

    // TODO:  Improve this.
    process.send('Reorientating');
    await user32.keyTap('2'); // Sit
    // let eric = moveUtils.getTarget(null, 'Eric');
    // me = eq.charData;
    // while (me.heading > eric.heading + 10 || me.heading < eric.heading - 10) {
    //   await user32.keyTap(.A);
    // }
  }
  process.send(eq.zoneData.toStruct().name);
  process.send('Implode');
  throw new Error('Zone changed, did I die?  Probably...');
});
