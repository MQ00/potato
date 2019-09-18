const game = require('../../build/Release/game');
const RACE_LIST = require('./races');
const CLASS_LIST = require('./classes');

/** I don't have a good explanation for this, maybe it's part
 * of microsoft's tool chain or PE formats or something, but
 * the references all have to be shifted by this... weird. */
const BASE_SHIFT = 0x400000;

const _rZoneData = 0xe960e8;
const _pSpawnInfoList = 0xf37ae8; // Linked List of pointers to CharData pointers?
const _pCharData = 0xe86300;  // a single playerProfileStruct
const _pCharTarget = 0xc96bd8; // Pointer to CharData for UI Target?
const _pSpellSets = 0x6424a0; // unknown 2019-05-15

/** helper functions for making the offset definitions look clean
 * and readable while still dynamically reading all values instead
 * of storing it all in  memory or reading all at once and getting
 * values from the $data cache
 * */
function _arr(loc, size) {
  return {_: 'raw', loc, o: size, bytes: size};
}

function _str(loc, size = 40) {
  return {_: 'str', loc, o: size, bytes: size};
}

function _byt(loc) {
  return {_: 'byt', loc, bytes: 1};
}

function _int(loc) {
  return {_: 'int', loc, bytes: 4};
}

function _flt(loc) {
  return {_: 'flt', loc, bytes: 4};
}


/** takes a class and an object of offsets and adds accessors for
 * all of the offsets defined in the object along with $size and
 * $struct getters as well
 * */
function accessorize(klass, offsets) {
  let ends = [];

  // create getter functions for each offset in the struct record
  for (let offset of Object.keys(offsets)) {
    let {_, loc, o, bytes} = offsets[offset];
    ends.push(loc + bytes);
    Object.defineProperty(klass.prototype, offset, {
      get: function () {
        return this[_](loc, o);
      },
      set: function (v) {
        return this[`_${_}`](v, loc);
      },
    });
  }

  // figure the biggest amount we need to read to cache
  // the entire struct on first access for reasons (speed?)
  // @todo evaluate the performance benefit of using read_once
  let struct_size = Math.max.apply(Math, ends);
  Object.defineProperty(klass.prototype, '$size', {
    get: function () {
      return struct_size;
    }
  });

  // attach the struct record itself to the class
  Object.defineProperty(klass.prototype, '$struct', {
    get: function () {
      return offsets;
    }
  });
}


/** Offset Objects
 *
 * */

const _oZoneData = {
  name: _str(0x00),
};


const _oSpawnInfoList = {
  _rVtable: _int(0x00), // ref to virtual function table
  random: _int(0x04), // mq2 says rand() % 20000, looks true @todo
  _rFirst: _int(0x08), // first item in the spawn info list
  _rFinal: _int(0x0c), // final item in the spawn info list
  unknown10: _int(0x10), // unknown, looks like a ref to something @todo
  _rHtable: _int(0x14), // ref to some sort of hash table? @todo
};


// TODO:  Update refs for values that are commented out.
const _oSpawnInfo = {
  _rVtable: _int(0x00), // ref to virtual function table
  _rPrev: _int(0x04), // prev item in the spawn info list
  _rNext: _int(0x08), // next item in the spawn info list
  _rList: _int(0x0c), // ref to the SpawnInfoList +0x08

  id: _int(0x150),

  loc_x: _flt(0x64),
  loc_y: _flt(0x68),
  loc_z: _flt(0x6c),
  heading: _flt(0x80),
  vel_x: _flt(0x70),
  vel_y: _flt(0x74),
  vel_z: _flt(0x78),
  speed: _flt(0x7c),
  angle: _flt(0x84),
  camera: _flt(0x90),
  first_name: _str(0xa4),
  last_name: _str(0x38),
  disp_name: _str(0xe4),

  // current_health: _int(0x198),
  current_health: _int(0x1f0),
  // max_health: _int(0x5a0),
  max_health: _int(0x1f8),
  // current_mana: _int(0x4d0),
  current_mana: _int(0x204),
  // max_mana: _int(0x4d0),
  max_mana: _int(0x43c),

  // level: _byt(0x1da),
  // class: _byt(0xfa8),
  // _iRace: _int(0xfa0),
  // ownerId: _int(0x38c),
  // hide: _int(0x4bc),
  // type: _byt(0x125),

  type: _byt(0x125),
  ownerId: _int(0x55c),
  hide: _int(0x504),
  level: _byt(0x515),
  class: _byt(0xf9c),
  _iRace: _int(0xf94),
};


