const user32 = require('./user32');
const classes = require('../e-cue/classes');

const EQMemory = require('../e-cue/structs');
let eq = EQMemory.instance;

class Group {
  constructor(){
    if(!Group.instance){
      this._group = [];
      this._healers = [];
      this._beingHealed = [];
      Group.instance = this;
    }

    return Group.instance;
  }

  async setInitialGroup(){
    this._group.length = 0;
    this._healers.length = 0;
    for (let i = 1; i < 7; i++) {
      await user32.keyTap('F' + i);
      if (eq.target.id && !this._group.includes(eq.target.first_name)) {
        console.log('Adding ' + eq.target.first_name + ' to the group');
        this._group.push(eq.target);
      }
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
          spawn: this._group[index],
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
    console.log('Adding ' + eq.target.first_name + ' to Group');
    this._group.push(eq.target);
  }

  getGroup(){
    return this._group;
  }

  getGroupList() {
    for (let member of this._group) {
      console.log(member.first_name);
    }
  }

  lockHealer(name) {
    const healerIndex = this._healers.findIndex((healer) => {
      return healer.name === name;
    });
    this._healers[healerIndex].locked = !this._healers[healerIndex].locked;
  }

  getHealers() {
    return this._healers;
  }

  addHealer() {
    console.log('Adding ' + eq.target.first_name + ' as a Healer');
    this._healers.push({name: eq.target.first_name, list: []});
  }

  addBeingHealed(name) {
    this._beingHealed.push(name);
  }

  getBeingHealed() {
    return this._beingHealed;
  }

  isBeingHealed(name) {
    return this._beingHealed.indexOf(name) > -1;
  }

  removeBeingHealed(name) {
    this._beingHealed.splice(this._beingHealed.indexOf(name), 1);
  }
}

const instance = new Group();
Object.freeze(instance);

module.exports = instance;