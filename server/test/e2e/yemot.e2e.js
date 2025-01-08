import request from 'supertest';
import app from '../../app';
import { User, StudentType, Student, AttReport, Text } from '../../models';

describe('Yemot Call Flow E2E Tests', () => {
    let user;
    let studentType;
    let student;
    const userPhone = '0500000000';
    const testPhone = '0501234567';

    beforeEach(async () => {
        await AttReport.query().delete();
        await Student.query().delete();
        await StudentType.query().delete();
        await User.query().delete();
        await Text.query().delete();

        user = await new User({
            name: 'Test User',
            phone_number: userPhone,
            role: 'student'
        }).save().then(model => model.toJSON());

        await new Text({
            user_id: user.id,
            name: 'askKubaseTime',
            value: 'Please enter Kubase time'
        }).save();

        await new Text({
            user_id: user.id,
            name: 'askFluteTime',
            value: 'Please enter Flute time'
        }).save();

        await new Text({
            user_id: user.id,
            name: 'dataWasSavedSuccessfully',
            value: 'Data was saved successfully'
        }).save();

        await new Text({
            user_id: user.id,
            name: 'welcomeForStudent',
            value: 'Welcome {0} {1}'
        }).save();

        await new Text({
            user_id: user.id,
            name: 'phoneIsNotRecognizedInTheSystem',
            value: 'Phone is not recognized in the system'
        }).save();

        await new Text({
            user_id: user.id,
            name: 'studentTypeIsNotRecognizedInTheSystem',
            value: 'Student type is not recognized in the system'
        }).save();

        await new Text({
            user_id: user.id,
            name: 'dataWasNotSaved',
            value: 'Data was not saved'
        }).save();

        studentType = await new StudentType({
            name: 'music',
            key: 2,
            user_id: user.id
        }).save().then(model => model.toJSON());

        student = await new Student({
            user_id: user.id,
            phone: testPhone,
            name: 'Test Student',
            student_type_id: studentType.key
        }).save().then(model => model.toJSON());
    });

    afterEach(async () => {
        await AttReport.query().delete();
        await Student.query().delete();
        await StudentType.query().delete();
        await User.query().delete();
        await Text.query().delete();
    });

    it('should handle complete music report flow successfully', async () => {
        const initialCall = await request(app)
            .post('/api/yemot')
            .send({
                ApiPhone: testPhone,
                ApiCallId: 'test-call-1',
                ApiDID: userPhone,
                user_id: user.id
            });

        expect(initialCall.text).toBe('id_list_message=t-Welcome music Test Student.&read=t-Please enter Kubase time=kubaseTime,no,3,1,7,No,yes,no,,,,no,');

        const kubaseResponse = await request(app)
            .post('/api/yemot')
            .send({
                ApiCallId: 'test-call-1',
                kubaseTime: '10',
                user_id: user.id
            });

        expect(kubaseResponse.text).toBe('read=t-Please enter Flute time=fluteTime,no,3,1,7,No,yes,no,,,,no,');

        const fluteResponse = await request(app)
            .post('/api/yemot')
            .send({
                ApiCallId: 'test-call-1',
                fluteTime: '15',
                user_id: user.id
            });

        expect(fluteResponse.text).toBe('id_list_message=t-Data was saved successfully.&go_to_folder=hangup');

        const savedReport = await new AttReport()
            .where('student_id', student.id)
            .fetch();

        expect(savedReport).toBeTruthy();
        expect(savedReport.get('kubaseTime')).toBe(10);
        expect(savedReport.get('fluteTime')).toBe(15);
    });

    it('should handle not found student', async () => {
        const nonExistentPhone = '0529999999';

        const response = await request(app)
            .post('/api/yemot')
            .send({
                ApiPhone: nonExistentPhone,
                ApiCallId: 'test-call-notfound',
                ApiDID: userPhone,
                user_id: user.id
            });

        expect(response.text).toBe('id_list_message=t-Phone is not recognized in the system.&go_to_folder=hangup');
    });

    it('should handle unknown student type', async () => {
        const newStudent = await new Student({
            user_id: user.id,
            phone: '0529999999',
            name: 'Test Student',
            student_type_id: 999
        }).save().then(model => model.toJSON());

        const response = await request(app)
            .post('/api/yemot')
            .send({
                ApiPhone: newStudent.phone,
                ApiCallId: 'test-call-2',
                ApiDID: userPhone,
                user_id: user.id
            });

        expect(response.text).toBe('id_list_message=t-Student type is not recognized in the system.&go_to_folder=hangup');
    });

    it('should handle error in saving data', async () => {
        await request(app)
            .post('/api/yemot')
            .send({
                ApiCallId: 'test-call-3',
                ApiPhone: testPhone,
                ApiDID: userPhone,
                user_id: user.id,
            });

        await request(app)
            .post('/api/yemot')
            .send({
                ApiCallId: 'test-call-3',
                kubaseTime: 'invalid',
                user_id: user.id
            });

        const response = await request(app)
            .post('/api/yemot')
            .send({
                ApiCallId: 'test-call-3',
                fluteTime: 'invalid',
                user_id: user.id
            });

        const savedReport = await new AttReport()
            .where('student_id', student.id)
            .fetch({ require: false });

        expect(savedReport).toBeFalsy();
        expect(response.text).toBe('id_list_message=t-Data was not saved.&go_to_folder=hangup');
    });
});
