# Entity Summary - Wolf Student Report Project

## 1. Project Pages

This list includes all active pages in the project as defined in [client/constants/route-config.js](client/constants/route-config.js).

### Basic Tables

| Page Name | Path | Endpoint | Columns | Filters | Complexity |
| --- | --- | --- | --- | --- | --- |
| תלמידות (Students) | `/students` | `students` | תעודת זהות, שם, טלפון, כיתה, סוג התלמידה | תעודת זהות, שם, טלפון, כיתה, סוג התלמידה | Simple |
| סוגי תלמידות (Student Types) | `/student-types` | `student-types` | מזהה, שם | מזהה, שם | Simple |
| הודעות (Texts) | `/texts` | `texts` | שם, תיאור, ערך | שם, תיאור, ערך | Simple |
| התמחויות (Specialties) | `/specialties` | `specialties` | קוד, שם התמחות | קוד, שם התמחות | Simple |
| שיוך תלמידות להתמחויות (Student Specialties) | `/student-specialties` | `student-specialties` | תלמידה, התמחות | תלמידה, התמחות | Simple |
| היעדרויות לפי התמחות (Specialty Absences) | `/specialty-absences` | `specialty-absences` | תאריך היעדרות, תאריך אחרון לדיווח, התמחות, מאושר | תאריך היעדרות, התמחות, מאושר | Simple |
| ציונים (Grades) | `/grades` | `grades` | תלמידה, ציון | תלמידה, ציון | Simple |
| תאריכי תיקוף (Excellency Dates) | `/excellency-dates` | `excellency-dates` | סוג תלמידה, תאריך, שיעור 1, שיעור 2 | סוג תלמידה | Simple |
| תקופות דיווח (Report Periods) | `/report-periods` | `report-periods` | סוג תלמידה, סוג תקופה, שם תקופה, תאריך התחלה, תאריך סיום, תאריך התחלת דיווח, תאריך סיום דיווח | None | Simple |
| שמות מבחנים (Test Names) | `/test-names` | `test-names` | סוג תלמידה, מזהה, שם | מזהה, שם, סוג תלמידה | Simple |

### Attendance Reports (Active Variations)

All these pages point to the `att-reports` endpoint but show different columns and apply default filters based on student types.

| Page Name | Path | Filtered Student Type | Main Columns | Complexity |
| --- | --- | --- | --- | --- |
| תיקופים (General) | `/att-reports` | All | Student info, report date, entry/exit hours, kindergarten activities (1-6), music (kubase/flute), exercises (1-5), training fields, special education details, excellency (attendance/homework), lesson lengths (havana/ktiv), prayer/lecture details, test info, and absence data | Simple |
| תיקופי גננות (1) | `/att-reports-1` | 1 | Student info, entry/exit, kindergartenType, kindergartenNumber, kindergartenActivity (1-6) | Simple |
| תיקופי מוזיקה (2) | `/att-reports-2` | 2 | Student info, report date, kubaseTime, fluteTime | Simple |
| תיקופי התעמלות ה (3) | `/att-reports-3` | 3 | Student info, exercizeTime, exercize (1-4) | Simple |
| תיקופי חץ שנה א (8) | `/att-reports-8` | 8 | Student info, excellencyAtt, excellencyHomework, excellencyExtra 1-2 | Simple |
| תיקופי מצוינות שנה א (9) | `/att-reports-9` | 9 | Student info, excellencyAtt, excellencyHomework, excellencyExtra 1-2 | Simple |
| תיקופי תלמידות ו (10) | `/att-reports-10` | 10 | Student info, report date, enterHour, exitHour | Simple |
| תיקופי התעמלות ו (11) | `/att-reports-11` | 11 | Student info, exercizeTime, exercize (1-4) | Simple |
| תיקופי חץ שנה ב (12) | `/att-reports-12` | 12 | Student info, excellencyAtt, excellencyHomework, excellencyExtra 1-2 | Simple |
| תיקופי ה - תפילה והרצאות (13) | `/att-reports-13` | 13 | Student info, report date, enterHour/exitHour (opt), prayer info (0-5), lecture info (1-2), test info | Simple |
| תיקופי ו - הרצאות (14) | `/att-reports-14` | 14 | Student info, report date, enterHour/exitHour (opt), lecture info (1-2), test info | Simple |
| תיקופי חינוך מיוחד | `/att-reports-4567` | 4,5,6,7,15,16 | Student info, enterHour, exitHour, wasLessonTeaching, excellencyHomework, phoneDiscussing, openQuestion | Simple |