// TODO:  Update refs for values that are commented out.
const _oCharData = {
  _rVtable: _int(0x00),
  _rCharExtraHeader: _int(0x2880), // ref to our CharExtraHeader

  id: _int(0x150),

  loc_x: _flt(0x64),
  loc_y: _flt(0x68),
  loc_z: _flt(0x6c),
  heading: _flt(0x80),
  vel_x: _flt(0x70),
  vel_y: _flt(0x74),
  vel_z: _flt(0x78),
  speed: _flt(0x7c),
  angle: _flt(0x84),
  camera: _flt(0x90),
  first_name: _str(0xa4),
  last_name: _str(0x38),
  disp_name: _str(0xe4),

  // current_health: _int(0x198),
  current_health: _int(0x1f0),
  // max_health: _int(0x5a0),
  max_health: _int(0x1f8),
  // current_mana: _int(0x1f0),
  current_mana: _int(0x204),
  // max_mana: _int(0x4d0),
  max_mana: _int(0x43c),

  type: _byt(0x125),
  ownerId: _int(0x55c),
  hide: _int(0x504),
  level: _byt(0x515),
  class: _byt(0xf9c),
  _iRace: _int(0xf94),
  lang_skills: _arr(0x2890, 0x18), // TODO: split this out or make some lookup table

  // TODO:  Invalid offsets
  // stunned: _int(0x29e0), // 1 stunned | 0 not stunned
  //
  // zone_id: _int(0x29e4),
  // zone_pick: _int(0x29e6),
  // subscription_days: _int(0x283c),

  // shared_pp: _int(0x2ae4),
  // banked_pp: _int(0x2af4),
  // banked_gp: _int(0x2af8),
  // banked_sp: _int(0x2afc),
  // banked_cp: _int(0x2b00),
  //
  // stat_str: _int(0x2afc),
  // stat_sta: _int(0x2b00),
  // stat_cha: _int(0x2b04),
  // stat_dex: _int(0x2b08),
  // stat_int: _int(0x2b0c),
  // stat_agi: _int(0x2b10),
  // stat_wis: _int(0x2b14),
  //
  // resist_poi: _int(0x2b18),
  // resist_mag: _int(0x2b1c),
  // resist_dis: _int(0x2b20),
  // resist_cor: _int(0x2b24),
  // resist_fir: _int(0x2b28),
  // resist_col: _int(0x2b2c),
};


const _oCharExtraHeader = {
  unknown0: _int(0x00),
  _rCharExtraA: _int(0x04), // these two always seem to ref the
  _rCharExtraB: _int(0x08), // same memory location? @todo
};


const _oCharExtra = {
  level: _int(0x36f8),

  _iClass: _int(0x36e4),
  _iRace: _int(0x36e0),
  _iGender: _int(0x36dc),

  curr_hp: _int(0x3708),
  curr_mp: _int(0x36fc),
  curr_en: _int(0x3700),

  cursor_pp: _int(0x3740),
  cursor_gp: _int(0x3744),
  cursor_sp: _int(0x3748),
  cursor_cp: _int(0x374c),

  plat: _int(0x3730),
  gold: _int(0x3734),
  silv: _int(0x3738),
  copp: _int(0x373c),

  _iSpell0: _int(0x33c8),
  _iSpell1: _int(0x33cc),
  _iSpell2: _int(0x33d0),
  _iSpell3: _int(0x33d4),
  _iSpell4: _int(0x33d8),
  _iSpell5: _int(0x33dc),
  _iSpell6: _int(0x33e0),
  _iSpell7: _int(0x33e4),
  _iSpell8: _int(0x33e8),
  _iSpell9: _int(0x33ec),
};


const _oSpellSet = {
  gem0: _int(0x00),
  gem1: _int(0x04),
  gem2: _int(0x08),
  gem3: _int(0x0c),
  gem4: _int(0x10),
  gem5: _int(0x14),
  gem6: _int(0x18),
  gem7: _int(0x1c),
  gem8: _int(0x20),
  gem9: _int(0x24),
  gema: _int(0x28),
  gemb: _int(0x2c),
  gemc: _int(0x30),
  gemd: _int(0x34),
  name: _str(0x38, 0x19),

  used: _byt(0x51),

  unknown0x50: _byt(0x52),
  unknown0x51: _byt(0x53),
};


class MemoryStruct {

  constructor(address, read_once = false) {
    this.address = address;
    this.read_once = read_once;
    this.$data = null;
  }


  doRead(offset, size) {
    if (this.read_once) {
      if (this.$data == null) {
        this.$data = game.readMemory(this.address, this.$size);
      }
      return this.$data.slice(offset, offset + size);
    } else {
      return game.readMemory(this.address + offset, size);
    }
  }


  byt(offset = 0) {
    let data = this.doRead(offset, 4);
    if (!data) return 0;

    return Buffer.from(data).readUInt8(0x00);
  }


  int(offset = 0) {
    let data = this.doRead(offset, 4);
    if (!data) return 0;

    return Buffer.from(data).readUInt32LE(0x00);
  }


