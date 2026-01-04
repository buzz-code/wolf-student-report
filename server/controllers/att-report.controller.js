import { AttReport, Student, StudentType, ExcellencyDate, Specialty } from '../models';
import { applyFilters, fetchPage, fetchPagePromise } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';
import bookshelf from '../../common-modules/server/config/bookshelf';
import moment from 'moment';
import { formatJewishDateHebrew, getJewishDate } from 'jewish-dates-core';

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('students', 'students.id', 'att_reports.student_id')
            qb.leftJoin('student_types', { 'student_types.key': 'students.student_type_id', 'student_types.user_id': 'students.user_id' })
            qb.leftJoin('student_specialties', { 'student_specialties.student_tz': 'students.tz', 'student_specialties.user_id': 'students.user_id' })
            qb.select('att_reports.*')
            qb.select({
                student_tz: 'students.tz',
                student_klass_name: 'students.klass',
                student_type_name: 'student_types.name',
                student_phone: 'students.phone',
                student_specialty_key: 'student_specialties.specialty_key',
            })
        });
    applyFilters(dbQuery, req.query.filters);
    fetchPage({ dbQuery }, req.query, res);
}

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [students, studentTypes, specialties] = await Promise.all([
        getListFromTable(Student, req.currentUser.id),
        getListFromTable(StudentType, req.currentUser.id, 'key'),
        getListFromTable(Specialty, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { students, studentTypes, specialties }
    });
}

export async function getPivotData(req, res) {
    const studentFilters = [];
    const reportFilters = [];
    let pivotGroupBy = getWeekStart;
    if (req.query.filters) {
        const filtersObj = JSON.parse(req.query.filters);
        for (const filter of Object.values(filtersObj)) {
            if (filter.field.startsWith('student')) {
                studentFilters.push(filter);
            } else if (filter.field === 'pivotGropuBy') {
                pivotGroupBy = filter.value === 'day' ? getDayStart : getWeekStart;
            } else {
                reportFilters.push(filter);
            }
        }
    }

    const dbQuery = new Student()
        .where({ 'students.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('student_types', { 'student_types.key': 'students.student_type_id', 'student_types.user_id': 'students.user_id' })
            qb.leftJoin('student_specialties', { 'student_specialties.student_tz': 'students.tz', 'student_specialties.user_id': 'students.user_id' })
            qb.select({
                student_id: 'students.id',
                student_tz: 'students.tz',
                student_type_name: 'student_types.name',
                student_specialty_key: 'student_specialties.specialty_key'
            })
        });

    applyFilters(dbQuery, JSON.stringify(studentFilters));
    const countQuery = dbQuery.clone().query()
        .clearSelect()
        .clearGroup()
        .countDistinct({ count: ['students.id', 'students.name'] })
        .then(res => res[0].count);
    const studentsRes = await fetchPagePromise({ dbQuery, countQuery }, req.query);

    const pivotQuery = new AttReport()
        .where('att_reports.student_id', 'in', studentsRes.data.map(item => item.student_id));

    applyFilters(pivotQuery, JSON.stringify(reportFilters));
    const pivotRes = await fetchPagePromise({ dbQuery: pivotQuery }, { page: 0, pageSize: 1000 * req.query.pageSize, /* todo:orderBy */ });

    const pivotData = studentsRes.data;
    const pivotDict = pivotData.reduce((prev, curr) => ({ ...prev, [curr.student_id]: curr }), {});
    pivotRes.data.forEach(item => {
        if (pivotDict[item.student_id].total === undefined) {
            pivotDict[item.student_id].total = 0;
        }
        const key = pivotGroupBy(item.report_date);
        if (pivotDict[item.student_id][key] === undefined) {
            pivotDict[item.student_id][key] = 0;
            pivotDict[item.student_id][key + '_title'] = formatJewishDateHebrew(getJewishDate(new Date(key)));
        }
        pivotDict[item.student_id][key] += 1;
        pivotDict[item.student_id].total += 1;
    })

    res.send({
        error: null,
        data: pivotData,
        page: studentsRes.page,
        total: studentsRes.total,
    })
}

function getWeekStart(reportDate) {
    return moment(reportDate).startOf('week').toDate().getTime();
}

function getDayStart(reportDate) {
    return moment(reportDate).startOf('day').toDate().getTime();
}

export async function getExcellencyTotalReport(req, res) {
    console.log('test log to prove update')
    const dbQuery = new ExcellencyDate().where({ 'excellency_dates.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('student_types', { 'student_types.key': 'excellency_dates.student_type_id', 'student_types.user_id': req.currentUser.id })
            qb.leftJoin('students', { 'students.student_type_id': 'excellency_dates.student_type_id', 'students.user_id': req.currentUser.id })
            qb.leftJoin('att_reports', { 'students.id': 'att_reports.student_id', 'att_reports.report_date': 'excellency_dates.report_date' })
            qb.where('student_types.key', 'in', [8, 9, 12])
        });
    applyFilters(dbQuery, req.query.filters);

    const groupByColumns = ['students.id'];

    const countQuery = dbQuery.clone().query()
        .countDistinct({ count: groupByColumns })
        .then(res => res[0].count);

    dbQuery.query(qb => {
        qb.groupBy(groupByColumns)
        qb.select({
            student_name: 'students.name',
            student_id: 'students.id',
            student_tz: 'students.tz',
            student_type_id: 'students.student_type_id'
        })
        const total_lessons = `(SUM(IF((COALESCE(excellency_dates.extra_1, '') != '') = (COALESCE(excellency_dates.extra_2, '') != ''), 2, 1)))`;
        const getColumnCount = (column) => `(SUM(IF(${column} = 1, 1, IF(${column} = 3, 0.5, 0))))`;
        const att_lessons = `(${getColumnCount('att_reports.excellencyAtt')} + ${getColumnCount('att_reports.excellencyHomework')})`;
        const abs_lessons = `(${total_lessons} - ${att_lessons})`;
        const getPercents = (selection) => `CONCAT(ROUND(${selection} * 100), '%')`
        qb.select({
            total_lessons: bookshelf.knex.raw(total_lessons),
            att_lessons: bookshelf.knex.raw(att_lessons),
            abs_lessons: bookshelf.knex.raw(abs_lessons),
            att_percents: bookshelf.knex.raw(getPercents(`${att_lessons} / ${total_lessons}`)),
            abs_percents: bookshelf.knex.raw(getPercents(`${abs_lessons} / ${total_lessons}`)),
        })
    });
    fetchPage({ dbQuery, countQuery }, req.query, res);
}

export async function getAttReportsAndDates(req, res) {
    const dbQuery = new Student().where({ 'students.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('student_types', { 'student_types.key': 'students.student_type_id', 'student_types.user_id': 'students.user_id' })
            qb.leftJoin('excellency_dates', { 'excellency_dates.student_type_id': 'student_types.key', 'excellency_dates.user_id': 'students.user_id' })
            qb.leftJoin('att_reports', { 'students.id': 'att_reports.student_id', 'att_reports.report_date': 'excellency_dates.report_date' })
            qb.select('att_reports.*')
            qb.select({
                student_tz: 'students.tz',
                student_id: 'students.id',
                student_type_name: 'student_types.name',
                excellency_date: 'excellency_dates.report_date',
                report_date: 'att_reports.report_date'
            })
        });

    applyFilters(dbQuery, req.query.filters);
    fetchPage({ dbQuery }, req.query, res);
}
