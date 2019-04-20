const scanCodes = {
  ESCAPE: 0x01,   //
  1: 0x02, //
  2: 0x03, //
  3: 0x04,//
  4: 0x05,//
  5: 0x06,//
  6: 0x07,//
  7: 0x08,//
  8: 0x09,//
  9: 0x0A,//
  0: 0x0B,//
  MINUS: 0x0C, /* - on main keyboard */ //
  EQUALS: 0x0D,//
  BACK: 0x0E, /* backspace *///
  TAB: 0x0F,//
  Q: 0x10, //
  W: 0x11,//
  E: 0x12,//
  R: 0x13,//
  T: 0x14,//
  Y: 0x15,//
  U: 0x16,//
  I: 0x17,//
  O: 0x18,//
  P: 0x19,//
  LBRACKET: 0x1A, //
  RBRACKET: 0x1B, //
  RETURN: 0x1C, /* Enter on main keyboard */ //
  LCONTROL: 0x1D,//
  A: 0x1E,//
  S: 0x1F,//
  D: 0x20,//
  F: 0x21,//
  G: 0x22,//
  H: 0x23,//
  J: 0x24,//
  K: 0x25,//
  L: 0x26,//
  SEMICOLON: 0x27,//
  APOSTROPHE: 0x28,//
  GRAVE: 0x29, /* accent grave */ //
  LSHIFT: 0x2A,//
  BACKSLASH: 0x2B,//
  Z: 0x2C,//
  X: 0x2D,//
  C: 0x2E,//
  V: 0x2F,//
  B: 0x30,//
  N: 0x31,//
  M: 0x32,//
  COMMA: 0x33,//
  PERIOD: 0x34, /* . on main keyboard *///
  SLASH: 0x35, /* / on main keyboard *///
  RSHIFT: 0x36,//
  MULTIPLY: 0x37, /* * on numeric keypad *///
  LMENU: 0x38, /* left Alt *///
  SPACE: 0x39,//
  CAPITAL: 0x3A,//
  F1: 0x3B,//
  F2: 0x3C,//
  F3: 0x3D,//
  F4: 0x3E,//
  F5: 0x3F,//
  F6: 0x40,//
  F7: 0x41,//
  F8: 0x42,//
  F9: 0x43,//
  F10: 0x44,//
  NUMLOCK: 0x45, //
  SCROLL: 0x46, /* Scroll Lock */ //
  NUMPAD7: 0x47,//
  NUMPAD8: 0x48,//
  NUMPAD9: 0x49,//
  SUBTRACT: 0x4A, /* - on numeric keypad */
  NUMPAD4: 0x4B,//
  NUMPAD5: 0x4C,//
  NUMPAD6: 0x4D,//
  ADD: 0x4E, /* + on numeric keypad *///
  NUMPAD1: 0x4F,
  NUMPAD2: 0x50,
  NUMPAD3: 0x51,
  NUMPAD0: 0x52,
  DECIMAL: 0x53, /* . on numeric keypad */
  OEM_102: 0x56, /* < > | on UK/Germany keyboards */
  F11: 0x57,
  F12: 0x58,
  F13: 0x64, /*                     (NEC PC98) */
  F14: 0x65, /*                     (NEC PC98) */
  F15: 0x66, /*                     (NEC PC98) */
  KANA: 0x70, /* (Japanese keyboard)            */
  ABNT_C1: 0x73, /* / ? on Portugese (Brazilian) keyboards */
  CONVERT: 0x79, /* (Japanese keyboard)            */
  NOCONVERT: 0x7B, /* (Japanese keyboard)            */
  YEN: 0x7D, /* (Japanese keyboard)            */
  ABNT_C2: 0x7E, /* Numpad . on Portugese (Brazilian) keyboards */
  NUMPADEQUALS: 0x8D, /* = on numeric keypad (NEC PC98) */
  CIRCUMFLEX: 0x90, /* (Japanese keyboard)            */
  AT: 0x91, /*                     (NEC PC98) */
  COLON: 0x92, /*                     (NEC PC98) */
  UNDERLINE: 0x93, /*                     (NEC PC98) */
  KANJI: 0x94, /* (Japanese keyboard)            */
  STOP: 0x95, /*                     (NEC PC98) */
  AX: 0x96, /*                     (Japan AX) */
  UNLABELED: 0x97, /*                        (J3100) */
  NEXTTRACK: 0x99, /* Next Track */
  NUMPADENTER: 0x9C, /* Enter on numeric keypad */
  RCONTROL: 0x9D,
  MUTE: 0xA0, /* Mute */
  CALCULATOR: 0xA1, /* Calculator */
  PLAYPAUSE: 0xA2, /* Play / Pause */
  MEDIASTOP: 0xA4, /* Media Stop */
  VOLUMEDOWN: 0xAE, /* Volume - */
  VOLUMEUP: 0xB0, /* Volume + */
  WEBHOME: 0xB2, /* Web home */
  NUMPADCOMMA: 0xB3, /* , on numeric keypad (NEC PC98) */
  DIVIDE: 0xB5, /* / on numeric keypad */
  SYSRQ: 0xB7,
  RMENU: 0xB8, /* right Alt */
  PAUSE: 0xC5, /* Pause */
  HOME: 0xC7, /* Home on arrow keypad */
  UP: 0xC8, /* UpArrow on arrow keypad */
  PRIOR: 0xC9, /* PgUp on arrow keypad */
  LEFT: 0xCB, /* LeftArrow on arrow keypad */
  RIGHT: 0xCD, /* RightArrow on arrow keypad */
  END: 0xCF, /* End on arrow keypad */
  DOWN: 0xD0, /* DownArrow on arrow keypad */
  NEXT: 0xD1, /* PgDn on arrow keypad */
  INSERT: 0xD2, /* Insert on arrow keypad */
  DELETE: 0xD3, /* Delete on arrow keypad */
  LWIN: 0xDB, /* Left Windows key */
  RWIN: 0xDC, /* Right Windows key */
  APPS: 0xDD, /* AppMenu key */
  POWER: 0xDE,
  SLEEP: 0xDF,
  WAKE: 0xE3, /* System Wake */
  WEBSEARCH: 0xE5, /* Web Search */
  WEBFAVORITES: 0xE6, /* Web Favorites */
  WEBREFRESH: 0xE7, /* Web Refresh */
  WEBSTOP: 0xE8, /* Web Stop */
  WEBFORWARD: 0xE9, /* Web Forward */
  WEBBACK: 0xEA, /* Web Back */
  MYCOMPUTER: 0xEB, /* My Computer */
  MAIL: 0xEC, /* Mail */
  MEDIASELECT: 0xED    /* Media Select */
};

