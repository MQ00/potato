const async = require('async');
const game = require(__dirname + '/../build/Release/game');

module.exports = game;

module.exports.key = function (key) {
  let code = SCAN_CODES.findIndex(sc => sc.includes(key))
    , delay = Math.floor(Math.random() * 300) + 100;
  game.keyDown(code);
  setTimeout(game.keyUp, delay, code);
};

module.exports.key_sequence = function (sequence) {
  async.series(sequence, error => {
    if (error) throw error;
  });
};

async function pressKey(key) {
  return new Promise((resolve, reject) => {
    let code = SCAN_CODES.findIndex(sc => sc.includes(key))
      , delay = Math.floor(Math.random() * 300) + 100;
    game.keyDown(code);
    setTimeout(() => {
      game.keyUp(code);
      resolve();
    }, delay, code);
  });
}

async function sequence(arst) {
  for (let k of arst) {
    await pressKey(k);
  }
}


/** SCAN_CODES
 * @exported
 *
 * @description
 * DirectInput keyboard scan codes.  These are used by game.key instead
 * of virtual-key characters since EverQuest can't see SendKeys style
 * calls with any degree of success.  These are taken from dinput.h and
 * some aliases have been defined for clarit.  They are not in numerical
 * order, used game.code_for(key_name) to get the actual code to use.
 *
 * @example
 *   game.key(game.code_for('3'))
 *
 * @see https://msdn.microsoft.com/en-us/library/windows/desktop/ee418641(v=vs.85).aspx
 * */
const SCAN_CODES = Array.from(Array(0xFF), k => []);
module.exports.SCAN_CODES = SCAN_CODES;
module.exports.code_for = function (key) {
  return SCAN_CODES.findIndex(sc => sc.includes(key));
};


Object.defineProperty(String.prototype, 'scan_code', {
  get: function () {
    return SCAN_CODES.findIndex(sc => sc.includes(this.toUpperCase()));
  }
});


Object.defineProperty(String.prototype, '_d', {
  get: function () {
    let sc = this.scan_code;
    return function (done) {
      game.keyDown(sc);
      setTimeout(done, Math.floor(Math.random() * 300) + 100);
    };
  }
});


Object.defineProperty(String.prototype, '_u', {
  get: function () {
    let sc = this.scan_code;
    return function (done) {
      game.keyUp(sc);
      setTimeout(done, Math.floor(Math.random() * 300) + 100);
    };
  }
});

// Meta and Control Keys
SCAN_CODES[0x01] = ['ESCAPE', 'ESC'];
SCAN_CODES[0x0F] = ['TAB'];
SCAN_CODES[0x3A] = ['CAPITAL'];                    // caps lock?
SCAN_CODES[0x1C] = ['RETURN', 'ENTER'];            // Enter on main keyboard
SCAN_CODES[0xDB] = ['LWIN', 'WIN'];                // Left Windows key
SCAN_CODES[0xDC] = ['RWIN'];                       // Right Windows key
SCAN_CODES[0x2A] = ['LSHIFT', 'SHIFT'];            // left Shift
SCAN_CODES[0x36] = ['RSHIFT'];                     // right Shift
SCAN_CODES[0x38] = ['LMENU', 'LALT', 'ALT'];       // left Alt
SCAN_CODES[0xB8] = ['RMENU', 'RALT'];              // right Alt
SCAN_CODES[0x1D] = ['LCONTROL', 'LCTRL', 'CTRL'];  // left Ctrl
SCAN_CODES[0x9D] = ['RCONTROL', 'RCTRL'];          // right Ctrl
SCAN_CODES[0x0E] = ['BACK'];                       // backspace

// Punctuation Keys
SCAN_CODES[0x34] = ['PERIOD', '.'];                // . on main keyboard
SCAN_CODES[0x35] = ['SLASH', '/'];                 // / on main keyboard
SCAN_CODES[0x0C] = ['MINUS', '-'];                 // - on main keyboard
SCAN_CODES[0x0D] = ['EQUALS', '='];
SCAN_CODES[0x28] = ['APOSTROPHE', '\''];
SCAN_CODES[0x29] = ['GRAVE', '`'];
SCAN_CODES[0x2B] = ['BACKSLASH', '\\'];
SCAN_CODES[0x27] = ['SEMICOLON', ';'];
SCAN_CODES[0x33] = ['COMMA', ','];
SCAN_CODES[0x1A] = ['LBRACKET', '['];
SCAN_CODES[0x1B] = ['RBRACKET', ']'];
SCAN_CODES[0x39] = ['SPACE'];

