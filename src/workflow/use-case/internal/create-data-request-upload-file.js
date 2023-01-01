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
function makeCreateDatarequestUploadFile({ workflowDb, makeWorkflow, moment, internalServer }) {
    return function createDataRequestUploadFile(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('data upload ', body.dataUpload.length);
                const checkReqNo = yield workflowDb.checkLastReqNo();
                let reqNo;
                if (checkReqNo.length > 0) {
                    const no = checkReqNo.length - 6;
                    const reqnostr = checkReqNo.substr(6, no);
                    const reqnoInt = parseInt(reqnostr) + 1;
                    reqNo = moment().format('YYMMDD') + '00' + reqnoInt;
                }
                else {
                    reqNo = moment().format('YYMMDD') + '001';
                }
                const checkUseWorkflow = yield workflowDb.checkDataUseWorkflow({ menuId: body.menuId, beUrl: body.backendUrl, method: body.method });
                console.log('checkuse', checkUseWorkflow);
                let result;
                if (checkUseWorkflow.data == null || checkUseWorkflow.data == '') {
                    // workflow mati
                    body.reqNo = reqNo;
                    body.trxStatus = 1;
                    const entity = yield makeWorkflow(body);
                    const insert = yield workflowDb.insertDataRequest(Object.assign(Object.assign({}, entity), { infoWorkflow: 'completed' }));
                    if (insert.status == true) {
                        result = {
                            status: 'completed',
                            responseCode: 200,
                            data: { id: insert.id, menuDataId: null }
                        };
                    }
                    else {
                        result = {
                            status: insert.status,
                            responseCode: insert.responseCode,
                            data: insert.data
                        };
                    }
                }
                else {
                    //workflow nyala
                    const checkDataPending = yield workflowDb.checkDataPendingReqUpload({ menuId: body.menuId });
                    // console.log('checkdata', checkDataPending);
                    if (checkDataPending.status == true) {
                        if (checkDataPending.data == false) {
                            const reqWfsetting = yield internalServer.requestWfsetting({ wfId: checkUseWorkflow.data, actId: 'begin' });
                            body.reqNo = reqNo;
                            body.trxStatus = reqWfsetting.statusId;
                            body.wfId = checkUseWorkflow.data;
                            body.stepId = reqWfsetting.nextstepid;
                            const entity = yield makeWorkflow(body);
                            const insert = yield workflowDb.insertDataRequest(Object.assign(Object.assign({}, entity), { infoWorkflow: 'upload' }));
                            if (insert.status == true) {
                                const trxStep = [
                                    {
                                        trxNo: entity.getReqNo(),
                                        wfId: entity.getWfId(),
                                        stepId: 'begin',
                                        stepNote: '',
                                        stepUser: entity.getReqSender(),
                                        stepDate: moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                        stepStatus: '1',
                                        stepDesc: 'Mulai',
                                        stepDescGlob: 'Begin'
                                    },
                                    {
                                        trxNo: entity.getReqNo(),
                                        wfId: entity.getWfId(),
                                        stepId: entity.getStepId(),
                                        stepNote: '',
                                        stepUser: entity.getReqSender(),
                                        stepDate: null,
                                        stepStatus: entity.getStatus(),
                                        stepDesc: reqWfsetting.nextstepdesc,
                                        stepDescGlob: reqWfsetting.nextstepdescglob
                                    }
                                ];
                                const inputTrxStep = yield Promise.all(trxStep.map((data) => __awaiter(this, void 0, void 0, function* () {
                                    const insertWorkflowStep = yield workflowDb.insertWorkflowStep(data);
                                    return insertWorkflowStep;
                                })));
                                // console.log('inputTrxStep', inputTrxStep);
                                const updateTrxCurrentStepId = yield workflowDb.updateWorkflowCurrentStep({ currStepId: inputTrxStep[1].id, id: insert.id });
                                console.log('update', updateTrxCurrentStepId);
                                const dataUpload = body.dataUpload;
                                const insertDataUpload = yield Promise.all(dataUpload.map((data) => __awaiter(this, void 0, void 0, function* () {
                                    const checkReqNo = yield workflowDb.checkLastReqNo();
                                    let reqNo;
                                    if (checkReqNo.length > 0) {
                                        const no = checkReqNo.length - 6;
                                        const reqnostr = checkReqNo.substr(6, no);
                                        const reqnoInt = parseInt(reqnostr) + 1;
                                        reqNo = moment().format('YYMMDD') + '00' + reqnoInt;
                                    }
                                    else {
                                        reqNo = moment().format('YYMMDD') + '001';
                                    }
                                    const dataEntity = {
                                        username: body.username,
                                        moduleId: body.moduleId,
                                        menuId: body.menuId,
                                        backendUrl: body.backendUrl,
                                        method: body.method,
                                        menuData: data.menuData,
                                        menuDataNew: null,
                                        keyId: data.keyId,
                                        keyName: data.keyName,
                                        reqNo: reqNo,
                                        wfId: checkUseWorkflow.data,
                                        trxStatus: 0,
                                        stepId: null
                                    };
                                    const entityUpload = yield makeWorkflow(dataEntity);
                                    const insertUpload = yield workflowDb.insertDataRequest(Object.assign(Object.assign({}, entityUpload), { infoWorkflow: 'pending upload' }));
                                    return insertUpload;
                                })));
                                result = {
                                    status: 'pending',
                                    responseCode: insert.responseCode,
                                    data: { id: insert.id, menuDataId: null }
                                };
                            }
                            else {
                                result = {
                                    status: insert.status,
                                    responseCode: insert.responseCode,
                                    data: insert.data
                                };
                            }
                        }
                        else {
                            result = {
                                status: false,
                                responseCode: 409,
                                data: {
                                    locl: 'Data gagal dikirim karena masih ada antrian data di workflow',
                                    glob: 'Data failed to send because there is still a data queue in the workflow'
                                }
                            };
                        }
                    }
                    else {
                        result = {
                            status: false,
                            responseCode: checkDataPending.responseCode,
                            data: {
                                locl: checkDataPending.data,
                                glob: checkDataPending.data
                            }
                        };
                    }
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-createDataRequestUploadFile ' + error);
            }
        });
    };
}
exports.default = makeCreateDatarequestUploadFile;
