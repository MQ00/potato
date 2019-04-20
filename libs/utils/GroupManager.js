const user32 = require('./user32');
const EQMemory = require('../e-cue/structs');
let eq = EQMemory.instance;

class Group {
  constructor(){
    if(!Group.instance){
      this._group = [];
      Group.instance = this;
    }

    return Group.instance;
  }

  async setGroup(){
    this._group.length = 0;
    await user32.keyTap('F1');
    this._group.push(eq.target);
    await user32.keyTap('F2');
    this._group.push(eq.target);
    await user32.keyTap('F3');
    this._group.push(eq.target);
    await user32.keyTap('F4');
    this._group.push(eq.target);
    await user32.keyTap('F5');
    this._group.push(eq.target);
    await user32.keyTap('F6');
    this._group.push(eq.target);
  }

  getGroup(){
    return this._group;
  }
}

const instance = new Group();
Object.freeze(instance);

module.exports = instance;