// Letters and Numbers
SCAN_CODES[0x02] = ['1'];
SCAN_CODES[0x03] = ['2'];
SCAN_CODES[0x04] = ['3'];
SCAN_CODES[0x05] = ['4'];
SCAN_CODES[0x06] = ['5'];
SCAN_CODES[0x07] = ['6'];
SCAN_CODES[0x08] = ['7'];
SCAN_CODES[0x09] = ['8'];
SCAN_CODES[0x0A] = ['9'];
SCAN_CODES[0x0B] = ['0'];
SCAN_CODES[0x10] = ['Q'];
SCAN_CODES[0x11] = ['W'];
SCAN_CODES[0x12] = ['E'];
SCAN_CODES[0x13] = ['R'];
SCAN_CODES[0x14] = ['T'];
SCAN_CODES[0x15] = ['Y'];
SCAN_CODES[0x16] = ['U'];
SCAN_CODES[0x17] = ['I'];
SCAN_CODES[0x18] = ['O'];
SCAN_CODES[0x19] = ['P'];
SCAN_CODES[0x1E] = ['A'];
SCAN_CODES[0x1F] = ['S'];
SCAN_CODES[0x20] = ['D'];
SCAN_CODES[0x21] = ['F'];
SCAN_CODES[0x22] = ['G'];
SCAN_CODES[0x23] = ['H'];
SCAN_CODES[0x24] = ['J'];
SCAN_CODES[0x25] = ['K'];
SCAN_CODES[0x26] = ['L'];
SCAN_CODES[0x2C] = ['Z'];
SCAN_CODES[0x2D] = ['X'];
SCAN_CODES[0x2E] = ['C'];
SCAN_CODES[0x2F] = ['V'];
SCAN_CODES[0x30] = ['B'];
SCAN_CODES[0x31] = ['N'];
SCAN_CODES[0x32] = ['M'];

// Function (Fx) Keys
SCAN_CODES[0x3B] = ['F1'];
SCAN_CODES[0x3C] = ['F2'];
SCAN_CODES[0x3D] = ['F3'];
SCAN_CODES[0x3E] = ['F4'];
SCAN_CODES[0x3F] = ['F5'];
SCAN_CODES[0x40] = ['F6'];
SCAN_CODES[0x41] = ['F7'];
SCAN_CODES[0x42] = ['F8'];
SCAN_CODES[0x43] = ['F9'];
SCAN_CODES[0x44] = ['F10'];
SCAN_CODES[0x57] = ['F11'];
SCAN_CODES[0x58] = ['F12'];

// Arrows and Movement
SCAN_CODES[0x45] = ['NUMLOCK'];        // Numlock on numeric keypad
SCAN_CODES[0x46] = ['SCROLL'];         // Scroll Lock
SCAN_CODES[0xC7] = ['HOME'];           //Home on arrow keypad
SCAN_CODES[0xC8] = ['UP'];             //UpArrow on arrow keypad
SCAN_CODES[0xC9] = ['PRIOR', 'PGUP'];  //PgUp on arrow keypad
SCAN_CODES[0xCB] = ['LEFT'];           //LeftArrow on arrow keypad
SCAN_CODES[0xCD] = ['RIGHT'];          //RightArrow on arrow keypad
SCAN_CODES[0xCF] = ['END'];            //End on arrow keypad
SCAN_CODES[0xD0] = ['DOWN'];           //DownArrow on arrow keypad
SCAN_CODES[0xD1] = ['NEXT', 'PGDN'];   //PgDn on arrow keypad
SCAN_CODES[0xD2] = ['INSERT'];         //Insert on arrow keypad
SCAN_CODES[0xD3] = ['DELETE'];         //Delete on arrow keypad

// Numeric Keypad Keys
SCAN_CODES[0x52] = ['NUMPAD0', 'NUM0'];
SCAN_CODES[0x4F] = ['NUMPAD1', 'NUM1'];
SCAN_CODES[0x50] = ['NUMPAD2', 'NUM2'];
SCAN_CODES[0x51] = ['NUMPAD3', 'NUM3'];
SCAN_CODES[0x4B] = ['NUMPAD4', 'NUM4'];
SCAN_CODES[0x4C] = ['NUMPAD5', 'NUM5'];
SCAN_CODES[0x4D] = ['NUMPAD6', 'NUM6'];
SCAN_CODES[0x47] = ['NUMPAD7', 'NUM7'];
SCAN_CODES[0x48] = ['NUMPAD8', 'NUM8'];
SCAN_CODES[0x49] = ['NUMPAD9', 'NUM9'];
SCAN_CODES[0x4E] = ['ADD', 'NUM+'];            // + on numeric keypad
SCAN_CODES[0x4A] = ['SUBTRACT', 'NUM-'];       // - on numeric keypad
SCAN_CODES[0x37] = ['MULTIPLY', 'NUM*'];       // * on numeric keypad
SCAN_CODES[0x53] = ['DECIMAL', 'NUM.'];        // . on numeric keypad
SCAN_CODES[0xB5] = ['DIVIDE', 'NUM/'];         // / on numeric keypad
SCAN_CODES[0x9C] = ['NUMPADENTER', 'NUMENTR']; // Enter on numeric keypad

