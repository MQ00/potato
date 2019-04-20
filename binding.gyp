{ 
  "targets": [ 
    { 
      "target_name": "game", 
      "sources": [] ,
      "include_dirs" : [ "<!(node -e \"require('nan')\")" ],
      "conditions": [
        ['OS=="win"', { "sources": ["game/game.cc"] }]
      ]
    } 
  ] 
}
