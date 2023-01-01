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
function makeUpdateDetail({ workflowDb, internalServer, moment, userDb }) {
    return function updateDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('use');
                const getData = yield workflowDb.getDataDetail(body);
                console.log('detail', getData);
                let result;
                if (getData.status == true) {
                    const validasiActId = yield validasiActionId({ wfId: getData.data.wfId, actionId: body.actionId, stepId: getData.data.stepId });
                    console.log('validasi', validasiActId);
                    if (validasiActId == true) {
                        if (body.menuDataNew) {
                            const updateMenuDataNew = yield workflowDb.updateDataNew({ dataNew: JSON.stringify(body.menuDataNew), id: getData.data.id });
                            // console.log('update menu data new', updateMenuDataNew); 
                            if (getData.data.method.toLowerCase() == 'put') {
                                if (getData.data.menuId == '006') {
                                    const updateKeyData = yield workflowDb.updateKeyData({ keyId: body.menuDataNew.branchId, keyName: body.menuDataNew.branchName, id: getData.data.id });
                                }
                                else if (getData.data.menuId == '005') {
                                    const updateKeyData = yield workflowDb.updateKeyData({ keyId: body.menuDataNew.roleId, keyName: body.menuDataNew.roleName, id: getData.data.id });
                                }
                            }
                        }
                        if (getData.data.method.toLowerCase() == 'delete') {
                            if (body.menuData) {
                                const updateMenuData = yield workflowDb.updateDataOld({ dataOld: JSON.stringify(body.menuData), id: getData.data.id });
                                // console.log('update menu data old', updateMenuData); 
                                if (body.menuData.length > 1) {
                                    const updateKeyData = yield workflowDb.updateKeyData({ keyId: 'multiple', keyName: 'multiple', id: getData.data.id });
                                }
                                else {
                                    if (getData.data.menuId == '006') {
                                        const updateKeyData = yield workflowDb.updateKeyData({ keyId: body.menuData[0].branchId, keyName: body.menuData[0].branchName, id: getData.data.id });
                                    }
                                    else if (getData.data.menuId == '005') {
                                        const updateKeyData = yield workflowDb.updateKeyData({ keyId: body.menuData[0].roleId, keyName: body.menuData[0].roleName, id: getData.data.id });
                                    }
                                }
                            }
                        }
                        const reqSetting = yield internalServer.requestWfsetting({ wfId: getData.data.wfId, actId: body.actionId });
                        const trx = {
                            id: getData.data.id,
                            trxNo: getData.data.trxNo,
                            wfId: getData.data.wfId,
                            stepNote: body.userComment,
                            stepUser: body.username,
                            stepStatus: reqSetting.statusId,
                            stepDesc: reqSetting.nextstepdesc,
                            stepDescGlob: reqSetting.nextstepdescglob
                        };
                        if (reqSetting.statusId == '1') {
                            let parseData;
                            if (getData.data.method.toLowerCase() == 'delete') {
                                const thisparsedata = yield JSON.parse(getData.data.data);
                                let mappingData = [];
                                yield thisparsedata.map(data => {
                                    if (data.iscancel) {
                                        if (data.iscancel == 'no') {
                                            mappingData.push(parseInt(data.id));
                                        }
                                    }
                                    else {
                                        mappingData.push(parseInt(data.id));
                                    }
                                });
                                console.log('mappingData', mappingData);
                                parseData = { rowId: mappingData };
                            }
                            else {
                                parseData = yield JSON.parse(getData.data.dataNew);
                            }
                            console.log('parseData', parseData);
                            let dataparse;
                            if (getData.data.beUrl == '/credential/role/mapping') {
                                dataparse = Object.assign(Object.assign({}, parseData.role), parseData.menu);
                            }
                            else {
                                dataparse = parseData;
                            }
                            const sendRequest = yield internalServer.credentialRequest({
                                menuId: getData.data.menuId,
                                method: getData.data.method,
                                beUrl: getData.data.beUrl,
                                data: Object.assign({ moduleId: getData.data.moduleId, username: getData.data.trxSender }, dataparse)
                            });
                            if (sendRequest.responseCode == 200) {
                                const updatePreviousStep = yield workflowDb.updateWorkflowStep(Object.assign(Object.assign({}, trx), { currId: getData.data.currStepId, stepDate: moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), stepId: getData.data.stepId }));
                                const updateData = yield workflowDb.updateWorkflowStatus(Object.assign(Object.assign({}, trx), { stepId: reqSetting.nextstepid }));
                                if (getData.data.method == 'UPLOAD') {
                                    const updateTrxUploadStatus = yield workflowDb.updateWorkflowStatusMethodUpload({ beUrl: getData.data.beUrl });
                                    console.log('update trx upload status ', updateTrxUploadStatus);
                                }
                                else {
                                    const updateTrxCurrentStepId = yield workflowDb.updateWorkflowCurrentStep({ currStepId: null, id: getData.data.id });
                                    console.log('updateTrxCurrentStepId', updateTrxCurrentStepId);
                                }
                                result = {
                                    responseCode: 200,
                                    data: "Data updated successfully",
                                    actionId: body.actionId
                                };
                            }
                            else {
                                if (sendRequest.responseCode == 400) {
                                    result = {
                                        responseCode: 400,
                                        data: "Data update failed because id data not found"
                                    };
                                }
                                else {
                                    result = {
                                        responseCode: 401,
                                        data: "Data update failed because service credential error " + sendRequest.message
                                    };
                                }
                            }
                        }
                        else {
                            const updatePreviousStep = yield workflowDb.updateWorkflowStep(Object.assign(Object.assign({}, trx), { currId: getData.data.currStepId, stepDate: moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), stepId: getData.data.stepId }));
                            const updateData = yield workflowDb.updateWorkflowStatus(Object.assign(Object.assign({}, trx), { stepId: reqSetting.nextstepid }));
                            if (updatePreviousStep.status == true && updateData.status == true) {
                                let insertTrxStep;
                                if (reqSetting.statusId == '0') {
                                    delete trx.stepNote;
                                    insertTrxStep = yield workflowDb.insertWorkflowStep(Object.assign(Object.assign({}, trx), { stepNote: '', stepDate: null, stepId: reqSetting.nextstepid, stepDesc: reqSetting.nextstepdesc, stepDescGlob: reqSetting.nextstepdescglob }));
                                }
                                else {
                                    insertTrxStep = { status: true, id: null };
                                }
                                if (insertTrxStep.status == true) {
                                    const updateTrxCurrentStepId = yield workflowDb.updateWorkflowCurrentStep({ currStepId: insertTrxStep.id, id: getData.data.id });
                                    // console.log('update', updateTrxCurrentStepId);
                                }
                                let totalData;
                                if (getData.data.method == 'DELETE') {
                                    // console.log('dataold', getData.data);
                                    const parseData = JSON.parse(getData.data.data);
                                    console.log('parse', parseData);
                                    totalData = parseData.length;
                                }
                                else {
                                    totalData = '1';
                                }
                                console.log('total', totalData);
                                if (getData.data.method == 'UPLOAD' && reqSetting.statusId == '2') {
                                    const updateTrxUploadStatus = yield workflowDb.updateWorkflowStatusMethodUpload({ beUrl: getData.data.beUrl });
                                    console.log('update trx upload status ', updateTrxUploadStatus);
                                }
                                result = {
                                    responseCode: 200,
                                    data: "Data updated successfully",
                                    moduleId: getData.data.moduleId,
                                    menuId: getData.data.menuId,
                                    beUrl: getData.data.beUrl,
                                    username: getData.data.trxSender,
                                    actionId: body.actionId,
                                    totalData: totalData
                                };
                            }
                            else {
                                result = {
                                    responseCode: 400,
                                    data: "Data updated failed"
                                };
                            }
                        }
                    }
                    else {
                        const errCode = yield userDb.getErrorCode();
                        result = {
                            status: false,
                            responseCode: 406,
                            data: {
                                locl: errCode.local,
                                glob: errCode.global
                            }
                        };
                    }
                }
                else {
                    result = getData;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-updateDetail ' + error);
            }
        });
    };
    function validasiActionId(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('act', body);
                const getActionId = yield internalServer.getWorkflowAction({ wfId: body.wfId, stepId: body.stepId });
                console.log('action id', getActionId.data);
                let result;
                if (getActionId.status == true) {
                    if (getActionId.data.length > 0) {
                        function validasiId(workflow) {
                            console.log('workflow', workflow);
                            return workflow.actId === body.actionId;
                        }
                        const find = getActionId.data.find(validasiId);
                        if (find != undefined) {
                            // console.log('find', find);
                            result = true;
                        }
                        else {
                            result = false;
                        }
                    }
                    else {
                        result = false;
                    }
                }
                else {
                    result = false;
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = makeUpdateDetail;
