const ffi = require('ffi');
const struct = require('ref-struct');
const arch = require("os").arch();
const keyCodes = require('./keymap');

let Input = struct({
  "type": "int",
  "???": "int",
  "wVK": "short",
  "wScan": "short",
  "dwFlags": "int",
  "time": "int",
  "dwExtraInfo": "int64"
});

const user32 = ffi.Library("user32", {
  SendInput: ["int", ["int", Input, "int"]]
});

const INPUT_KEYBOARD = 1;
const KEYEVENTF_KEYUP = 0x0002;
const KEYEVENTF_SCANCODE = 0x0008;

function KeyToggle(key, type) {
  let entry = new Input();
  entry.type = INPUT_KEYBOARD;
  entry.time = 0;
  entry.dwExtraInfo = 0;

  entry.dwFlags = type === "down" ? KEYEVENTF_SCANCODE : KEYEVENTF_SCANCODE | KEYEVENTF_KEYUP;
  entry.wVK = 0;
  entry.wScan = keyCodes.scanCodes[key];

  user32.SendInput(1, entry, arch === "x64" ? 40 : 28);
}

async function KeyTap(key) {
  KeyToggle(key, "down");
  await sleep(25);
  KeyToggle(key, "up");
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  keyToggle: KeyToggle,
  keyTap: KeyTap,
  sleep: sleep
};
