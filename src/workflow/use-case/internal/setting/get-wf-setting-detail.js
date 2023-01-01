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
function makeGetWorkflowSettingDetail({ workflowDb, moment }) {
    return function getWorkflowSettingDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield workflowDb.getDataWorkflowSettingDetail(body);
                let dataWorkflow;
                if (data.status == true && data.field == 'filled') {
                    let updatedTime;
                    if (data.data.updated_time == null) {
                        updatedTime = null;
                    }
                    else {
                        updatedTime = moment(data.data.updated_time).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                    }
                    dataWorkflow = {
                        id: data.data.id,
                        backendUrl: data.data.backend_url,
                        method: data.data.method,
                        wfId: data.data.wf_id,
                        callbackUrl: data.data.callback_url,
                        createdTime: moment(data.data.created_time).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                        createdUser: data.data.created_user,
                        updatedTime: updatedTime,
                        updatedUser: data.data.updated_user
                    };
                }
                else {
                    dataWorkflow = data.data;
                }
                const result = {
                    status: data.status,
                    responseCode: data.responseCode,
                    data: dataWorkflow
                };
                return result;
            }
            catch (error) {
                throw new Error('usecase-getWorkflowSettingDetail ' + error);
            }
        });
    };
}
exports.default = makeGetWorkflowSettingDetail;
