import { CallBase } from "../../common-modules/server/utils/callBase";
import format from 'string-format';
import moment from "moment";
import * as queryHelper from './queryHelper';
import { AttReport } from "../models";
import { formatJewishDateHebrew, getJewishDate } from "jewish-dates-core";

export class YemotCall extends CallBase {
    constructor(params, callId, user) {
        super(params, callId, user);
    }

    fields = {
        enterHour: 'enterHour',
        exitHour: 'exitHour',
        kindergartenActivity: 'kindergartenActivity',
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
    }

    async start() {
        console.log('start call');
        await this.getTexts();
        console.log('gt texts');
        try {
            this.student = await queryHelper.getStudentByUserIdAndPhone(this.user.id, this.params.ApiPhone);
            console.log('got student')
            if (!this.student) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.phoneIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
            }

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

    async getReportAndSave() {
        await this.validateReportDate();

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
                // הוראה לתיכונים שנה ב
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
            default:
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.studentTypeIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
                break;
        }

        await this.confirmReport();

        try {
            const attReport = {
                user_id: this.user.id,
                student_id: this.student.id,
                report_date: new Date(),
                update_date: new Date(),
            };
            Object.values(this.fields).forEach(key => attReport[key] = this.params[key]);
            console.log('before save', attReport);
            await new AttReport(attReport).save();
            console.log('after save', attReport);
            if (this.existingReport) {
                await new AttReport().where({ id: this.existingReport.id }).destroy();
            }

            this.globalMsg = this.texts.dataWasSavedSuccessfully;

            if ([].includes(this.student.student_type_id)) {
                this.askForNewReport();
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
        //מהי הפעילות שבצעת היום בגן, 	למסירת פעילות באוכל הקישי 1 , 	למסירת שיחה הקישי 2, 	למסירת פעילות תפילה או ברכת המזון הקישי 3
        await this.send(
            this.read({ type: 'text', text: this.texts.askKindergartenActivity },
                this.fields.kindergartenActivity, 'tap', { max: 3, min: 1, block_asterisk: true })
        );
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
                this.fields.trainingType, 'tap', { max: 1, min: 1, block_asterisk: true })
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
                    this.fields.wasLessonTeaching, 'tap', { max: 1, min: 1, block_asterisk: true })
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
                this.fields.phoneDiscussing, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //  אם מסרת שעור הקישי 1 אם לא הקישי 0
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasLessonTeaching },
                this.fields.wasLessonTeaching, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getSpecialEducation2Report() {
        //לתיקוף צפיה הקישי 1 לתיקוף סנוזלן הקישי 2 
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askSpecialEdicationType },
                this.fields.specialEdicationType, 'tap', { max: 1, min: 1, block_asterisk: true })
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
                    this.fields.snoozlenDay, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        }
    }

    async getExcellencyReport() {
        // עם 2 שאלות - לשאול סתם - נוכחות ושיעורי בית
        await this.send(
            this.read({ type: 'text', text: this.texts.askExcellencyAtt },
                this.fields.excellencyAtt, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.askExcellencyHomework },
                this.fields.excellencyHomework, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getVavReport() {
        // שאלה פתוחה
        await this.send(
            this.read({ type: 'text', text: this.texts.askOpenQuestion },
                this.fields.openQuestion, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }


    // helpers
    async askForNewReport() {
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askIsNewReport },
                'isNewReport', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        if (this.params.isNewReport == 1) {
            this.getReportAndSave();
        } else {
            this.send(
                this.hangup(),
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
                this.fields.confirmReport, 'tap', { min: 1, max: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );
        if (this.params[this.fields.confirmReport] === '0') {
            this.globalMsg = this.texts.notConfirmedAskingAgain;
            return this.getExerciseReport();
        }
        delete this.params[this.fields.confirmReport];
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
                // הוראה לתיכונים שנה ב
                break;
            case 10:
                //תלמידות ו
                break;
            case 11:
                // התעמלות ו
                break;
        }
    }

    async validateReportDate() {
        const isValidReportDate = await queryHelper.validateReportDate(this.user.id, this.student.student_type_id, this.student.id);
        if (!isValidReportDate) {
            return this.send(
                this.id_list_message({ type: 'text', text: this.texts.excellencyReportDateIsInvalid }),
                this.hangup()
            );
        }
    }
}
