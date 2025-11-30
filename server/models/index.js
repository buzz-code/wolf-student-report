import { createModel } from "../../common-modules/server/utils/models";

export const User = createModel('users', {
    verifyPassword(password) {
        return this.get('password') === password;
    }
})

export const Answer = createModel('answers', {
    user() {
        return this.belongsTo(User);
    }
})

export const AttReport = createModel('att_reports')

export const AttType = createModel('att_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const Price = createModel('prices', {
    user() {
        return this.belongsTo(User);
    }
})

export const QuestionType = createModel('question_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const Question = createModel('questions', {
    user() {
        return this.belongsTo(User);
    }
})

export const Student = createModel('students', {
    user() {
        return this.belongsTo(User);
    }
})

export const TeacherSalaryType = createModel('teacher_salary_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const StudentType = createModel('student_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const Teacher = createModel('teachers', {
    user() {
        return this.belongsTo(User);
    }
})

export const Text = createModel('texts', {
    user() {
        return this.belongsTo(User);
    }
})

export const WorkingDate = createModel('working_dates', {
    user() {
        return this.belongsTo(User);
    }
})

export const ExcellencyDate = createModel('excellency_dates', {
    user() {
        return this.belongsTo(User);
    }
})

export const ReportPeriod = createModel('report_periods', {
    user() {
        return this.belongsTo(User);
    }
})

export const TestName = createModel('test_names', {
    user() {
        return this.belongsTo(User);
    }
})

export const Specialty = createModel('specialties', {
    user() {
        return this.belongsTo(User);
    }
})

export const StudentSpecialty = createModel('student_specialties', {
    user() {
        return this.belongsTo(User);
    }
})

export const SpecialtyAbsence = createModel('specialty_absences', {
    user() {
        return this.belongsTo(User);
    }
})

export const Grade = createModel('grades', {
    user() {
        return this.belongsTo(User);
    }
})
