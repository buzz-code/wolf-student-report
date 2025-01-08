export const musicNodes = [
  {
    "id": "music_start",
    "type": "action",
    "next": "askKubase",
  },
  {
    "id": "askKubase",
    "type": "tapInput",
    "message": "Please enter Kubase time",
    "storeVar": "kubaseTime",
    "inputConfig": {
      "max": 3,
      "min": 1
    },
    "next": "askFlute"
  },
  {
    "id": "askFlute",
    "type": "tapInput",
    "message": "Please enter Flute time",
    "storeVar": "fluteTime",
    "inputConfig": {
      "max": 3,
      "min": 1
    },
    "next": "save"
  }
];
