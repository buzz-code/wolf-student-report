import { CallBase } from "../../common-modules/server/utils/callBase";
import format from 'string-format';
import moment from 'moment-timezone';
import * as queryHelper from './queryHelper';
import { AttReport } from "../models";
import { formatJewishDateHebrew, getJewishDate } from "jewish-dates-core";

const reportTypes = {
    prayer: 1,
    lecture: 2,
}

export class YemotCall extends CallBase {
    constructor(params, callId, user) {
        super(params, callId, user);
    }

    fields = {
        enterHour: 'enterHour',
        exitHour: 'exitHour',
        kindergartenType: 'kindergartenType',
        kindergartenActivity: 'kindergartenActivity',
        kindergartenActivity1: 'kindergartenActivity1',
        kindergartenActivity2: 'kindergartenActivity2',
        kindergartenActivity3: 'kindergartenActivity3',
        kindergartenNumber: 'kindergartenNumber',
        kubaseTime: 'kubaseTime',
        fluteTime: 'fluteTime',
        exercizeTime: 'exercizeTime',
        exercize1: 'exercize1',
        exercize2: 'exercize2',
        exercize3: 'exercize3',
        exercize4: 'exercize4',
        exercize5: 'exercize5',
        trainingType: 'trainingType',
        trainingLessonType: 'trainingLessonType',
        trainingReadingType: 'trainingReadingType',
        wasLessonTeaching: 'wasLessonTeaching',
        phoneDiscussing: 'phoneDiscussing',
        specialEdicationType: 'specialEdicationType',
        snoozlenDay: 'snoozlenDay',
        excellencyAtt: 'excellencyAtt',
        excellencyHomework: 'excellencyHomework',
        lessonLengthHavana: 'lessonLengthHavana',
        lessonLengthKtiv: 'lessonLengthKtiv',
        haknayaLessons: 'haknayaLessons',
        tikunLessons: 'tikunLessons',
        mathLessons: 'mathLessons',
        openQuestion: 'openQuestion',
        prayerOrLecture: 'prayerOrLecture',
        prayer0: 'prayer0',
        prayer1: 'prayer1',
        prayer2: 'prayer2',
        prayer3: 'prayer3',
        prayer4: 'prayer4',
        prayer5: 'prayer5',
        lecture1: 'lecture1',
        lecture2: 'lecture2',
        lecture3: 'lecture3',
        testGeneral: 'testGeneral',
        test1: 'test1',
        test2: 'test2',
        test7: 'test7',
        test9: 'test9',
        testCombined: 'testCombined',
    }

    async start() {
        console.log('start call');
        await this.getTexts();
        console.log('gt texts');
        try {
            this.student = await queryHelper.getStudentByUserIdAndPhone(this.user.id, this.params.ApiPhone);
            console.log('got student')
            if (!this.student) {
                console.log('student not found');
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.phoneIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
            }

            console.log('student', this.student, this.texts.welcomeForStudent);
            this.globalMsg = format(this.texts.welcomeForStudent, this.student.student_type_name, this.student.name);
            await this.getReportAndSave();
        }
        catch (e) {
            if (e) {
                console.log('catch yemot exception', e);
            }
        } finally {
            this.end();
        }
    }

    async getReport() {
        console.log('get report', this.student.student_type_id);
        switch (this.student.student_type_id) {
            case 1:
                //גננות
                await this.getKindergartenReport();
                break;
            case 2:
                //מוזיקה
                await this.getMusicReport();
                break;
            case 3:
                //התעמלות
                await this.getExerciseReport();
                break;
            case 4:
                //הוראה מתקנת
                await this.getTrainingReport();
                break;
            case 5:
                //הומ שנה ב
                await this.getTraining2Report();
                break;
            case 6:
                //ח"מ שנה א'
                await this.getSpecialEducationReport();
                break;
            case 7:
                //ח"מ    שנה ב'
                await this.getSpecialEducation2Report();
                break;
            case 8:
                // מצוינות בהוראה
                await this.getExcellencyReport();
                break;
            case 9:
                // הוראה לתיכונים שנה ב קב 1
                await this.getExcellencyReport();
                break;
            case 12:
                // הוראה לתיכונים שנה ב קב 2
                await this.getExcellencyReport();
                break;
            case 10:
                //תלמידות ו
                await this.getVavReport();
                break;
            case 11:
                // התעמלות ו
                await this.getExerciseReport();
                break;
            case 13:
                // תלמידות ה - תפילה והרצאות
                await this.getPrayerLecturesTestReport();
                break;
            case 14:
                // תלמידות ו - הרצאות
                await this.getPrayerLecturesTestReport();
                break;
            case 15:
                // ניתוח התנהגות
                await this.getBehaviorAnalysisReport();
                break;
            default:
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.studentTypeIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
                break;
        }

        await this.confirmReport();
    }

