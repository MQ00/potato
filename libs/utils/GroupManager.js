const user32 = require('./user32');
const classes = require('../e-cue/classes');

const EQMemory = require('../e-cue/structs');
let eq = EQMemory.instance;

class Group {
  constructor(){
    if(!Group.instance){
      this._group = [];
      this._healers = [];
      Group.instance = this;
    }

    return Group.instance;
  }

  async setInitialGroup(){
    this._group.length = 0;
    for (let i = 1; i < 7; i++) {
      await user32.keyTap('F' + i);
      console.log('Adding ' + eq.target.first_name + ' to the group');
      this._group.push(eq.target);
    }

    this.createHealerIndexes();
    console.log(this._healers);
  }

  // For each healer in the initial group, a separate index list is created so their FKEYS are accurate
  createHealerIndexes() {
    console.log('Adding Healer Indexes');
    for (let index = 0; index < this._group.length; index++) {
      if(classes.channelClasses.healer.includes(classes.classList[this._group[index].class].toLowerCase())) {
        console.log('Constructing Index for', this._group[index].first_name);
        let healerObj = {
          name: this._group[index].first_name,
          list: [2, null, null, null, null, null]
        };
        healerObj.list[index] = 1;  // F1 is always the client themselves
        for (let j = 1; j < this._group.length; j++) {
          if (j !== index) {
            healerObj.list[j] = j < index ? j+2 : j+1
          }
        }
        this._healers.push(healerObj)
      }
    }
  };

  addToGroup() {
    this._group.push(eq.target);
  }

  getGroup(){
    return this._group;
  }

  getHealers() {
    return this._healers;
  }
}

const instance = new Group();
Object.freeze(instance);

module.exports = instance;