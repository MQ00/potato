// Client is dumber than dogshit now, leaving out moveUtils

// Input stuff
const user32 = require('./libs/utils/user32');
const classes = require('./libs/e-cue/classes');
const launch = require('./libs/launch/launch');

// EQ Data from Memory
const EQMemory = require('./libs/e-cue/structs');
let eq = EQMemory.instance;

// Redis Stuff
const config = require('./config.json');
const Redis = require('ioredis');
const subscriber = new Redis({host: config.redis.host, port: config.redis.port});

const channelClasses = {
  healer: ['cleric', 'shaman', 'druid'],
  melee: ['bard', 'monk', 'rogue', 'warrior', 'ranger', 'paladin', 'shadow knight'],
  caster: ['enchanter', 'magician', 'necromancer', 'wizard'],
};

const myClass = classes[eq.charData.class].toLowerCase();

subscriber.subscribe('MELEE');
subscriber.subscribe('CASTER');
subscriber.subscribe('HEALER');
subscriber.subscribe('CLERIC');
subscriber.subscribe('ENCHANTER');
subscriber.subscribe('MAGICIAN');
subscriber.subscribe('BARD');
subscriber.subscribe('DRUID');
subscriber.subscribe('LAUNCH');

subscriber.on('message', (channel, m) => {
  let chan = channel.toLowerCase();
  let message = JSON.parse(m); // This should always be a JSON string
  if (channel === 'LAUNCH') {
    launch.launch();
  }
  else if (myClass === chan || (channelClasses[chan] && channelClasses[chan].includes(myClass))) {
    setTimeout(async () => {
      await user32.keyTap(message.key);
    }, Math.floor(Math.random() * Math.floor(message.random)));
  }
});
