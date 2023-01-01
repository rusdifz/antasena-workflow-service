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
function makeGetTodo({ workflowDb, moment, internalServer }) {
    return function getTodo(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('usecase', body);
                const getSettingTodo = yield internalServer.worfklowTodoSetting({ roleId: body.roleId });
                const data = yield workflowDb.getDataFlowTrx(Object.assign(Object.assign({}, body), { infoData: 'todo', wfStep: getSettingTodo.wfStep }));
                let result;
                if (data.status != false) {
                    let error = false;
                    let dataWorkflow;
                    if (data.status == "empty") {
                        dataWorkflow = [];
                    }
                    else {
                        dataWorkflow = yield Promise.all(data.data.map((workflow) => __awaiter(this, void 0, void 0, function* () {
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
                                const note = yield workflowDb.getDataWorkflowNotes({ id: workflow.trxNo });
                                if (note.status == true) {
                                    const dataWorkflow = Object.assign(Object.assign({ id: workflow.id, method: workflow.method, reqDate: moment(workflow.trxDate).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), reqNo: workflow.trxNo, reqMethod: workflow.method, reqSender: workflow.trxSender }, identity), { note: note, priorityLevel: 1, statusWorkflow: workflow.trxStatus, workflowStep: workflowStep.data });
                                    return dataWorkflow;
                                }
                                else {
                                    error = true;
                                    return note;
                                }
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
                            data: dataWorkflow,
                            info: {
                                allrec: data.countAll,
                                sentrec: data.data.length
                            },
                            filter: data.filter
                        };
                    }
                    else {
                        const findData = dataWorkflow.find(function dataPending(workflow) {
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
                throw new Error('usecase-getTodo ' + error);
            }
        });
    };
}
exports.default = makeGetTodo;
