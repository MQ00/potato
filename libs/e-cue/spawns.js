const EventEmitter = require('events');


const SpawnInfoHeader = [
  '_rVtable', '_rPrev', '_rNext', '_rList'
];


class Spawns extends EventEmitter {

  constructor(spawnInfoList) {
    super();

    // the values for _rFirst and _rFinal will be
    // changing frequently, always get them fresh
    this.spawnInfoList = spawnInfoList;
    this.spawnInfoList.read_once = false;

    this.initData();

    this.update_interval = 100;
    this._update_timeout = setTimeout(() => this.update(), this.update_interval);
  }


  /** init (or reset) our internal data map and notify */
  initData() {
    let $data = new Map();

    for (let spawn of this.spawnInfoList.all(false)) {
      let _sSpawn = spawn.toStruct({without: SpawnInfoHeader})
        , _jSpawn = JSON.stringify(_sSpawn);

      $data.set(spawn.id, {
        hash: _jSpawn,
        seen: true,
        data: _sSpawn,
      });
    }

    this.$data = $data;
  }


  update() {
    let $data = this.$data;

    // mark everything as unseen for potential removal
    for (let [id, spawn] of $data) {
      spawn.seen = false;
    }


    // collect up changes to fire events after walking the list
    let changed = []
      , created = [];

    for (let spawn of this.spawnInfoList.all(false)) {
      let _sSpawn = spawn.toStruct({without: SpawnInfoHeader})
        , _jSpawn = JSON.stringify(_sSpawn)
        , _dSpawn = $data.get(spawn.id);

      if (_dSpawn) {
        if (_dSpawn.hash != _jSpawn) {
          changed.push([_dSpawn, _sSpawn]);
        }
      } else {
        created.push(_sSpawn);
      }

      $data.set(spawn.id, {
        hash: _jSpawn,
        seen: true,
        data: _sSpawn,
      });
    }

    let removed = Array.from($data.entries()).filter(([k, v]) => !v.seen);

    for (let [key, val] of removed) {
      $data.delete(key);
    }

    this.$data = $data;
    this._update_timeout = setTimeout(() => this.update(), this.update_interval);

    for (let spawn of created) {
      this.emit('create-spawn', spawn);
    }

    for (let [oldSpawn, newSpawn] of changed) {
      this.emit('update-spawn', oldSpawn, newSpawn);
    }

    for (let [id, spawn] of removed) {
      this.emit('remove-spawn', spawn.data);
    }
  }

  allSpawns() {
    let list = Array.from(this.$data.values()).map(k => k.data);
    this.emit('spawn-list', list);
  }

}

module.exports = Spawns;

