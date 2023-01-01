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
function makeGetWorkflowSetting({ getDataWorkflowSetting, internalServer }) {
    return function getWorkflowSetting(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bodyparam = httpRequest.query;
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
                    bodyparam.usernameToken = authMe.data.username;
                    posted = yield getDataWorkflowSetting(bodyparam);
                    // const entityLog:any = {
                    //   username: authMe.data.username,
                    //   moduleId: bodyparam.moduleId,
                    //   menuId: '',
                    //   screenId: 'Workflow Setting',
                    //   actionType: 'get',
                    //   actionDetail: 'Show List Data Workflow Setting All',
                    //   actionBeUrl: '/workflow/internal/setting',
                    //   actionBeMethod: 'GET'
                    // }
                    // if(posted.responseCode == 200){
                    //   entityLog.actionStatus = 'success'
                    // }else{
                    //   entityLog.actionStatus = 'failed'
                    // }
                    // const sendLog = await internalServer.sendLogRequest(entityLog)
                    // console.log('sendLog', sendLog);
                }
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: posted.responseCode,
                    body: posted
                };
            }
            catch (err) {
                // TODO: Error logging
                console.log(err);
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 500,
                    body: {
                        status: false,
                        responseCode: 500,
                        message: err.message
                    }
                };
            }
        });
    };
}
exports.default = makeGetWorkflowSetting;
