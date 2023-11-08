import { AttReport, Student, StudentType } from '../models';
import { applyFilters, fetchPage, fetchPagePromise } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';
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
            qb.select('att_reports.*')
            qb.select({ student_tz: 'students.tz', student_type_name: 'student_types.name' })
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
    const [students, studentTypes] = await Promise.all([
        getListFromTable(Student, req.currentUser.id),
        getListFromTable(StudentType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { students, studentTypes }
    });
}

export async function getPivotData(req, res) {
    const studentFilters = [];
    const reportFilters = [];
    if (req.query.filters) {
        const filtersObj = JSON.parse(req.query.filters);
        for (const filter of Object.values(filtersObj)) {
            if (filter.field.startsWith('student')) {
                studentFilters.push(filter);
            } else {
                reportFilters.push(filter);
            }
        }
    }

    const dbQuery = new Student()
        .where({ 'students.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('student_types', { 'student_types.key': 'students.student_type_id', 'student_types.user_id': 'students.user_id' })
            qb.select({ student_id: 'students.id', student_tz: 'students.tz', student_type_name: 'student_types.name' })
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
        const key = getWeekStart(item.report_date);
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