  raw(offset, len = 4) {
    let data = this.doRead(offset, len);
    if (!data) return Buffer.from([]);

    return Buffer.from(data);
  }


  str(offset, len = 40) {
    let data = this.doRead(offset, len);
    if (!data) return '';

    data = Buffer.from(data);
    return data.toString('utf8', 0, data.indexOf(0x00));
  }


  flt(offset) {
    let data = this.doRead(offset, 4);
    if (!data) return 0;

    return Buffer.from(data).readFloatLE(0x00);
  }


  _byt(value, offset = 0) {
    let data = Buffer.from([value]);
    game.writeMemory(this.address + offset, data);
  }


  _int(value, offset = 0) {
    let data = Buffer.allocUnsafe(4);
    data.writeUInt32LE(value);
    game.writeMemory(this.address + offset, data);
  }


  _raw(value, offset) {
    game.writeMemory(this.address + offset, value);
  }


  _str(value, offset, len = 40) {
    let data = Buffer.from(value + '\x00');
    game.writeMemory(this.address + offset, data);
  }


  _flt(value, offset) {
    let data = Buffer.allocUnsafe(4);
    data.writeFloatLE(value);
    game.writeMemory(this.address + offset, data);
  }


  /** return a simple object with only the values for the
   * offsets defined in the struct record for reasons
   * */
  toStruct(options = {}) {
    let only = options.only || Object.keys(this.$struct)
      , without = options.without || [];

    only = only.filter(o => !without.includes(o));

    let struct = {};
    for (let key of only) {
      struct[key] = this[key];
    }
    return struct;
  }


  /** compare this to another object using the $struct
   * and return a weird object of the differences*/
  compare(that) {
    if (this.$struct !== that.$struct) {
      return false;
    }

    let changes = {$changes: false};
    for (let key of Object.keys(this.$struct)) {
      let _this = this[key]
        , _that = that[key];
      if (_this != _that) {
        changes.$changes = true;
        changes[key] = {_this, _that};
      }
    }

    return changes;
  }
}


class ZoneData extends MemoryStruct {

  constructor(base_address, read_once) {
    super(base_address - BASE_SHIFT + _rZoneData, read_once);
  }

}

accessorize(ZoneData, _oZoneData);


class SpawnInfoList extends MemoryStruct {

  // @note get the address before setting read_once
  constructor(base_address, read_once) {
    super(base_address - BASE_SHIFT, false);
    this.address = this.int(_pSpawnInfoList);
    this.read_once = read_once;
  }

  first(read_once = null) {
    let _read_once = read_once == null ? this.read_once : read_once;
    return new SpawnInfo(this._rFirst, this.read_once);
  }

  final(read_once = null) {
    let _read_once = read_once == null ? this.read_once : read_once;
    return new SpawnInfo(this._rFinal, this.read_once);
  }

  * all(read_once = null) {
    let _read_once = read_once == null ? this.read_once : read_once;
    let spawn = new SpawnInfo(this._rFirst, _read_once);
    yield spawn;
    while (spawn._rNext !== 0) {
      spawn = spawn.next;
      yield spawn;
    }
  }

}

accessorize(SpawnInfoList, _oSpawnInfoList);


class SpawnInfo extends MemoryStruct {

  get class_name() {
    return CLASS_LIST.classList[this.class];
  }

  get race_name() {
    return RACE_LIST[this._iRace];
  }

  get next() {
    return new SpawnInfo(this._rNext, this.read_once);
  }

}

accessorize(SpawnInfo, _oSpawnInfo);


class CharData extends MemoryStruct {

  // @note get the address before setting read_once
  constructor(base_address, read_once) {
    super(base_address - BASE_SHIFT, false);
    this.address = this.int(_pCharData);
    this.read_once = read_once;
  }

  get extra() {
    let header = new CharExtraHeader(this._rCharExtraHeader);
    return new CharExtra(header._rCharExtraA, this.read_once);
  }

}

accessorize(CharData, _oCharData);


class CharExtraHeader extends MemoryStruct {

}

accessorize(CharExtraHeader, _oCharExtraHeader);


class CharExtra extends MemoryStruct {

}

accessorize(CharExtra, _oCharExtra);


class SpellSet extends MemoryStruct {

  get next() {
    return new SpellSet(this.address + this.$size);
  }

}

accessorize(SpellSet, _oSpellSet);


// This Singleton pattern works'ish but the game addon is being loaded twice, one on class import then on singleton instantiation? /boggle
const singleton = Symbol();
const singletonEnforcer = Symbol();

class EQMemory {

  constructor(read_once, enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot construct singleton');
    }
    this.read_once = read_once;

