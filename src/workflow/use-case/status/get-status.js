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
function makeGetStatus({ workflowDb, moment }) {
    return function getStatus(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield workflowDb.getDataFlowTrx(Object.assign(Object.assign({}, body), { infoData: 'status' }));
                let result;
                if (data.status != false) {
                    let dataStatusWorkflow;
                    let error = false;
                    if (data.status == "empty") {
                        dataStatusWorkflow = [];
                    }
                    else {
                        dataStatusWorkflow = yield Promise.all(data.data.map((workflow) => __awaiter(this, void 0, void 0, function* () {
                            const workflowStep = yield workflowDb.getDataWorkflowStep({ id: workflow.trxNo });
                            if (workflowStep.status == true) {
                                let dataparse;
                                if (workflow.method.toLowerCase() == 'put') {
                                    dataparse = JSON.parse(workflow.dataNew);
                                }
                                else {
                                    if (workflow.beUrl == '/credential/branch/upload') {
                                        dataparse = JSON.parse(workflow.dataNew);
                                    }
                                    else {
                                        dataparse = JSON.parse(workflow.data);
                                    }
                                }
                                let identity;
                                if (workflow.key_id == null) {
                                    identity = {
                                        keyId: '',
                                        keyName: ''
                                    };
                                }
                                else {
                                    identity = {
                                        keyId: workflow.key_id,
                                        keyName: workflow.key_name
                                    };
                                }
                                const dataWorkflow = Object.assign(Object.assign({ id: workflow.id, method: workflow.method, reqDate: moment(workflow.trxDate).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), reqNo: workflow.trxNo, reqMethod: workflow.method, reqSender: workflow.trxSender }, identity), { statusWorkflow: workflow.trxStatus, priorityLevel: 1, workflowStep: workflowStep.data });
                                return dataWorkflow;
                            }
                            else {
                                error = true;
                                return workflowStep;
                            }
                        })));
                    }
                    if (error == false) {
                        result = {
                            status: true,
                            responseCode: 200,
                            data: dataStatusWorkflow,
                            info: {
                                allrec: data.countAll,
                                sentrec: data.data.length
                            },
                            filter: data.filter
                        };
                    }
                    else {
                        const findData = dataStatusWorkflow.find(function dataPending(workflow) {
                            return workflow.status === false;
                        });
                        result = {
                            status: false,
                            responseCode: 500,
                            data: findData.data
                        };
                    }
                }
                else {
                    result = data;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getStatus ' + error);
            }
        });
    };
}
exports.default = makeGetStatus;
