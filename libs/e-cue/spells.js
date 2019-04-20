const fs = require('fs');
const util = require('util');

const moment = require('moment');
const winston = require('winston');


let TAG = 'EQ:Spells';
let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function () {
        return moment().format("YYYY-MM-DD HH:mm:ss");
      },
      formatter: function (options) {
        let time = options.timestamp()
          , level = options.level
          , tag = winston.config.colorize(level, `${TAG}:${level}`)
          , msg = (options.message ? options.message : '')
          , meta = '';

        if (options.meta && Object.keys(options.meta).length) {
          meta = `\n\t${util.inspect(options.meta, {colors: true, depth: null})}`;
        }

        return `${time} ${tag}: ${msg}${meta}`;
      }
    })
  ]
});


let _entry_index = 0;

function _entry(name, kind) {
  let entry = {name, kind, col: _entry_index};
  _entry_index++;
  return entry;
}

function __ignore(k) {
  return undefined;
}

function _ignore(name) {
  return _entry(name, __ignore);
}

function __number(k) {
  return (isNaN(parseFloat(k)) ? undefined : parseFloat(k));
}

function _number(name) {
  return _entry(name, __number);
}

function __string(k) {
  return (k.length > 0 ? k : undefined);
}

function _string(name) {
  return _entry(name, __string);
}

function __truthy(k) {
  return k === '1';
}

function _truthy(name) {
  return _entry(name, __truthy);
}


