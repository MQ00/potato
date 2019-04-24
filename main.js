const config = require('./config.json');

const user32 = require('./libs/utils/user32');
const keyCodes = require('./libs/utils/keymap');
const combatUtils = require('./libs/utils/combat-utils');
const autos = require('./libs/utils/autos');
const redisUtils = require('./libs/utils/redis-utils');
const buffUtils = require('./libs/utils/buff-utils');
const launch = require('./libs/launch/launch');
const Group = require('./libs/utils/GroupManager');
const IntervalManager = require('./libs/utils/IntervalManager');

const {fork} = require('child_process');

const ioHook = require('iohook');

const Redis = require('ioredis');
const subscriber = new Redis({host: config.redis.host, port: config.redis.port});

// TODO LIST
// Rebuff TANK Specifically - Cleric HP + Symbol, Enchanter Clarity (and Haste?), Mage DS, Druid SoW

// Refactor keymap stuff again
// JS keycode : actual character -  if(lookup(key.rawcode) === 'character') { // do things }
// actual character : scancode - publishkey('character') --> keyTap('character') --> getScanCode('character')

// Add log parsing to unlock new levels of glory
// Process log tail -f, can then dump commands into group chat or whatnot and parse them out !

ioHook.on('keydown', async key => {

  // Toggle AutoHeal  = // Re-get group when toggling on - so its always got correct pointers
  if (key.rawcode === 45) { // INSERT KEY
    if (!Group.getGroup().length || !IntervalManager.getInterval('autoHeal')) {
      await Group.setInitialGroup();
    }
    await autos.toggleAutoHeal();
    await autos.toggleAutoDamageShield();
  }

  /**
   * Primary Group Action Keys - Casual Killing
   */

  // Assist - Pets in, Attack on
  if (key.rawcode === 96) { // Numpad 0
    redisUtils.publishKey('1', 2000, 'CASTER');
    redisUtils.publishKey('1', 0, 'MELEE');
  }

  // Nuke
  if (key.rawcode === 97) { // Numpad 1
    redisUtils.publishKey('3', 0, 'MAGICIAN');
  }

  // Sit
  if (key.rawcode === 98) { // Numpad 2
    redisUtils.publishKey('2', 3000, 'CASTER');
    redisUtils.publishKey('2', 3000, 'HEALER');
  }

  // MONK or Bard
  if (key.rawcode === 99) { // Numpad 3
    redisUtils.publishKey('3', 0, 'BARD');
    redisUtils.publishKey('3', 0, 'MONK');
  }

  // Dots
  if (key.rawcode === 100) { // Numpad 4
    redisUtils.publishKey('4', 2000, 'DRUID');
  }

  // Re-Charm
  if (key.rawcode === 101) { // Numpad 5
    redisUtils.publishKey('4', 0, 'ENCHANTER');
    await user32.sleep(500);
    redisUtils.publishKey('4', 1500, 'MAGICIAN');
  }

  // Mez
  if (key.rawcode === 102) { // Numpad 6
    redisUtils.publishKey('5', 0, 'ENCHANTER');
  }


  // Forward Thinking as this will be a thing in Kunark with Group Aego / Clarity, etc
  if (key.rawcode === 103) { // Numpad 7
    await buffUtils.doGroupBuffs();
    redisUtils.publishKey('5', 500, 'MAGICIAN');
  }

  // Group Clarity
  if (key.rawcode === 104) { // Numpad 8
    await buffUtils.doGroupClarity();
  }

  // Buff Target
  if (key.rawcode === 105) { // Numpad 9
    await buffUtils.buffTarget();
  }

  /**
   * EVERYBODY NUKES!
   */
  if (key.rawcode === 106) { // Numpad *
    redisUtils.publishKey('3', 0, 'MAGICIAN');
    redisUtils.publishKey('4', 0, 'CLERIC');
    redisUtils.publishKey('5', 0, 'DRUID');
  }

  // Heal Target
  if(key.rawcode === 107) { // Numpad +
    redisUtils.publishKey('3', 0, 'CLERIC');
  }

  // Global Assist
  if (key.rawcode === 109) { // Numpad -
    redisUtils.publishKey('1', 2000, 'CASTER');
    redisUtils.publishKey('1', 0, 'MELEE');
    redisUtils.publishKey('1', 0, 'HEALER');
  }

  // HASTE
  if (key.rawcode === 110) { // Numpad .
    // Load Buff Spellset
    redisUtils.publishKey('9', 0, 'ENCHANTER');
    await user32.sleep(9000);

    // Haste
    redisUtils.publishKey('NUMPAD9', 200, 'ENCHANTER');
    await user32.sleep(11000);

  }

  // Add current target to AutoHeal List
  if (key.rawcode === 111) { // Numpad /
    await Group.addToGroup();
  }

  /**
   * Camera Orientation
   */

  // Center Camera
  if (key.rawcode === 35) { // End
    redisUtils.publishKey('END', 1000, 'MELEE');
    redisUtils.publishKey('END', 1000, 'CASTER');
    redisUtils.publishKey('END', 1000, 'HEALER');
  }

  // Look Up
  if (key.rawcode === 33) { // Page Up
    redisUtils.publishKey('PRIOR', 1000, 'MELEE');
    redisUtils.publishKey('PRIOR', 1000, 'CASTER');
    redisUtils.publishKey('PRIOR', 1000, 'HEALER');
  }

  // Look Down
  if (key.rawcode === 34) { // Page Down
    redisUtils.publishKey('NEXT', 1000, 'MELEE');
    redisUtils.publishKey('NEXT', 1000, 'CASTER');
    redisUtils.publishKey('NEXT', 1000, 'HEALER');
  }


  /**
   * Launch EQGame Script
   */

  // Launch / Re-Launch
  if (key.rawcode === 123) { // F12
    launch.launch();
    redisUtils.publish('LAUNCH', JSON.stringify({message: 'LAUNCH'}));
  }

  /**
   * Test Key
   */

  // TEST KEY
  if (key.rawcode === 122) { // F11
    // console.log(eq.charData.toStruct());
    // console.log(eq.target.toStruct());

    // await redisUtils.publishKeySequence('/memspellset gate', 'ENCHANTER', true);

    // // Everybody Bind at the Soulbinder!!
    // await redisUtils.publishKeySequence('/target Soulbinder', 'MELEE', true);
    // await redisUtils.publishKeySequence('/target Soulbinder', 'CASTER', true);
    // await redisUtils.publishKeySequence('/target Soulbinder', 'HEALER', true);
    // user32.sleep(5000);
    //
    // await redisUtils.publishKeySequence('/say bind my soul', 'MELEE', true);
    // await redisUtils.publishKeySequence('/say bind my soul', 'CASTER', true);
    // await redisUtils.publishKeySequence('/say bind my soul', 'HEALER', true);


    // Keep casting a spell to raise skill
    // while (true) {
    //   redisUtils.publishKey('6', 0, 'DRUID');
    //   await user32.sleep(500);
    // }

    let str = '/target forrondyx';
    for (let i = 0; i < str.length; i++) {
      let rawcode = keyCodes.characterMap[str.charAt(i).toLowerCase()];
      await user32.keyTap(rawcode);
      // await user32.sleep(150);
    }
      await user32.keyTap('RETURN');

  }

  /**
   * Full Auto - F7
   */
  // TODO:  Move this code
  if (key.rawcode === 118) { // F7
    await Group.setInitialGroup();
    await autos.toggleAutoHeal();
    // autos.toggleAutoBuffs();  // TODO FIXEROO
    autos.toggleAutoDamageShield();

    // Fork a separate process to handle main combat loop as it is a somewhat necessarily blocking process
    // Could possibly refactor pull-utils and move-utils to be event based and remove while loops
    const forked = fork('./libs/looped-routines/looped-routines.js');
    forked.on('message', (msg) => {
      redisUtils.log(msg);
      switch (msg) {
        case 'Implode':
          IntervalManager.clearAllIntervals();
          process.exit(1);
          // TODO:  Force truebox crash?
          break;
        case 'Combat On':
          user32.keyTap('6'); // Attack on
          combatUtils.toggleCombatAbilities();
          redisUtils.publishKey('1', 2000, 'MELEE');
          redisUtils.publishKey('1', 2000, 'CASTER');
          redisUtils.publishKey('1', 2000, 'HEALER');
          redisUtils.publishKey('4', 1000, 'BARD');
          break;
        case 'Combat Off':
          combatUtils.toggleCombatAbilities();
          user32.keyTap('7'); // Attack off
          redisUtils.publishKey('4', 1000); // Bard Songs Off
          break;
        default:
          break;
      }
    });
    forked.send('Go');
  }
});

ioHook.start(false);

subscriber.subscribe('LOG');

subscriber.on('message', async (channel, m) => {
  let message = JSON.parse(m);
  switch (channel) {
    case 'LOG':
      console.log(`[${message.timestamp}] - ${message.log}`);
      break;
  }
});