const keyCodes = {
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  BACK: 8,
  TAB: 9,
  RETURN: 13,
  LSHIFT: 16,
  LCONTROL: 17,
  LMENU: 18,
  PAUSE: 19,
  CAPITAL: 20,
  ESCAPE: 27,
  PRIOR: 33,
  NEXT: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  INSERT: 45,
  DELETE: 46,
  LWIN: 91,
  RWIN: 92,
  SELECTKEY: 93,
  NUMPAD0: 96,
  NUMPAD1: 97,
  NUMPAD2: 98,
  NUMPAD3: 99,
  NUMPAD4: 100,
  NUMPAD5: 101,
  NUMPAD6: 102,
  NUMPAD7: 103,
  NUMPAD8: 104,
  NUMPAD9: 105,
  NUMLOCK: 144,
  SCROLL: 145,
  MULTIPLY: 106,
  ADD: 107,
  SUBTRACT: 109,
  DECIMAL: 110,
  DIVIDE: 111,
  SEMICOLON: 186,
  EQUALS: 187,
  COMMA: 188,
  MINUS: 189,
  PERIOD: 190,
  SLASH: 191,
  GRAVE: 192,
  LBRACKET: 219,
  BACKSLASH: 220,
  RBRACKET: 221,
  APOSTROPHE: 222,
  SPACE: 32
};

const characterMap = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "0": "0",
  "a": "A",
  "b": "B",
  "c": "C",
  "d": "D",
  "e": "E",
  "f": "F",
  "g": "G",
  "h": "H",
  "i": "I",
  "j": "J",
  "k": "K",
  "l": "L",
  "m": "M",
  "n": "N",
  "o": "O",
  "p": "P",
  "q": "Q",
  "r": "R",
  "s": "S",
  "t": "T",
  "u": "U",
  "v": "V",
  "w": "W",
  "x": "X",
  "y": "Y",
  "z": "Z",
  ";": "SEMICOLON",
  "=": "EQUALS",
  ",": "COMMA",
  "`": "GRAVE",
  "[": "LBRACKET",
  "\\": "BACKSLASH",
  "]": "RBRACKET",
  "'": "APOSTROPHE",
  " ": "SPACE",
  // NUMPAD KEYS
  "/": "SLASH",
  "-": "MINUS",
  "*": "MULTIPLY",
  "+": "ADD",
  ".": "DECIMAL"
};

function convertKeyCodeToScanCode(rawcode) {
  let code = Object.keys(keyCodes).find(key => keyCodes[key] === rawcode);
  return scanCodes[code];
}

module.exports = {
  keyCodes: keyCodes,
  scanCodes: scanCodes,
  characterMap: characterMap,
  convertKeyCodeToScanCode: convertKeyCodeToScanCode
};