    async getReportAndSave() {
        await this.validateReportDate();
        await this.getReport();

        try {
            const attReport = {
                user_id: this.user.id,
                student_id: this.student.id,
                report_date: new Date(),
                update_date: new Date(),
            };
            Object.values(this.fields).forEach(key => attReport[key] = this.params[key]);
            console.log('attReport', attReport);
            if (this.reportDateData) {
                console.log('reportDateData', this.reportDateData);
                // לשמור את שמות המרצים בדיווח
                attReport.excellencyExtra1 = this.reportDateData.extra_1;
                attReport.excellencyExtra2 = this.reportDateData.extra_2;
            }
            if (this.reportPeriodData) {
                attReport.report_period_id = this.reportPeriodData.id;
            }
            if (attReport.enterHour) {
                attReport.enterHour = moment(attReport.enterHour, 'HHmm').format('HH:mm');
            }
            if (attReport.exitHour) {
                attReport.exitHour = moment(attReport.exitHour, 'HHmm').format('HH:mm');
            }
            console.log('before save', attReport);
            await new AttReport(attReport).save();
            console.log('after save', attReport);
            if (this.existingReport) {
                await new AttReport().where({ id: this.existingReport.id }).destroy();
            }

            this.globalMsg = this.texts.dataWasSavedSuccessfully;

            if ([13, 14].includes(this.student.student_type_id) && this.params[this.fields.prayerOrLecture] === '3') {
                await this.askForNewReport();
            } else {
                await this.send(
                    this.globalMsgIfExists(),
                    this.hangup()
                );
            }
        }
        catch (e) {
            console.log('catch yemot exception', e);
            await this.send(
                this.id_list_message({ type: 'text', text: this.texts.dataWasNotSaved }),
                this.hangup()
            );
        }
    }

    globalMsgIfExists() {
        const message = this.globalMsg && this.id_list_message({ type: 'text', text: this.globalMsg });
        this.globalMsg = null;
        return message;
    }

