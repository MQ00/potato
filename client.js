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

const myClass = classes[eq.charData.class].toLowerCase();

if (classes.channelClasses.melee.includes(myClass)) {
    subscriber.subscribe('MELEE');
}

if (classes.channelClasses.caster.includes(myClass)) {
    subscriber.subscribe('CASTER');
}

if (classes.channelClasses.healer.includes(myClass)) {
    subscriber.subscribe('HEALER');
}

subscriber.subscribe(myClass.toUpperCase());
subscriber.subscribe(eq.charData.first_name);
subscriber.subscribe('LAUNCH');

subscriber.on('message', (channel, m) => {
    let message = JSON.parse(m); // This should always be a JSON string
    if (channel === 'LAUNCH') {
        launch.launch();
    } else {
        setTimeout(async () => {
            await user32.keyTap(message.key);
        }, Math.floor(Math.random() * Math.floor(message.random)));
    }
});
