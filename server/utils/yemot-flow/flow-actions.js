import { Student, AttReport, StudentType } from '../../models';

/**
 * A map of actionName => function
 */
const ACTIONS_MAP = {
  async lookupStudent(ctx, call) {
    const userId = call.values.user_id;
    const phone = call.values.ApiPhone;

    try {
      const student = await new Student()
        .where({ user_id: userId, phone })
        .fetch({ require: false });

      if (!student) {
        ctx.variables.status = 'notFound';
        return;
      }

      ctx.student = student.toJSON();

      // Store variables for text placeholders
      ctx.variables.studentName = ctx.student.name;
      ctx.variables.status = 'found';
    } catch (err) {
      console.error('Error in lookupStudent:', err);
      ctx.variables.status = 'notFound';
    }
  },

  async validateStudentType(ctx, call) {
    const studentType = await new StudentType()
      .where({
        user_id: call.values.user_id,
        key: ctx.student.student_type_id
      })
      .fetch({ require: false });
    if (!studentType) {
      ctx.variables.studentTypeStatus = 'invalid';
      return;
    }

    ctx.studentType = studentType.toJSON();
    ctx.variables.studentType = ctx.studentType.name;
    ctx.variables.studentTypeId = ctx.student.student_type_id ?? 'default';
  },

  async saveReport(ctx, call) {
    try {
      const attReport = {
        user_id: call.values.user_id,
        student_id: ctx.student.id,
        kubaseTime: ctx.variables.kubaseTime,
        fluteTime: ctx.variables.fluteTime,
        exercizeTime: ctx.variables.exercizeTime,
        exercize1: ctx.variables.exercize1,
        exercize2: ctx.variables.exercize2,
        exercize3: ctx.variables.exercize3,
        exercize4: ctx.variables.exercize4,
        report_date: new Date(),
        update_date: new Date()
      };

      await new AttReport(attReport).save();
      ctx.status = 'ok';
      ctx.variables.saveStatus = 'ok';
    } catch (err) {
      console.error('Error in saveReport:', err);
      ctx.status = 'error';
      ctx.variables.saveStatus = 'error';
    }
  }
};

/**
 * Export a function to run an action by name
 */
export async function performAction(actionName, ctx, call) {
  const fn = ACTIONS_MAP[actionName];
  if (!fn) {
    console.warn(`No action found for name: ${actionName}`);
    return;
  }
  await fn(ctx, call);
}
