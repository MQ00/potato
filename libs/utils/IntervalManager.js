class IntervalManager {
  constructor(){
    if(!IntervalManager.instance){
      this._intervals = {};
      IntervalManager.instance = this;
    }

    return IntervalManager.instance;
  }

  setInterval(name, func, delay){
    this._intervals[name] = setInterval(func, delay);
  }

  clearInterval(name){
    clearInterval(this._intervals[name]);
  }

  getInterval(name) {
    return this._intervals[name] && this._intervals[name]._idleTimeout > -1;
  }

  clearAllIntervals() {
    this._intervals = {};
  }
}

const instance = new IntervalManager();
Object.freeze(instance);

module.exports = instance;