const SPELL_US_TXT = [
  _number('id'),
  _string('name'),
  _string('actor_tag'),
  _string('extra'),
  _string('me_cast_txt'),
  _string('other_cast_txt'),
  _string('cast_me_txt'),
  _string('cast_other_txt'),
  _string('me_wore_off'),
  _number('range'),
  _number('radius'),
  _number('push_back'),
  _number('push_up'),
  _number('cast_time'),
  _number('rest_time'),
  _number('recast_time'),
  _number('duration_base'),
  _number('duration_cap'),
  _number('impact_duration'),
  _number('mana'),
  _ignore('image_number'),
  _ignore('mem_image_number'),
  _number('consume_item_id'),
  _number('consume_item_id'),
  _number('consume_item_id'),
  _number('consume_item_id'),
  _number('consume_item_count'),
  _number('consume_item_count'),
  _number('consume_item_count'),
  _number('consume_item_count'),
  _number('focus_id'),
  _number('focus_id'),
  _number('focus_id'),
  _number('focus_id'),
  _number('light_type'),
  _truthy('benefitial'),
  _number('activated'),
  _number('resist_type'),
  _number('target_type'),
  _number('fizzle_rate'),
  _number('skill'),
  _number('zone_type'),
  _number('env_type'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _number('min_level'),
  _ignore('casting_anim'),
  _ignore('target_anim'),
  _ignore('travel_type'),
  _ignore('spa_index'),
  _truthy('cancel_on_sit'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _truthy('diety'),
  _ignore('npc_no_cast'),
  _ignore('ai_pt_bonus'),
  _number('new_icon'),
  _number('effect_index'),
  _truthy('no_interrupt'),
  _number('resist_mod'),
  _truthy('not_stackable_dot'),
  _ignore('delete_ok'),
  _number('reflect_id'),
  _truthy('no_partial_resist'),
  _truthy('small_targets_only'),
  _truthy('persistant_particles'),
  _truthy('bard_buff_box'),
  _number('description_id'),
  _number('category'),
  _number('category'),
  _number('category'),
  _truthy('no_npc_los'),
  _truthy('feedbackable'),
  _truthy('reflectable'),
  _number('hate_mod'),
  _number('resist_per_level'),
  _number('resist_cap'),
  _number('affect_obj'),
  _number('endurance'),
  _number('timer_id'),
  _truthy('is_skill'),
  _number('hate_given'),
  _number('endur_upkeep'),
  _number('limited_use_type'),
  _number('limited_use_count'),
  _ignore('pvp_resist_mod'),
  _ignore('pvp_resist_per_level'),
  _ignore('pvp_resist_cap'),
  _ignore('global_group'),
  _ignore('pvp_duration'),
  _ignore('pvp_duration_cap'),
  _ignore('pcnpc_only_flag'),
  _truthy('cast_not_standing'),
  _truthy('can_mgb'),
  _truthy('no_dispell'),
  _ignore('npc_mem_category'),
  _ignore('npc_usefulnes'),
  _number('min_resist'),
  _number('max_resist'),
  _number('min_spread_time'),
  _number('max_spread_time'),
  _ignore('duration_particle_effect'),
  _number('cone_start_angle'),
  _number('cone_end_angle'),
  _truthy('sneak_attack'),
  _truthy('not_focusable'),
  _truthy('no_detrimental_spell_aggro'),
  _truthy('show_wear_off_message'),
  _truthy('is_countdown_held'),
  _number('spread_radius'),
  _number('base_effects_focus_cap'),
  _truthy('stacks_with_self'),
  _truthy('not_shown_to_player'),
  _truthy('no_buff_block'),
  _ignore('anim_variation'),
  _number('spell_group'),
  _number('spell_group_rank'),
  _truthy('no_resist'),
  _truthy('allow_spellscribe'),
  _number('spell_req_association_id'),
  _truthy('bypass_regen_check'),
  _truthy('can_cast_in_combat'),
  _truthy('can_cast_out_of_combat'),
  _truthy('show_dot_message'),
  _number('override_crit_chance'),
  _number('max_targets'),
  _truthy('no_heal_damage_item_mod'),
  _number('caster_requirement_id'),
  _number('spell_class'),
  _number('spell_subclass'),
  _number('ai_valid_targets'),
  _truthy('no_strip_on_death'),
  _number('base_effects_focus_slope'),
  _number('base_effects_focus_offset'),
  _number('distance_mod_close_dist'),
  _number('distance_mod_close_mult'),
  _number('distance_mod_far_dist'),
  _number('distance_mod_far_mult'),
  _number('min_range'),
  _truthy('no_remove'),
  _number('spell_recourse_type'),
  _truthy('only_during_fast_regen'),
  _truthy('is_beta_only'),
  _number('spell_subgroup'),
  _number('no_overwrite'),
  _string('spa_slots'),
];


const CLASS_SHORT = [
  'NONE',
  'WAR',
  'CLR',
  'PAL',
  'RNG',
  'SHD',
  'DRU',
  'MNK',
  'BRD',
  'ROG',
  'SHM',
  'NEC',
  'WIZ',
  'MAG',
  'ENC',
  'BST',
  'BER',
];


const CLASS_LONG = [
  'None',
  'Warrior',
  'Cleric',
  'Paladin',
  'Ranger',
  'ShadowKnight',
  'Druid',
  'Monk',
  'Bard',
  'Rogue',
  'Shaman',
  'Necro',
  'Wizard',
  'Mage',
  'Enchanter',
  'Beastlord',
  'Berserker',
];


class SpellsDB {

  constructor() {
    this._spells = [];
    this._byName = {};
  }


  addSpell(details) {
    let spell = {};

    for (let {name, kind, col} of SPELL_US_TXT) {
      let value = kind(details[col]);
      if (value != undefined) {
        if (spell[name] != undefined) {
          // lol, this is the slowest possible way of doing this
          spell[name] = [].concat(spell[name]).concat(value);
        } else {
          spell[name] = value;
        }
      }
    }

    this._spells[spell.id] = spell;
    this._byName[spell.name] = spell.id;
  }


  static load(location) {
    let start_time = process.hrtime();
    logger.info(`loading spells db from '${location}' ...`);

    return new Promise((resolve, reject) => {
      let spells = new SpellsDB()
        , buffered = ''
        , in_stream = fs.createReadStream(location, {encoding: 'utf8'});

      in_stream.on('data', chunk => {
        let lines = (buffered + chunk).split('\r\n');
        buffered = lines.pop();
        for (let line of lines) {
          if (line.length > 0 && line[0] != '#') {
            //spells.addSpell(line.split('^'))
          }
        }
      });

      in_stream.on('end', () => {
        if (buffered.length > 3 && buffered[0] != '#') {
          //spells.addSpell(buffered.split('^'))
        }
        let run_time = process.hrtime(start_time)
          , seconds = run_time[0] + (run_time[1] / 1e9);
        logger.info(`loading complete... ${spells._spells.length} spells loaded in ${seconds}s`);
        resolve(spells);
      });

      in_stream.on('error', reject);
    });
  }

}

module.exports = SpellsDB;

async function main(callback) {
  let spells = await SpellsDB.load(__dirname + '/../../data/spells_us.txt');
  for (let spell of spells._spells) {
    if (spell && spell['name'] == 'Call of the Hero') {
      logger.info('huh, neat', spell);
      exit();
    }
  }
}

//main()