### Complex Reports

| Page Name | Path | Endpoint | Features | Explanation |
| --- | --- | --- | --- | --- |
| תיקופים פיבוט (Pivot) | `/att-reports-pivot` | `att-reports/get-pivot-data` | Dynamic columns, group by day/week | **Complex**: Shows student attendance status across dynamic date columns. |
| דוח מצוינות בהוראה | `/excellency-total-report` | `att-reports/getExcellencyTotalReport` | Aggregated lesson counts and attendance percentages | **Complex**: Calculates total required vs. actual lessons with attendance percentages. |
| תיקופי ודיווחי תאריכים (1 & 8) | `/att-reports-and-dates-1`, `/att-reports-and-dates-8` | `att-reports/getAttReportsAndDates` | Joins report dates with required dates | **Complex**: Cross-references actual report dates against required excellency dates for completeness. |

---

## 2. Database Tables

This list is derived from [server/models/index.js](server/models/index.js) and controller logic.

### Active Tables

| Table Name | Primary Columns | Usage |
| --- | --- | --- |
| `users` | `id`, `name`, `email`, `password`, `api_key` | System users (admins/teachers) |
| `students` | `id`, `user_id`, `tz`, `name`, `phone`, `klass`, `student_type_id` | Main student repository |
| `student_types` | `id`, `user_id`, `key`, `name` | Categorization of students (affects reports) |
| `att_reports` | `id`, `user_id`, `student_id`, `report_date`, `update_date`, `enterHour`, `exitHour`, `kindergartenType`, `kindergartenNumber`, `kindergartenActivity1-6`, `kubaseTime`, `fluteTime`, `exercizeTime`, `exercize1-5`, `trainingType`, `wasLessonTeaching`, `phoneDiscussing`, `excellencyAtt`, `excellencyHomework`, `lessonLengthHavana`, `lessonLengthKtiv`, `haknayaLessons`, `tikunLessons`, `mathLessons`, `prayerOrLecture`, `prayer0-5`, `lecture1-3`, `testCombined`, `testGeneral`, `test1`, `test2`, `test7`, `test9`, `absenceDate`, `absenceLessonsCount`, `report_period_id`, `excellencyExtra1`, `excellencyExtra2` | Primary storage for all attendance and activity reports via web and phone |
| `excellency_dates` | `id`, `user_id`, `student_type_id`, `report_date`, `extra_1`, `extra_2` | Required dates for reporting excellence/special activities |
| `report_periods` | `id`, `user_id`, `student_type_id`, `report_type`, `period_name`, `start_date`, `end_date`, `start_report_date`, `end_report_date` | Date bounds for report submissions |
| `test_names` | `id`, `user_id`, `student_type_id`, `key`, `name` | List of possible test names |
| `specialties` | `id`, `user_id`, `key`, `name` | Professional specialty definitions |
| `student_specialties` | `id`, `user_id`, `student_tz`, `specialty_key` | Map students to their specialties |
| `specialty_absences` | `id`, `user_id`, `absence_date`, `report_until_date`, `specialty_key`, `is_confirmed` | Tracks absences specifically related to specialties |
| `grades` | `id`, `user_id`, `student_tz`, `grade` | Student test/assignment grades |
| `texts` | `id`, `user_id`, `name`, `description`, `value` | configurable text messages/settings |

### Unused Tables

These tables are defined in the database/models but have no corresponding active UI page, and are considered not in use.

| Table Name | Usage Note |
| --- | --- |
| `teachers` | No UI page found |
| `teacher_types` | No UI page found |
| `teacher_salary_types`| No UI page found |
| `att_types` | No UI page found |
| `prices` | No UI page found |
| `working_dates` | No UI page found |
| `questions` | No UI page found (Yemot automated surveys) |
| `answers` | No UI page found (Yemot automated surveys) |
| `question_types` | No UI page found |
