import request from 'supertest';
import app from '../../app';
import { User, StudentType, Student, AttReport, Text } from '../../models';

const YEMOT_PATHS = [
    '/api/yemot',
    '/api/yemot/v2'
];

function cleanYemotResponse(response) {
    return response.replace(/\.\&/g, '&');
}

describe.each(YEMOT_PATHS)('Yemot Call Flow E2E Tests - %s', (YEMOT_PATH) => {
    let user;
    let studentType;
    let student;
    const userPhone = '0500000000';
    const testPhone = '0501234567';

    const defaultRequestParams = {
        ApiPhone: testPhone,
        ApiDID: userPhone,
        ApiExtension: '1',
        ApiCallId: 'test-call-1',
        user_id: null  // Will be set in beforeEach
    };

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
        console.log('studentType:', studentType);

        student = await new Student({
            user_id: user.id,
            phone: testPhone,
            name: 'Test Student',
            student_type_id: studentType.key
        }).save().then(model => model.toJSON());

        defaultRequestParams.user_id = user.id;
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
            .post(YEMOT_PATH)
            .send(defaultRequestParams);

        expect(cleanYemotResponse(initialCall.text)).toBe('id_list_message=t-Welcome music Test Student&read=t-Please enter Kubase time=kubaseTime,no,3,1,7,No,yes,no,,,,,None,');

        const kubaseResponse = await request(app)
            .post(YEMOT_PATH)
            .send({
                ...defaultRequestParams,
                kubaseTime: '10'
            });

        expect(kubaseResponse.text).toBe('read=t-Please enter Flute time=fluteTime,no,3,1,7,No,yes,no,,,,,None,');

        const fluteResponse = await request(app)
            .post(YEMOT_PATH)
            .send({
                ...defaultRequestParams,
                fluteTime: '15'
            });

        expect(cleanYemotResponse(fluteResponse.text)).toBe('id_list_message=t-Data was saved successfully&go_to_folder=hangup');

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
            .post(YEMOT_PATH)
            .send({
                ...defaultRequestParams,
                ApiPhone: nonExistentPhone,
                ApiCallId: 'test-call-notfound'
            });

        expect(cleanYemotResponse(response.text)).toBe('id_list_message=t-Phone is not recognized in the system&go_to_folder=hangup');
    });

    it('should handle unknown student type', async () => {
        const newStudent = await new Student({
            user_id: user.id,
            phone: '0529999999',
            name: 'Test Student',
            student_type_id: 999
        }).save().then(model => model.toJSON());

        const response = await request(app)
            .post(YEMOT_PATH)
            .send({
                ...defaultRequestParams,
                ApiPhone: newStudent.phone,
                ApiCallId: 'test-call-2'
            });

        expect(cleanYemotResponse(response.text)).toBe('id_list_message=t-Student type is not recognized in the system&go_to_folder=hangup');
    });

    it('should handle error in saving data', async () => {
        await request(app)
            .post(YEMOT_PATH)
            .send({
                ...defaultRequestParams,
                ApiCallId: 'test-call-3'
            });

        await request(app)
            .post(YEMOT_PATH)
            .send({
                ...defaultRequestParams,
                ApiCallId: 'test-call-3',
                kubaseTime: 'invalid'
            });

        const response = await request(app)
            .post(YEMOT_PATH)
            .send({
                ...defaultRequestParams,
                ApiCallId: 'test-call-3',
                fluteTime: 'invalid'
            });

        const savedReport = await new AttReport()
            .where('student_id', student.id)
            .fetch({ require: false });

        expect(savedReport).toBeFalsy();
        expect(cleanYemotResponse(response.text)).toBe('id_list_message=t-Data was not saved&go_to_folder=hangup');
    });
});
