export const exerciseNodes = [
  {
    "id": "exercise_start",
    "type": "action",
    "next": "askExerciseTime",
  },
  {
    "id": "askExerciseTime",
    "type": "tapInput",
    "message": "How many minutes did you exercise today?",
    "storeVar": "exercizeTime",
    "inputConfig": {
      "max": 2,
      "min": 1
    },
    "next": "askExercise1"
  },
  {
    "id": "askExercise1",
    "type": "tapInput",
    "message": "Did you complete Exercise 1? Press 1 for Yes, 0 for No",
    "storeVar": "exercize1",
    "inputConfig": {
      "max": 1,
      "min": 1,
      "allowedDigits": [0, 1]
    },
    "next": "askExercise2"  
  },
  {
    "id": "askExercise2",
    "type": "tapInput",
    "message": "Did you complete Exercise 2? Press 1 for Yes, 0 for No", 
    "storeVar": "exercize2",
    "inputConfig": {
      "max": 1,
      "min": 1,
      "allowedDigits": [0, 1]
    },
    "next": "askExercise3"
  },
  {
    "id": "askExercise3",
    "type": "tapInput",
    "message": "Did you complete Exercise 3? Press 1 for Yes, 0 for No",
    "storeVar": "exercize3", 
    "inputConfig": {
      "max": 1,
      "min": 1,
      "allowedDigits": [0, 1]
    },
    "next": "askExercise4"
  },
  {
    "id": "askExercise4",
    "type": "tapInput",
    "message": "Did you complete Exercise 4? Press 1 for Yes, 0 for No",
    "storeVar": "exercize4",
    "inputConfig": {
      "max": 1,
      "min": 1,
      "allowedDigits": [0, 1]
    },
    "next": "confirmExercise"
  },
  {
    "id": "confirmExercise",
    "type": "tapInput",
    "message": "You exercised for {exercizeTime} minutes and completed exercises: {exercize1}, {exercize2}, {exercize3}, {exercize4}, Press 1 to confirm, 0 to start over",
    "storeVar": "confirmReport",
    "inputConfig": {
      "max": 1,
      "min": 1,
      "allowedDigits": [0, 1]
    },
    "nextIf": {
      "0": "exercise_start",
      "1": "save"
    }
  }
];
