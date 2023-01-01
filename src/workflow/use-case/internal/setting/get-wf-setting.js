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
function makeGetWorkflowSetting({ workflowDb, moment }) {
    return function getWorkflow(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield workflowDb.getDataWorkflowSetting(body);
                console.log('data', data);
                let result;
                if (data.status == true) {
                    let workflow;
                    if (data.data.length > 0) {
                        workflow = yield Promise.all(data.data.map(data => {
                            let updatedTime;
                            if (data.updatedTime == null) {
                                updatedTime = null;
                            }
                            else {
                                updatedTime = moment(data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                            }
                            const wf = {
                                id: data.id,
                                backendUrl: data.backend_url,
                                method: data.method,
                                wfId: data.wf_id,
                                callbackUrl: data.callback_url,
                                createdTime: moment(data.created_time).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                createdUser: data.created_user,
                                updatedTime: updatedTime,
                                updatedUser: data.updated_user
                            };
                            return wf;
                        }));
                    }
                    else {
                        workflow = [];
                    }
                    result = {
                        status: true,
                        responseCode: 200,
                        data: workflow,
                        info: {
                            allrec: data.countAll,
                            sentrec: data.data.length
                        },
                        filter: data.filter
                    };
                }
                else {
                    result = data;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getWorkflow ' + error);
            }
        });
    };
}
exports.default = makeGetWorkflowSetting;