// Random Atypical Keyboards
SCAN_CODES[0xB7] = ['SYSRQ'];
SCAN_CODES[0x56] = ['OEM_102'];
SCAN_CODES[0x64] = ['F13'];            //                     (NEC PC98)
SCAN_CODES[0x65] = ['F14'];            //                     (NEC PC98)
SCAN_CODES[0x66] = ['F15'];            //                     (NEC PC98)
SCAN_CODES[0x70] = ['KANA'];           //            (Japanese keyboard)
SCAN_CODES[0x73] = ['ABNT_C1'];        //      (? on Brazilian keyboard)
SCAN_CODES[0x79] = ['CONVERT'];        //            (Japanese keyboard)
SCAN_CODES[0x7B] = ['NOCONVERT'];      //            (Japanese keyboard)
SCAN_CODES[0x7D] = ['YEN'];            //            (Japanese keyboard)
SCAN_CODES[0x7E] = ['ABNT_C2'];        // Numpad . on Brazilian keyboard
SCAN_CODES[0x8D] = ['NUMPADEQUALS'];   // = on numeric keypad (NEC PC98)
SCAN_CODES[0x91] = ['AT'];             //                     (NEC PC98)
SCAN_CODES[0x92] = ['COLON'];          //                     (NEC PC98)
SCAN_CODES[0x93] = ['UNDERLINE'];      //                     (NEC PC98)
SCAN_CODES[0x94] = ['KANJI'];          //            (Japanese keyboard)
SCAN_CODES[0x95] = ['STOP'];           //                     (NEC PC98)
SCAN_CODES[0x96] = ['AX'];             //                     (Japan AX)
SCAN_CODES[0x97] = ['UNLABELED'];      //                        (J3100)
SCAN_CODES[0xB3] = ['NUMPADCOMMA'];    // , on numeric keypad (NEC PC98)

// Media and Gimmick Buttons
SCAN_CODES[0xA0] = ['MUTE'];                 //Mute
SCAN_CODES[0xA1] = ['CALCULATOR'];           //Calculator
SCAN_CODES[0xA2] = ['PLAYPAUSE'];            //Play / Pause
SCAN_CODES[0xA4] = ['MEDIASTOP'];            //Media Stop
SCAN_CODES[0xAE] = ['VOLUMEDOWN', 'VOL-'];   //Volume -
SCAN_CODES[0xB0] = ['VOLUMEUP', 'VOL+'];     //Volume +
SCAN_CODES[0x99] = ['NEXTTRACK'];            // Next Track
SCAN_CODES[0x90] = ['PREVTRACK'];            // Previous Track
SCAN_CODES[0xB2] = ['WEBHOME'];              //Web home
SCAN_CODES[0xC5] = ['PAUSE'];                //Pause
SCAN_CODES[0xDD] = ['APPS'];                 //AppMenu key
SCAN_CODES[0xDE] = ['POWER'];                //System Power
SCAN_CODES[0xDF] = ['SLEEP'];                //System Sleep
SCAN_CODES[0xE3] = ['WAKE'];                 //System Wake
SCAN_CODES[0xE5] = ['WEBSEARCH'];            //Web Search
SCAN_CODES[0xE6] = ['WEBFAVORITES'];         //Web Favorites
SCAN_CODES[0xE7] = ['WEBREFRESH'];           //Web Refresh
SCAN_CODES[0xE8] = ['WEBSTOP'];              //Web Stop
SCAN_CODES[0xE9] = ['WEBFORWARD'];           //Web Forward
SCAN_CODES[0xEA] = ['WEBBACK'];              //Web Back
SCAN_CODES[0xEB] = ['MYCOMPUTER'];           //My Computer
SCAN_CODES[0xEC] = ['MAIL'];                 //Mail
SCAN_CODES[0xED] = ['MEDIASELECT'];          //Media Select
