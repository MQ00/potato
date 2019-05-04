const user32 = require('../utils/user32');
const keyCodes = require('../utils/keymap');
const config = require('../../config');
const {exec} = require('child_process');
const tasklist = require('tasklist');
const taskkill = require('taskkill');

function launch() {
  tasklist().then(tasks => {
    for (let task of tasks) {
      if (task.imageName === 'eqgame.exe') {
        console.log(task);
        (async () => {
          await taskkill([task.pid]);
        })();
      }
    }
    exec('launch.bat');
    (async () => {
      await user32.sleep(20000);
      await user32.keyTap('TAB');
      await user32.sleep(1000);
      await user32.keyTap('RETURN');
      await user32.sleep(1000);
      await user32.keyTap('RETURN');
      await user32.sleep(1000);
      await user32.keyTap('RETURN');
      await user32.sleep(2000);
      const pw = config.user.password;
      for (let char of pw) {
        let rawcode = keyCodes.characterMap[char];
        await user32.keyTap(rawcode);
        await user32.sleep(300);
      }
      await user32.keyTap('RETURN');
      await user32.sleep(10000);
      await user32.keyTap('RETURN');
    })();
  });
}

module.exports = {
  launch: launch
};