    this.process = game.openProcess();
    this.address = game.getBaseAddress();
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new EQMemory(false, singletonEnforcer);
    }

    return this[singleton];
  }

  static get game() {
    return game;
  }

  direct(location, len) {
    let data = game.readMemory(location, len);
    return data ? Buffer.from(data) : Buffer.from([]);
  }

  get target() {
    let _rTarget = this.direct(this.address - BASE_SHIFT + _pCharTarget, 4);
    return new SpawnInfo(_rTarget.readUInt32LE(), this.read_once);
  }

  set target(spawn_info) {
    let _rTarget = Buffer.allocUnsafe(4);
    _rTarget.writeUInt32LE(spawn_info.address);
    game.writeMemory(this.address - BASE_SHIFT + _pCharTarget, _rTarget);
  }

  get zoneData() {
    return new ZoneData(this.address, this.read_once);
  }  // This is a useless function!

  get spawnInfoList() {
    return new SpawnInfoList(this.address, this.read_once);
  }

  get charData() {
    return new CharData(this.address, this.read_once);
  }

  get spellSet() {
    let _rFirstSpellSet = this.direct(this.address - BASE_SHIFT + _pSpellSets, 4);
    return new SpellSet(_rFirstSpellSet.readUInt32LE(), this.read_once);
  }
}

// const vvSpawnInfo = {
// 0x0010 	JumpStrength;
// 0x0014 	SwimStrength;
// 0x0018 	SpeedMultiplier;
// 0x001c 	AreaFriction;
// 0x0020 	AccelerationFriction;
// 0x0024   CollidingType;  ok finally had time to get this one right, when we collide with something this gets set.
// 0x0028 	FloorHeight;
// 0x002c 		bSinksInWater;
// 0x0030 		PlayerTimeStamp;  doesn't update when on a Vehicle (mounts/boats etc)
// 0x0034 		LastTimeIdle;
// 0x0038 		Lastname[0x20];
// 0x0058 	AreaHPRegenMod; from guild hall pools etc.
// 0x005c 	AreaEndRegenMod;
// 0x0060 	AreaManaRegenMod;
// 0x0064 	Y;
// 0x0068 	X;
// 0x006c 	Z;
// 0x0070 	SpeedY;
// 0x0074 	SpeedX;
// 0x0078 	SpeedZ;
// 0x007c 	SpeedRun;
// 0x0080 	Heading;
// 0x0084 	Angle;
// 0x0088 	AccelAngle;
// 0x008c 	SpeedHeading;
// 0x0090 	CameraAngle;
// 0x0094 		UnderWater; LastHeadEnvironmentType
// 0x0098 		LastBodyEnvironmentType;
// 0x009c 		LastFeetEnvironmentType;
// 0x00a0 		HeadWet; these really are environment related, like lava as well for example
// 0x00a1 		FeetWet;
// 0x00a2 		BodyWet;
// 0x00a3 		LastBodyWet;
// 0x00a4 		Name[0x40];              ie priest_of_discord00
// 0x00e4 		DisplayedName[0x40];     ie Priest of Discord
// 0x0124 		PossiblyStuck;           never seen this be 1 so maybe it was used a a point but not now...
// 0x0125 		Type;
// 0x0128     BodyType;	 this really should be renamed to charprops or something its broken anyway
// 0x012c 		CharPropFiller[0xc];  well since the above is a CharacterPropertyHash we have to pad here...
// 0x0138 	AvatarHeight;            height of avatar from groundwhen standing for sure see 5C06A0 in Jun 10 2019 test - eqmule
// 0x013c 	Height;
// 0x0140 	Width;
// 0x0144 	Length;
// 0x0148 		Unknown0x0148;
// 0x014c 		Unknown0x014C;
// 0x0150 	SpawnID;
// 0x0154 	PlayerState;          0=Idle 1=Open 2=WeaponSheathed 4=Aggressive 8=ForcedAggressive 0x10=InstrumentEquipped 0x20=Stunned 0x40=PrimaryWeaponEquipped 0x80=SecondaryWeaponEquipped
// 0x0158  _SPAWNINFO*	Vehicle;     NULL until you collide with a vehicle (boat,airship etc)
// 0x015c  _SPAWNINFO*	Mount;       NULL if no mount present
// 0x0160  _SPAWNINFO*	Rider;       _SPAWNINFO of mount's rider
// 0x0164 	Unknown0x0164;
// 0x0168 		Targetable;	 true if mob is targetable
// 0x0169 		bTargetCyclable;
// 0x016a 		bClickThrough;
// 0x016b 		bBeingFlung;
// 0x016c 		FlingActiveTimer;
// 0x0170 		FlingTimerStart;
// 0x0174 		bFlingSomething;
// 0x0178 	FlingY;
// 0x017c 	FlingX;
// 0x0180 	FlingZ;
// 0x0184 		bFlingSnapToDest;
// 0x0188 		SplineID;
// 0x018c 		SplineRiderID;
// }


module.exports = EQMemory;
