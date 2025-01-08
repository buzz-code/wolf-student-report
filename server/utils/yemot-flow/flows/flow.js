import { musicNodes } from './music-flow';
import { exerciseNodes } from './exercise-flow';

export default {
  "nodes": [
    {
      "id": "start",
      "type": "action",
      "action": "lookupStudent",
      "next": "checkStatus"
    },
    {
      "id": "checkStatus",
      "type": "action",
      "storeVar": "status",
      "nextIf": {
        "notFound": "errorNotFound",
        "found": "validateStudentType"
      }
    },
    {
      "id": "validateStudentType",
      "type": "action",
      "action": "validateStudentType",
      "storeVar": "studentTypeId",
      "nextIf": {
        "undefined": "errorInvalidType",
        "default": "errorInvalidType"
      },
      "next": "welcome"
    },
    {
      "id": "errorNotFound",
      "type": "action",
      "message": "Phone is not recognized in the system",
      "next": "end"
    },
    {
      "id": "errorInvalidType",
      "type": "action",
      "message": "Student type is not recognized in the system",
      "next": "end"
    },
    {
      "id": "welcome",
      "type": "action",
      "message": "Welcome {studentType} {studentName}",
      "storeVar": "studentTypeId",
      "nextIf": {
        "2": "music_start",
        "3": "exercise_start",
        "11": "exercise_start"
      }
    },
    ...musicNodes,
    ...exerciseNodes,
    {
      "id": "save",
      "type": "action",
      "action": "saveReport",
      "storeVar": "saveStatus",
      "nextIf": {
        "error": "errorSave",
        "ok": "success"
      }
    },
    {
      "id": "errorSave",
      "type": "action",
      "message": "Data was not saved",
      "next": "end"
    },
    {
      "id": "success",
      "type": "action",
      "message": "Data was saved successfully",
      "next": "end"
    }
  ]
}