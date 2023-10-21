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
            default:
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.studentTypeIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
                break;
        }

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

            if ([4].includes(this.student.student_type_id)) {
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

        // on end - ask student to confirm what she did
        const confirmationMessage = format(this.texts.askExercizeReportConfirm, this.params[this.fields.exercizeTime], this.params[this.fields.exercize1], this.params[this.fields.exercize2], this.params[this.fields.exercize3], this.params[this.fields.exercize4], this.params[this.fields.exercize5]);
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

    async getTrainingReport() {
        //לתיקוף שעורי עבודה מעשית הקישי 1, לתיקוף נוכחות בצפיה הקישי 2
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askTrainingType },
                this.fields.trainingType, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //עבודה מעשית
        if (this.params[this.fields.trainingType] === '1') {
            //לשיעור בקריאה הקישי 1, לשיעור בחשבון הקישי 2
            await this.send(
                this.read({ type: 'text', text: this.texts.askTrainingLessonType },
                    this.fields.trainingLessonType, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //קריאה
            if (this.params[this.fields.trainingLessonType] === '1') {
                //לשיעור הקניה הקישי 1, לשיעור תיקון קריאה הקישי 2
                await this.send(
                    this.read({ type: 'text', text: this.texts.askTrainingReadingType },
                        this.fields.trainingReadingType, 'tap', { max: 1, min: 1, block_asterisk: true })
                );
            }
            //חשבון
            // if (this.params[this.fields.trainingLessonType] === '2')
            else {
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
            }
        }
        //נוכחות בצפיה
        // if(this.params[this.fields.trainingType] === '2')
        else {
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
        }
    }

    async getTraining2Report() {
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
}
