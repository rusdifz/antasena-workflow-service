"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function makeUpdateDetail({ updateDataDetail, internalServer, sendNotif, redisClient }) {
    return function updateDetail(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bodyparam = httpRequest.body;
                const token = { token: httpRequest.token };
                const authMe = yield internalServer.authentication(token);
                let posted;
                if (authMe.status == false) {
                    posted = {
                        status: false,
                        responseCode: 401,
                        data: 'User Unauthorized'
                    };
                }
                else {
                    const username = { username: authMe.data.username };
                    posted = yield updateDataDetail(Object.assign(Object.assign({}, username), bodyparam));
                    if (posted.responseCode == 200 && posted.actionId != '005') {
                        const entity = {
                            actionId: posted.actionId,
                            moduleId: posted.moduleId,
                            username: posted.username,
                            menuId: posted.menuId,
                            beUrl: posted.beUrl,
                            totalData: posted.totalData
                        };
                        const sendNotification = yield sendNotif(entity);
                        console.log('send', sendNotification);
                    }
                    const entityLog = {
                        username: authMe.data.username,
                        moduleId: bodyparam.moduleId || 'ANT',
                        menuId: '',
                        screenId: 'Workflow',
                        actionType: 'update',
                        actionDetail: 'Update Data Workflow Detail',
                        actionBeUrl: '/workflow/detail',
                        actionBeMethod: 'POST'
                    };
                    if (posted.responseCode == 200) {
                        entityLog.actionStatus = 'success';
                    }
                    else {
                        entityLog.actionStatus = 'failed';
                    }
                    redisClient.publish(entityLog);
                }
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: posted.responseCode,
                    body: {
                        responseCode: posted.responseCode,
                        data: posted.data
                    }
                };
            }
            catch (err) {
                // TODO: Error logging
                console.log(err);
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 400,
                    body: {
                        status: false,
                        responseCode: 400,
                        message: err.message
                    }
                };
            }
        });
    };
}
exports.default = makeUpdateDetail;
