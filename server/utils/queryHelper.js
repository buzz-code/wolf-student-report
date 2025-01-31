import { Teacher, AttReport, User, Question, Answer, WorkingDate, Student, Price, ExcellencyDate, ReportPeriod, TestName } from "../models";

import moment from 'moment';

export function getUserByPhone(phone_number) {
    return new User().where({ phone_number })
        .fetch()
        .then(res => res.toJSON());
}

export function getStudentByUserIdAndPhone(user_id, phone) {
    return new Student().where({ 'students.user_id': user_id, phone })
        .query(qb => {
            qb.leftJoin('student_types', { 'student_types.key': 'students.student_type_id', 'student_types.user_id': 'students.user_id' })
            qb.select('students.*')
            qb.select({ student_type_name: 'student_types.name' })
        })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}





export function getReportByTeacherIdAndToday(user_id, teacher_id, report_date) {
    return new AttReport().where({ user_id, teacher_id, report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export function getPreviousReportsByTeacherAndDates(user_id, teacher_id, start_report_date, end_report_date) {
    return new AttReport().where({ user_id, teacher_id })
        .where('report_date', '>=', start_report_date.format('YYYY-MM-DD'))
        .where('report_date', '<=', end_report_date.format('YYYY-MM-DD'))
        .fetchAll()
        .then(result => result.toJSON());
}

export function updateSalaryMonthByUserId(user_id, ids, salary_month) {
    return new AttReport().query()
        .where({ user_id, salary_month: null })
        .whereIn('id', ids)
        .update({ salary_month });
}

export function updateSalaryCommentByUserId(user_id, id, comment) {
    return new AttReport().query()
        .where({ user_id, id })
        .update({ comment });
}

export async function getQuestionsForTeacher(user_id, teacher_id, teacher_type_id) {
    const [answers, questions] = await Promise.all([
        new Answer()
            .where({ user_id, teacher_id })
            .fetchAll()
            .then(result => result.toJSON()),
        new Question()
            .where({ 'questions.user_id': user_id, teacher_type_id })
            .where('start_date', '<=', moment().format('YYYY-MM-DD'))
            .where('end_date', '>=', moment().format('YYYY-MM-DD'))
            .query(qb => {
                qb.leftJoin('question_types', 'question_types.key', 'questions.question_type_id')
                qb.select('questions.*')
                qb.select({ question_type_key: 'question_types.key' })
            })
            .fetchAll()
            .then(result => result.toJSON())
    ]);

    const answerByQuestion = {};
    answers.forEach(ans => {
        if (!answerByQuestion[ans.question_id]) {
            answerByQuestion[ans.question_id] = [[false, false]];
        }
        answerByQuestion[ans.question_id][ans.answer] = true;
    });
    return questions.filter(question => {
        return question.question_type_key == 1 ||
            question.question_type_key == 2 && answerByQuestion[question.id]?.[1] == false ||
            question.question_type_key == 3 && answerByQuestion[question.id]?.[0] == false
    });
}

export function saveAnswerForQuestion(user_id, teacher_id, question_id, answer) {
    return new Answer({
        user_id,
        teacher_id,
        question_id,
        answer,
        answer_date: moment().format('YYYY-MM-DD')
    })
        .save();
}

export function getAbsencesCountForTeacher(user_id, teacher_id, report_date) {
    return new AttReport().where({ user_id, teacher_id })
        .query()
        .whereBetween('report_date', [
            moment(report_date, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD'),
            moment(report_date, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
        ])
        .sum({ sum: 'how_many_lessons_absence' })
        .then(res => res[0].sum);
}

export async function validateWorkingDateForTeacher(user_id, teacher_type_id, report_date) {
    return new WorkingDate()
        .where({ user_id, teacher_type_id, working_date: report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getTeacherByFourLastDigits(user_id, four_last_digits) {
    return new Teacher()
        .where({ user_id })
        .where('phone', 'like', `%${four_last_digits}`)
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getStudentByTz(user_id, tz) {
    return new Student()
        .where({ user_id, tz })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getPrices(user_id) {
    const data = await new Price()
        .where({ user_id })
        .fetchAll()
        .then(result => result.toJSON());
    const dict = data.reduce((a, b) => ({ ...a, [b.key]: b.price }), {});
    return dict;
}

export async function validateReportDate(user_id, student_type_id, student_id) {
    const report_date = moment().format('YYYY-MM-DD');
    const date = await new ExcellencyDate()
        .where({ user_id, student_type_id, report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
    if (!date) {
        return null;
    }
    const existing = await new AttReport()
        .where({ user_id, student_id, report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
    if (existing) {
        return null;
    }
    return date;
}

export async function getExistingStudentReportByReportPeriod(user_id, student_id, report_period_id) {
    return new AttReport()
        .where({ user_id, student_id, report_period_id })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getExistingStudentReportByReportDate(user_id, student_id, report_date = moment().format('YYYY-MM-DD')) {
    return new AttReport()
        .where({ user_id, student_id, report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getExistingStudentReport(user_id, student_id, filter = {}, report_date = moment().format('YYYY-MM-DD')) {
    return new AttReport()
        .where({ user_id, student_id, ...filter, report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getCurrentReportPeriod(user_id, student_type_id, report_type) {
    const report_date = moment().format('YYYY-MM-DD');
    return new ReportPeriod()
        .where({ user_id, student_type_id, report_type })
        .where('start_report_date', '<=', report_date)
        .where('end_report_date', '>=', report_date)
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getTestNames(user_id, student_type_id) {
    const data = await new TestName()
        .where({ user_id, student_type_id })
        .fetchAll()
        .then(result => result.toJSON());
    const dict = data.reduce((a, b) => ({ ...a, [b.key]: b.name }), {});
    return dict;
}
