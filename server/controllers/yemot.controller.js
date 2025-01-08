import HttpStatus from 'http-status-codes';
import { CallListHandler } from '../../common-modules/server/utils/callBase';
import { YemotCall } from '../utils/yemotCall';
import { YemotRouter } from 'yemot-router2';
import yemotFlow from '../utils/yemot-flow/flow';
import { runFlow } from '../utils/yemot-flow/flow-engine';

/**
 * Take call and handle it
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function handleCall(req, res) {
    if (!req.body) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: true,
            message: 'request not valid'
        });
        return;
    }

    const callId = req.body.ApiCallId;
    console.log('callId ', callId);
    console.log('body ', req.body);
    const call = await CallListHandler.getCallById(callId, req.body, YemotCall);

    call.process(req.body, res);
}

export const yemotRouter = YemotRouter({
    printLogs: true,
    removeInvalidChars: true,
    read: {
        removeInvalidChars: true,
    },
    id_list_message: {
        removeInvalidChars: true,
    }
});

yemotRouter.all('/', async (call) => {
    const context = {
        currentNodeId: 'start',
        variables: {},
    };
    console.log('start flow', call);

    await runFlow(call, yemotFlow, context);
});

