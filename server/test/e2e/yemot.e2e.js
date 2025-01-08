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
    const userPhone = '0500000000';
    const testPhone = '0501234567';

    const defaultRequestParams = {
        ApiPhone: testPhone,
        ApiDID: userPhone,
        ApiExtension: '1',
        ApiCallId: 'test-call-1',
        user_id: null
    };

    beforeEach(async () => {
        // Clean up database
        await AttReport.query().delete();
        await Student.query().delete();
        await StudentType.query().delete();
        await User.query().delete();
        await Text.query().delete();

        // Create base user
        user = await new User({
            name: 'Test User',
            phone_number: userPhone,
            role: 'student'
        }).save().then(model => model.toJSON());

        defaultRequestParams.user_id = user.id;

        // Add common text entries
        await Text.query().insert([
            {
                user_id: user.id,
                name: 'dataWasSavedSuccessfully',
                value: 'Data was saved successfully'
            },
            {
                user_id: user.id,
                name: 'welcomeForStudent',
                value: 'Welcome {0} {1}'
            },
            {
                user_id: user.id,
                name: 'phoneIsNotRecognizedInTheSystem',
                value: 'Phone is not recognized in the system'
            },
            {
                user_id: user.id,
                name: 'studentTypeIsNotRecognizedInTheSystem',
                value: 'Student type is not recognized in the system'
            },
            {
                user_id: user.id,
                name: 'dataWasNotSaved',
                value: 'Data was not saved'
            }
        ]);
    });

    afterEach(async () => {
        await AttReport.query().delete();
        await Student.query().delete();
        await StudentType.query().delete();
        await User.query().delete();
        await Text.query().delete();
    });

    describe('General Flow Tests', () => {
        beforeEach(async () => {
            await new Student({
                user_id: user.id,
                phone: testPhone,
                name: 'Test Student',
                student_type_id: 999
            }).save().then(model => model.toJSON());
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
    });

    describe('Music Report Flow Tests', () => {
        let musicStudent;

        beforeEach(async () => {
            // Add music-specific text entries
            await Text.query().insert([
                {
                    user_id: user.id,
                    name: 'askKubaseTime',
                    value: 'Please enter Kubase time'
                },
                {
                    user_id: user.id,
                    name: 'askFluteTime',
                    value: 'Please enter Flute time'
                }
            ]);

            // Create music student type and student
            const musicType = await new StudentType({
                name: 'music',
                key: 2,
                user_id: user.id
            }).save().then(model => model.toJSON());

            musicStudent = await new Student({
                user_id: user.id,
                phone: testPhone,
                name: 'Music Student',
                student_type_id: musicType.key
            }).save().then(model => model.toJSON());
        });

        it('should handle complete music report flow successfully', async () => {
            const initialCall = await request(app)
                .post(YEMOT_PATH)
                .send(defaultRequestParams);

            expect(cleanYemotResponse(initialCall.text)).toBe('id_list_message=t-Welcome music Music Student&read=t-Please enter Kubase time=kubaseTime,no,3,1,7,No,yes,no,,,,,None,');

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
                .where('student_id', musicStudent.id)
                .fetch();

            expect(savedReport).toBeTruthy();
            expect(savedReport.get('kubaseTime')).toBe(10);
            expect(savedReport.get('fluteTime')).toBe(15);
        });

        it('should handle error in saving music data', async () => {
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
                .where('student_id', musicStudent.id)
                .fetch({ require: false });

            expect(savedReport).toBeFalsy();
            expect(cleanYemotResponse(response.text)).toBe('id_list_message=t-Data was not saved&go_to_folder=hangup');
        });
    });

    describe('Exercise Report Flow Tests', () => {
        let exerciseStudent;

        beforeEach(async () => {
            // Add exercise-specific text entries
            await Text.query().insert([
                {
                    user_id: user.id,
                    name: 'askExercizeTime',
                    value: 'How many minutes did you exercise today?'
                },
                {
                    user_id: user.id,
                    name: 'askExercize1',
                    value: 'Did you complete Exercise 1? Press 1 for Yes, 0 for No'
                },
                {
                    user_id: user.id,
                    name: 'askExercize2',
                    value: 'Did you complete Exercise 2? Press 1 for Yes, 0 for No'
                },
                {
                    user_id: user.id,
                    name: 'askExercize3',
                    value: 'Did you complete Exercise 3? Press 1 for Yes, 0 for No'
                },
                {
                    user_id: user.id,
                    name: 'askExercize4',
                    value: 'Did you complete Exercise 4? Press 1 for Yes, 0 for No'
                },
                {
                    user_id: user.id,
                    name: 'askExercizeReportConfirm',
                    value: 'You exercised for {0} minutes and completed exercises: {1}, {2}, {3}, {4}, Press 1 to confirm, 0 to start over'
                }
            ]);

            // Create exercise student type and student
            const exerciseType = await new StudentType({
                name: 'exercise',
                key: 3,
                user_id: user.id
            }).save().then(model => model.toJSON());

            exerciseStudent = await new Student({
                user_id: user.id,
                phone: '0502222222',
                name: 'Exercise Student',
                student_type_id: exerciseType.key
            }).save().then(model => model.toJSON());
        });

        afterEach(async () => {
            await AttReport.query().delete();
        });

        it('should handle complete exercise report flow successfully', async () => {
            const exerciseParams = {
                ...defaultRequestParams,
                ApiPhone: exerciseStudent.phone,
                ApiCallId: 'test-call-exercise1'
            };

            // Initial call
            const initialCall = await request(app)
                .post(YEMOT_PATH)
                .send(exerciseParams);

            expect(cleanYemotResponse(initialCall.text)).toBe(
                'id_list_message=t-Welcome exercise Exercise Student&read=t-How many minutes did you exercise today?=exercizeTime,no,2,1,7,No,yes,no,,,,,None,'
            );

            // Enter exercise time
            const timeResponse = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercizeTime: '30' });

            expect(cleanYemotResponse(timeResponse.text)).toBe(
                'read=t-Did you complete Exercise 1? Press 1 for Yes, 0 for No=exercize1,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Answer exercise 1
            const ex1Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize1: '1' });
            expect(cleanYemotResponse(ex1Response.text)).toBe(
                'read=t-Did you complete Exercise 2? Press 1 for Yes, 0 for No=exercize2,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Exercise 2-4 responses follow same pattern
            const ex2Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize2: '0' });
            expect(cleanYemotResponse(ex2Response.text)).toBe(
                'read=t-Did you complete Exercise 3? Press 1 for Yes, 0 for No=exercize3,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            const ex3Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize3: '1' });
            expect(cleanYemotResponse(ex3Response.text)).toBe(
                'read=t-Did you complete Exercise 4? Press 1 for Yes, 0 for No=exercize4,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            const ex4Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize4: '1' });
            expect(cleanYemotResponse(ex4Response.text)).toBe(
                'read=t-You exercised for 30 minutes and completed exercises: 1, 0, 1, 1, Press 1 to confirm, 0 to start over=confirmReport,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Confirm report
            const confirmResponse = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, confirmReport: '1' });

            expect(cleanYemotResponse(confirmResponse.text)).toBe(
                'id_list_message=t-Data was saved successfully&go_to_folder=hangup'
            );

            // Verify saved report
            const savedReport = await new AttReport()
                .where('student_id', exerciseStudent.id)
                .fetch();

            expect(savedReport).toBeTruthy();
            expect(savedReport.get('exercizeTime')).toBe(30);
            expect(savedReport.get('exercize1')).toBe(1);
            expect(savedReport.get('exercize2')).toBe(0);
            expect(savedReport.get('exercize3')).toBe(1);
            expect(savedReport.get('exercize4')).toBe(1);
        });

        it('should start again if user does not confirm report', async () => {
            const exerciseParams = {
                ...defaultRequestParams,
                ApiPhone: exerciseStudent.phone,
                ApiCallId: 'test-call-exercise2'
            };

            // Initial call
            const initialCall = await request(app)
                .post(YEMOT_PATH)
                .send(exerciseParams);

            expect(cleanYemotResponse(initialCall.text)).toBe(
                'id_list_message=t-Welcome exercise Exercise Student&read=t-How many minutes did you exercise today?=exercizeTime,no,2,1,7,No,yes,no,,,,,None,'
            );

            // Enter exercise time
            const timeResponse = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercizeTime: '30' });

            expect(cleanYemotResponse(timeResponse.text)).toBe(
                'read=t-Did you complete Exercise 1? Press 1 for Yes, 0 for No=exercize1,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Answer exercise 1
            const ex1Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize1: '1' });
            expect(cleanYemotResponse(ex1Response.text)).toBe(
                'read=t-Did you complete Exercise 2? Press 1 for Yes, 0 for No=exercize2,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Answer exercise 2
            const ex2Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize2: '0' });
            expect(cleanYemotResponse(ex2Response.text)).toBe(
                'read=t-Did you complete Exercise 3? Press 1 for Yes, 0 for No=exercize3,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Answer exercise 3
            const ex3Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize3: '1' });
            expect(cleanYemotResponse(ex3Response.text)).toBe(
                'read=t-Did you complete Exercise 4? Press 1 for Yes, 0 for No=exercize4,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Answer exercise 4
            const ex4Response = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, exercize4: '1' });
            expect(cleanYemotResponse(ex4Response.text)).toBe(
                'read=t-You exercised for 30 minutes and completed exercises: 1, 0, 1, 1, Press 1 to confirm, 0 to start over=confirmReport,no,1,1,7,No,yes,no,,0.1,,,None,'
            );

            // Start over
            const startOverResponse = await request(app)
                .post(YEMOT_PATH)
                .send({ ...exerciseParams, confirmReport: '0' });

            expect(cleanYemotResponse(startOverResponse.text)).toBe(
                'read=t-How many minutes did you exercise today?=exercizeTime,no,2,1,7,No,yes,no,,,,,None,'
            );

            // verify no report was saved
            const savedReport = await new AttReport()
                .where('student_id', exerciseStudent.id)
                .fetch({ require: false });

            expect(savedReport).toBeFalsy();
        });
    });
});
