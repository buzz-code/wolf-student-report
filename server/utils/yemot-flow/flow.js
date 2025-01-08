import { musicNodes } from './music-flow';

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
      "type": "end",
      "message": "Phone is not recognized in the system"
    },
    {
      "id": "errorInvalidType",
      "type": "end",
      "message": "Student type is not recognized in the system"
    },
    {
      "id": "welcome",
      "type": "action",
      "message": "Welcome {studentType} {studentName}",
      "storeVar": "studentTypeId",
      "nextIf": {
        "2": "music_start"
      }
    },
    ...musicNodes,
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
      "type": "end",
      "message": "Data was not saved"
    },
    {
      "id": "success",
      "type": "end",
      "message": "Data was saved successfully"
    }
  ]
}