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
        exercizeType: 'exercizeType',
        exercizeHeart: 'exercizeHeart',
        exercizeStomach: 'exercizeStomach',
        exercizeBreast: 'exercizeBreast',
        exercizeLegs: 'exercizeLegs',
        exercizePlank: 'exercizePlank',
        exercizeLaying: 'exercizeLaying',
        exercizeJump: 'exercizeJump',
        exercizeShortRun: 'exercizeShortRun',
        trainingType: 'trainingType',
        trainingLessonType: 'trainingLessonType',
        trainingReadingType: 'trainingReadingType',
        wasLessonTeaching: 'wasLessonTeaching',
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
                //??????????
                await this.getKindergartenReport();
                break;
            case 2:
                //????????????
                await this.getMusicReport();
                break;
            case 3:
                //??????????????
                await this.getExerciseReport();
                break;
            case 4:
                //?????????? ??????????
                await this.getTrainingReport();
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
            await new AttReport(attReport).save();
            if (this.existingReport) {
                await new AttReport().where({ id: this.existingReport.id }).destroy();
            }

            await this.send(
                this.id_list_message({ type: 'text', text: this.texts.dataWasSavedSuccessfully }),
                this.hangup()
            );
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
        //?????????? ?????? ?????????? ??4 ??????????
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askEnterHour },
                this.fields.enterHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        );
        //?????????? ?????? ?????????? ??4 ??????????
        await this.send(
            this.read({ type: 'text', text: this.texts.askExitHour },
                this.fields.exitHour, 'tap', { max: 4, min: 4, block_asterisk: true })
        );
        //?????? ?????????????? ?????????? ???????? ??????, ???	???????????? ???????????? ?????????? ?????????? 1 , ???	???????????? ???????? ?????????? 2, ???	???????????? ???????????? ?????????? ???? ???????? ?????????? ?????????? 3
        await this.send(
            this.read({ type: 'text', text: this.texts.askKindergartenActivity },
                this.fields.kindergartenActivity, 'tap', { max: 3, min: 1, block_asterisk: true })
        );
    }

    async getMusicReport() {
        //?????????? ???? ?????? ???????????? ???????????? ?????????????? ?????? 1-20
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askKubaseTime },
                this.fields.kubaseTime, 'tap', { max: 3, min: 1, block_asterisk: true })
        );
        //?????????? ???? ?????? ???????????? ??????????????  ?????? 1-20
        await this.send(
            this.read({ type: 'text', text: this.texts.askFluteTime },
                this.fields.fluteTime, 'tap', { max: 3, min: 1, block_asterisk: true })
        );
    }

    async getExerciseReport() {
        //???????????? ???????? ?????????? 1 ???????????? ???????????? ?????????? 2
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askExercizeType },
                this.fields.exercizeType, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //?????????? ????????
        if (this.params[this.fields.exercizeType] === '1') {
            //???? ???????????? ???? ???????????? ???? ???????? ?????????? 1 ???? ???? ?????????? 0 
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizeHeart },
                    this.fields.exercizeHeart, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //???? ???????????? ???? ?????????? ?????? ?????????? 1 ???? ???? ?????????? 0
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizeStomach },
                    this.fields.exercizeStomach, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //???? ???????????? ???? ?????????? ?????? ?????????????? ?????????? 1 ???? ???? ?????????? 0
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizeBreast },
                    this.fields.exercizeBreast, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //???? ???????????? ???? ?????????? ???????????? ?????????? 1 ???? ???? ?????????? 0
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizeLegs },
                    this.fields.exercizeLegs, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        }
        //?????????? ????????????
        // if (this.params[this.fields.exercizeType] === '2')
        else {
            //?????????? ??1 ???? 100 ???? ???????????? ????????????  ????????????
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizePlank },
                    this.fields.exercizePlank, 'tap', { max: 4, min: 1, block_asterisk: true })
            );
            //?????????? ??1 ???? 100 ???? ???????????? ????????????  ?????????????? ??????????
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizeLaying },
                    this.fields.exercizeLaying, 'tap', { max: 4, min: 1, block_asterisk: true })
            );
            //?????????? ??1 ???? 100 ???? ???????????? ????????????  ?????????????? ????????
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizeJump },
                    this.fields.exercizeJump, 'tap', { max: 4, min: 1, block_asterisk: true })
            );
            //?????????? ??1 ???? 100 ???? ???????????? ????????????  ?????????? ????????
            await this.send(
                this.read({ type: 'text', text: this.texts.askExercizeShortRun },
                    this.fields.exercizeShortRun, 'tap', { max: 4, min: 1, block_asterisk: true })
            );
        }
    }

    async getTrainingReport() {
        //???????????? ?????????? ?????????? ?????????? ?????????? 1, ???????????? ???????????? ?????????? ?????????? 2
        await this.send(
            this.globalMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askTrainingType },
                this.fields.trainingType, 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //?????????? ??????????
        if (this.params[this.fields.trainingType] === '1') {
            //???????????? ???????????? ?????????? 1, ???????????? ???????????? ?????????? 2
            await this.send(
                this.read({ type: 'text', text: this.texts.askTrainingLessonType },
                    this.fields.trainingLessonType, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //??????????
            if (this.params[this.fields.trainingLessonType] === '1') {
                //???????????? ?????????? ?????????? 1, ???????????? ?????????? ?????????? ?????????? 2
                await this.send(
                    this.read({ type: 'text', text: this.texts.askTrainingReadingType },
                        this.fields.trainingReadingType, 'tap', { max: 1, min: 1, block_asterisk: true })
                );
            }
            //??????????
            // if (this.params[this.fields.trainingLessonType] === '2')
            else {
                //?????????? ?????? ?????????? ??4 ??????????
                await this.send(
                    this.read({ type: 'text', text: this.texts.askEnterHour },
                        this.fields.enterHour, 'tap', { max: 4, min: 4, block_asterisk: true })
                );
                //?????????? ?????? ?????????? ??4 ??????????
                await this.send(
                    this.read({ type: 'text', text: this.texts.askExitHour },
                        this.fields.exitHour, 'tap', { max: 4, min: 4, block_asterisk: true })
                );
            }
        }
        //???????????? ??????????
        // if(this.params[this.fields.trainingType] === '2')
        else {
            //?????????? ?????? ?????????? ??4 ??????????
            await this.send(
                this.read({ type: 'text', text: this.texts.askEnterHour },
                    this.fields.enterHour, 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            //?????????? ?????? ?????????? ??4 ??????????
            await this.send(
                this.read({ type: 'text', text: this.texts.askExitHour },
                    this.fields.exitHour, 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            //?????? ???????? ??????????? ???? ???? ?????????? 1, ???? ???? ?????????? 0
            await this.send(
                this.read({ type: 'text', text: this.texts.askWasLessonTeaching },
                    this.fields.wasLessonTeaching, 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        }
    }
}