    async getKindergartenReport() {
        // לדיווח על עבודה מעשית הקישי 1, לדיווח על מלגות הקישי 2
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askKindergartenType },
                this.fields.kindergartenType, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2] })
        );

        if (!this.existingReport) {
            const reportFilter = {
                [this.fields.kindergartenType]: this.params[this.fields.kindergartenType],
            };
            this.existingReport = await queryHelper.getExistingStudentReport(this.user.id, this.student.id, reportFilter);
        }

        // //הקישי שעת כניסה ב4 ספרות
        // await this.send(
        //     this.read({ type: 'text', text: this.texts.askEnterHour },
        //         this.fields.enterHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        // );
        // //הקישי שעת יציאה ב4 ספרות
        // await this.send(
        //     this.read({ type: 'text', text: this.texts.askExitHour },
        //         this.fields.exitHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        // );

        // לתיקוף כניסה הקישי 1 לתיקוף יציאה הקישי 2 
        await this.send(
            this.read({ type: 'text', text: this.texts.askEnterExitHour },
                'enterExitHour', 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2] })
        );
        if (this.params.enterExitHour === '1') {
            this.params[this.fields.enterHour] = moment().tz('Asia/Jerusalem').format('HHmm');
            return;
        } else {
            this.params[this.fields.enterHour] = this.existingReport?.enterHour?.replace(':', '') || '';
            this.params[this.fields.exitHour] = moment().tz('Asia/Jerusalem').format('HHmm');
        }

        if (this.params[this.fields.kindergartenType] === '1') {
            // //מהי הפעילות שבצעת היום בגן, 	למסירת פעילות באוכל הקישי 1 , 	למסירת שיחה הקישי 2, 	למסירת פעילות תפילה או ברכת המזון הקישי 3
            // await this.send(
            //     this.read({ type: 'text', text: this.texts.askKindergartenActivity },
            //         this.fields.kindergartenActivity, 'tap', { max: 3, min: 1, block_asterisk: true, digits_allowed: [0, 1, 2, 3] })
            // );
            // האם תרצי לדווח על תפילה 
            await this.send(
                this.read({ type: 'text', text: this.texts.askKindergartenActivity1 },
                    this.fields.kindergartenActivity1, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
            );
            // האם תרצי לדווח על פעילות 
            await this.send(
                this.read({ type: 'text', text: this.texts.askKindergartenActivity2 },
                    this.fields.kindergartenActivity2, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
            );
            // האם תרצי לדווח על שיחה
            await this.send(
                this.read({ type: 'text', text: this.texts.askKindergartenActivity3 },
                    this.fields.kindergartenActivity3, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
            );
        } else {
            //הקישי את מספר הגן
            await this.send(
                this.read({ type: 'text', text: this.texts.askKindergartenNumber },
                    this.fields.kindergartenNumber, 'tap', { max: 5, min: 1, block_asterisk: true })
            );
        }
    }

    async getMusicReport() {
        //הקישי את זמן האימון בתוכנת קיובייס בין 1-20
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askKubaseTime },
                this.fields.kubaseTime, 'tap', { max: 3, min: 1, block_asterisk: true })
        );
        //הקישי את זמן האימון בחלילית  בין 1-20
        await this.send(
            this.read({ type: 'text', text: this.texts.askFluteTime },
                this.fields.fluteTime, 'tap', { max: 3, min: 1, block_asterisk: true })
        );
    }

    async getExerciseReport() {
        // "כמה דקות התעמלת היום?" - עד 2 ספרות
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askExercizeTime },
                this.fields.exercizeTime, 'tap', { min: 1, max: 2, block_asterisk: true })
        );
        // "תרגיל 1 האם ביצעת? הקישי אחת אם לא הקישי 0"
        await this.send(
            this.read({ type: 'text', text: this.texts.askExercize1 },
                this.fields.exercize1, 'tap', { min: 1, max: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
        // "תרגיל 2 האם ביצעת? הקישי אחת אם לא הקישי 0"
        await this.send(
            this.read({ type: 'text', text: this.texts.askExercize2 },
                this.fields.exercize2, 'tap', { min: 1, max: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
        // "תרגיל 3 האם ביצעת? הקישי אחת אם לא הקישי 0"
        await this.send(
            this.read({ type: 'text', text: this.texts.askExercize3 },
                this.fields.exercize3, 'tap', { min: 1, max: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
        // "תרגיל 4 האם ביצעת? הקישי אחת אם לא הקישי 0"
        await this.send(
            this.read({ type: 'text', text: this.texts.askExercize4 },
                this.fields.exercize4, 'tap', { min: 1, max: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
        // // "תרגיל 5 האם ביצעת? הקישי אחת אם לא הקישי 0"
        // await this.send(
        //     this.read({ type: 'text', text: this.texts.askExercize5 },
        //         this.fields.exercize5, 'tap', { min: 1, max: 1, block_asterisk: true, digits_allowed: [0, 1] })
        // );
    }

    async getTrainingReport() {
        //כמה שיעורי הקנית קריאה מסרת היום?
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askHaknayaLessons },
                this.fields.haknayaLessons, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //כמה שיעורי תיקון קריאה מסרת היום
        await this.send(
            this.read({ type: 'text', text: this.texts.askTikunLessons },
                this.fields.tikunLessons, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //כמה שיעורי חשבון מסרת היום
        await this.send(
            this.read({ type: 'text', text: this.texts.askMathLessons },
                this.fields.mathLessons, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //סך הכל מסרת 2 שיעורים בקריאה ו3 שיעורים בחשבון, לאישור הקישי 1
    }

    async getTraining2Report() {
        //לתיקוף שעורי עבודה מעשית הקישי 1, לתיקוף פרטני הקישי 2
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askTrainingTypeSecondYear },
                this.fields.trainingType, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2] })
        );
        //עבודה מעשית
        if (this.params[this.fields.trainingType] === '1') {
            //הקישי שעת כניסה ב4 ספרות
            await this.send(
                this.read({ type: 'text', text: this.texts.askEnterHour },
                    this.fields.enterHour, 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            //הקישי שעת יציאה ב4 ספרות
            await this.send(
                this.read({ type: 'text', text: this.texts.askExitHour },
                    this.fields.exitHour, 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            //האם מסרת שיעור? אם כן הקישי 1, אם לא הקישי 0
            await this.send(
                this.read({ type: 'text', text: this.texts.askWasLessonTeaching },
                    this.fields.wasLessonTeaching, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
            );
            // לשמוע סיכום
        }
        //פרטני
        // if(this.params[this.fields.trainingType] === '2')
        else {
            // הקישי את אורך השיעור בהבנת הנקרא
            await this.send(
                this.read({ type: 'text', text: this.texts.askLessonLengthHavana },
                    this.fields.lessonLengthHavana, 'tap', { max: 2, min: 1, block_asterisk: true })
            );
            // הקישי את אורך השיעור בכתיב
            await this.send(
                this.read({ type: 'text', text: this.texts.askLessonLengthKtiv },
                    this.fields.lessonLengthKtiv, 'tap', { max: 2, min: 1, block_asterisk: true })
            );
            // לשמוע סיכום
        }
    }

    async getSpecialEducationReport() {
        //הקישי שעת כניסה ב4 ספרות
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askEnterHour },
                this.fields.enterHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        );
        //הקישי שעת יציאה ב4 ספרות
        await this.send(
            this.read({ type: 'text', text: this.texts.askExitHour },
                this.fields.exitHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        );
        //  אם השתתפת בדיון טלפוני עם המורה הקישי 1 אם לא הקישי 0
        await this.send(
            this.read({ type: 'text', text: this.texts.askPhoneDiscussing },
                this.fields.phoneDiscussing, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
        //  אם מסרת שעור הקישי 1 אם לא הקישי 0
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasLessonTeaching },
                this.fields.wasLessonTeaching, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
    }

    async getSpecialEducation2Report() {
        //לתיקוף צפיה הקישי 1 לתיקוף סנוזלן הקישי 2 
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askSpecialEdicationType },
                this.fields.specialEdicationType, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2] })
        );
        //הקישי שעת כניסה ב4 ספרות
        await this.send(
            this.read({ type: 'text', text: this.texts.askEnterHour },
                this.fields.enterHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        );
        //הקישי שעת יציאה ב4 ספרות
        await this.send(
            this.read({ type: 'text', text: this.texts.askExitHour },
                this.fields.exitHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        );
        // צפיה
        if (this.params[this.fields.trainingType] === '1') {
            // סנוזלן
        } else {
            // הקישי מ-1 עד 5 את היום בשבוע של מפגש הסנוזלן
            await this.send(
                this.read({ type: 'text', text: this.texts.askSnoozlenDay },
                    this.fields.snoozlenDay, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2, 3, 4, 5] })
            );
        }
    }

    async getBehaviorAnalysisReport() {
        if (!this.existingReport) {
            this.existingReport = await queryHelper.getExistingStudentReport(this.user.id, this.student.id);
        }

        // לתיקוף כניסה הקישי 1 לתיקוף יציאה הקישי 2 
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askEnterExitHour },
                'enterExitHour', 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2] })
        );
        if (this.params.enterExitHour === '1') {
            this.params[this.fields.enterHour] = moment().tz('Asia/Jerusalem').format('HHmm');
            return;
        } else {
            this.params[this.fields.enterHour] = this.existingReport?.enterHour?.replace(':', '') || '';
            this.params[this.fields.exitHour] = moment().tz('Asia/Jerusalem').format('HHmm');

            // האם מסרת שיעור? אם כן הקישי 1, אם לא הקישי 0
            await this.send(
                this.read({ type: 'text', text: this.texts.askWasLessonTeaching },
                    this.fields.wasLessonTeaching, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
            );
        }
    }

    async getExcellencyReport() {
        // עם 2 שאלות - לשאול סתם - נוכחות ושיעורי בית
        await this.send(
            this.read({ type: 'text', text: this.texts.askExcellencyAtt },
                this.fields.excellencyAtt, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1, 2, 3] })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askExcellencyHomework },
                this.fields.excellencyHomework, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1, 2, 3] })
        );
    }

    async getVavReport() {
        // שאלה פתוחה
        await this.send(
            this.read({ type: 'text', text: this.texts.askOpenQuestion },
                this.fields.openQuestion, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getPrayerLecturesTestReport() {
        const testQuestions = {
            [13]: {
                'start': { field: this.fields.prayerOrLecture, text: this.texts.askPrayerOrLecture },
                'general': { field: this.fields.testGeneral, text: this.texts.askTestGeneral },
                1: { field: this.fields.test1, text: this.texts.askTest1 },
                2: { field: this.fields.test2, text: this.texts.askTest2 },
                7: { field: this.fields.test7, text: this.texts.askTest7 },
            },
            [14]: {
                'start': { field: this.fields.prayerOrLecture, text: this.texts.askPrayerOrLecture6 },
                'general': { field: this.fields.testGeneral, text: this.texts.askTestGeneral6 },
                1: { field: this.fields.test1, text: this.texts.ask6Test1 },
                2: { field: this.fields.test2, text: this.texts.ask6Test2 },
            }
        }
        const questionSet = testQuestions[this.student.student_type_id];

        if (!this.params[questionSet.start.field]) { // if not already answered
            await this.send(
                this.globalMsgIfExists(),
                this.read({ type: 'text', text: questionSet.start.text },
                    questionSet.start.field, 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2, 3] })
            );
        }

        if (this.params[this.fields.prayerOrLecture] === '1') {
            await this.getPrayerReport();
        } else if (this.params[this.fields.prayerOrLecture] === '2') {
            await this.getLecturesReport();
        } else if (this.params[this.fields.prayerOrLecture] === '3') {
            if (!this.testNames) {
                this.testNames = await queryHelper.getTestNames(this.user.id, this.student.student_type_id);
            }
            await this.getTestReport(questionSet);
        }
    }

    async getPrayerReport() {
        await this.checkReportPeriod(reportTypes.prayer);
        if (!this.existingReport) {
            this.existingReport = await queryHelper.getExistingStudentReportByReportPeriod(this.user.id, this.student.id, this.reportPeriodData.id);
        }

        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askPrayer0 },
                this.fields.prayer0, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askPrayer1 },
                this.fields.prayer1, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askPrayer2 },
                this.fields.prayer2, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askPrayer3 },
                this.fields.prayer3, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askPrayer4 },
                this.fields.prayer4, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askPrayer5 },
                this.fields.prayer5, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
    }

    async getLecturesReport() {
        await this.checkReportPeriod(reportTypes.lecture);
        if (!this.existingReport) {
            this.existingReport = await queryHelper.getExistingStudentReportByReportPeriod(this.user.id, this.student.id, this.reportPeriodData.id);
        }

        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askLecture1 },
                this.fields.lecture1, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askLecture2 },
                this.fields.lecture2, 'tap', { max: 2, min: 1, block_asterisk: true })
        );
        // await this.send(
        //     this.read({ type: 'text', text: this.texts.askLecture3 },
        //         this.fields.lecture3, 'tap', { max: 2, min: 1, block_asterisk: true })
        // );
    }

    async getTestReport(questionSet) {
        // delete existing answers
        for (const key in questionSet) {
            if (key !== 'start' && key !== 'general') {
                delete this.params[questionSet[key].field];
            }
        }

        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: questionSet.general.text },
                questionSet.general.field, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        const testGeneral = this.params[this.fields.testGeneral];
        const nextQuestion = questionSet[testGeneral];
        if (nextQuestion) {
            const { field, text } = nextQuestion;
            await this.send(
                this.read({ type: 'text', text: text },
                    field, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            this.params[this.fields.testCombined] = this.params[this.fields.testGeneral] + this.params[field];
        } else {
            this.params[this.fields.testCombined] = this.params[this.fields.testGeneral];
        }
    }



    // helpers
    async askForNewReport() {
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askIsNewReport },
                'isNewReport', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        if (this.params.isNewReport == 1) {
            return this.getReportAndSave();
        } else {
            await this.send(
                this.id_list_message({ type: 'text', text: this.texts.dataWasSavedSuccessfully }),
                this.hangup()
            )
        }
    }

    async checkReportPeriod(reportType) {
        this.reportPeriodData = await queryHelper.getCurrentReportPeriod(this.user.id, this.student.student_type_id, reportType);
        if (!this.reportPeriodData) {
            return this.send(
                this.id_list_message({ type: 'text', text: this.texts.reportPeriodIsInvalid }),
                this.hangup()
            );
        }
    }

    async confirmReport() {
        // on end - ask student to confirm what she did
        const confirmationMessage = this.getConfirmationMessage();
        if (!confirmationMessage) {
            return;
        }

        await this.send(
            this.read({ type: 'text', text: confirmationMessage },
                'confirmReport', 'tap', { min: 1, max: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
        if (this.params.confirmReport === '0') {
            this.globalMsg = this.texts.notConfirmedAskingAgain;
            return this.getReport();
        }
        delete this.params.confirmReport;
    }

    getConfirmationMessage() {
        switch (this.student.student_type_id) {
            case 1:
                //גננות
                break;
            case 2:
                //מוזיקה
                break;
            case 3:
                //התעמלות
                return format(this.texts.askExercizeReportConfirm, this.params[this.fields.exercizeTime], this.params[this.fields.exercize1], this.params[this.fields.exercize2], this.params[this.fields.exercize3], this.params[this.fields.exercize4], this.params[this.fields.exercize5]);
            case 4:
                //הוראה מתקנת
                const readingLessons = parseInt(this.params[this.fields.haknayaLessons]) + parseInt(this.params[this.fields.tikunLessons]);
                return format(this.texts.askTrainingReportConfirm, readingLessons, this.params[this.fields.mathLessons]);
            case 5:
                //הומ שנה ב
                //עבודה מעשית
                if (this.params[this.fields.trainingType] === '1') {
                    return format(this.texts.askTraining21ReportConfirm, this.params[this.fields.enterHour], this.params[this.fields.exitHour], this.params[this.fields.wasLessonTeaching]);
                }
                //פרטני
                // if(this.params[this.fields.trainingType] === '2')
                else {
                    return format(this.texts.askTraining22ReportConfirm, this.params[this.fields.lessonLengthHavana], this.params[this.fields.lessonLengthKtiv]);
                }
            case 6:
                //ח"מ שנה א'
                break;
            case 7:
                //ח"מ    שנה ב'
                break;
            case 8:
                // מצוינות בהוראה
                break;
            case 9:
                // הוראה לתיכונים שנה ב קב 1
                break;
            case 12:
                // הוראה לתיכונים שנה ב קב 3
                break;
            case 10:
                //תלמידות ו
                break;
            case 11:
                // התעמלות ו
                break;
            case 13:
                // תלמידות ה - תפילה והרצאות
                if (this.params[this.fields.prayerOrLecture] === '1') {
                    return format(this.texts.askPrayerReportConfirm, this.params[this.fields.prayer0], this.params[this.fields.prayer1], this.params[this.fields.prayer2], this.params[this.fields.prayer3], this.params[this.fields.prayer4], this.params[this.fields.prayer5]);
                } else if (this.params[this.fields.prayerOrLecture] === '2') {
                    return format(this.texts.askLecturesReportConfirm, this.params[this.fields.lecture1], this.params[this.fields.lecture2], this.params[this.fields.lecture3]);
                } else if (this.params[this.fields.prayerOrLecture] === '3') {
                    const testId = this.params[this.fields.testCombined];
                    return format(this.texts.askTestReportConfirm, this.testNames[testId] || testId);
                }
            case 14:
                // תלמידות ו - הרצאות
                if (this.params[this.fields.prayerOrLecture] === '1') {
                    return format(this.texts.askPrayerReportConfirm, this.params[this.fields.prayer0], this.params[this.fields.prayer1], this.params[this.fields.prayer2], this.params[this.fields.prayer3], this.params[this.fields.prayer4], this.params[this.fields.prayer5]);
                } else if (this.params[this.fields.prayerOrLecture] === '2') {
                    return format(this.texts.askLecturesReportConfirm, this.params[this.fields.lecture1], this.params[this.fields.lecture2], this.params[this.fields.lecture3]);
                } else if (this.params[this.fields.prayerOrLecture] === '3') {
                    const testId = this.params[this.fields.testCombined];
                    return format(this.texts.askTestReportConfirm, this.testNames[testId] || testId);
                }
            case 15:
                // ניתוח התנהגות
                break;
        }
    }

    async validateReportDate() {
        if (![8, 9, 12].includes(this.student.student_type_id)) {
            return;
        }
        console.log('validateReportDate');
        this.reportDateData = await queryHelper.validateReportDate(this.user.id, this.student.student_type_id, this.student.id);
        if (!this.reportDateData) {
            return this.send(
                this.id_list_message({ type: 'text', text: this.texts.excellencyReportDateIsInvalid }),
                this.hangup()
            );
        }
    }
}
