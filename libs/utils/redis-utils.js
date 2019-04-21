const config = require('../../config.json');
const Redis = require('ioredis');
const publisher = new Redis({host: config.redis.host, port: config.redis.port});

const user32 = require('./user32');
const keyCodes = require('./keymap');

function publishKey(key, delay, channel) {
  let chan = channel || 'NULL';
  let random = delay || 0;
  log(`Publishing to ${chan} - ${JSON.stringify({key: key, random: random})}`);
  publish(chan, JSON.stringify({key: key, random: random}));
}

async function publishKeySequence(str, channel, returnTermination) {
  for (let i = 0; i < str.length; i++) {
    let rawcode = keyCodes.characterMap[str.charAt(i).toLowerCase()];
    publishKey(rawcode, 0, channel);
    await user32.sleep(150);
  }
  if (returnTermination) {
    publishKey('RETURN', 0, channel);
  }
}

function publish(channel, message) {
  publisher.publish(channel, message);
}

function log(msg) {
  publish('LOG', JSON.stringify({timestamp: new Date().toLocaleTimeString(),log: (msg)}));
}

module.exports = {
  publishKey: publishKey,
  publishKeySequence: publishKeySequence,
  publish: publish,
  log: log
};