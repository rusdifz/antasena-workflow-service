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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jexl_1 = __importDefault(require("jexl"));
const ioredis_1 = __importDefault(require("ioredis"));
let port = process.env.REDIS_PORT;
let host = process.env.REDIS_HOST;
let pass = process.env.REDIS_PASSWORD;
const redisClient = new ioredis_1.default({
    port: port,
    host: host,
    password: pass
});
function makeCreateDatarequest({ workflowDb, makeWorkflow, moment, internalServer }) {
    return function createDataRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkUseWorkflow = yield checkWorkflowSetting(body);
                // const checkUseWorkflow = {status: 'completed'}
                let result;
                if (checkUseWorkflow.status == 'pending') {
                    const dataValidation = yield workflowDb.sameDataValidationWorkflow(body);
                    if (dataValidation.status == 'waiting' || dataValidation.status == false) {
                        //throw error          
                        result = dataValidation;
                    }
                    else {
                        //next step
                        let getWfSettingCache = yield redisClient.get("wfSetting_wfid_" + checkUseWorkflow.data + "actid_begin");
                        let reqWfsetting;
                        if (getWfSettingCache == null) {
                            reqWfsetting = yield internalServer.requestWfsetting({ wfId: checkUseWorkflow.data, actId: 'begin' });
                            redisClient.set("wfSetting_wfid_" + checkUseWorkflow.data + "actid_begin", JSON.stringify(reqWfsetting));
                        }
                        else {
                            reqWfsetting = JSON.parse(getWfSettingCache);
                            updateCache({ wfId: checkUseWorkflow.data });
                        }
                        const reqNo = yield createReqNo();
                        const dataEntity = Object.assign(Object.assign({}, body), { reqNo: reqNo, trxStatus: reqWfsetting.statusId, wfId: checkUseWorkflow.data, stepId: reqWfsetting.nextstepid });
                        const insertData = yield insertWorkflowData(dataEntity);
                        if (insertData.responseCode == 200) {
                            const trxStep = [
                                {
                                    trxNo: reqNo,
                                    wfId: dataEntity.wfId,
                                    stepId: 'begin',
                                    stepNote: '',
                                    stepUser: body.username,
                                    stepDate: moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                    stepStatus: '1',
                                    stepDesc: 'Mulai',
                                    stepDescGlob: 'Begin'
                                },
                                {
                                    trxNo: reqNo,
                                    wfId: dataEntity.wfId,
                                    stepId: dataEntity.stepId,
                                    stepNote: '',
                                    stepUser: body.username,
                                    stepDate: null,
                                    stepStatus: dataEntity.trxStatus,
                                    stepDesc: reqWfsetting.nextstepdesc,
                                    stepDescGlob: reqWfsetting.nextstepdescglob
                                }
                            ];
                            let dataStepErr = [];
                            let inputTrxStep;
                            for (let index = 0; index < trxStep.length; index++) {
                                const insertWorkflowStep = yield workflowDb.insertWorkflowStep(trxStep[index]);
                                if (insertWorkflowStep.status == false) {
                                    dataStepErr.push(insertWorkflowStep);
                                }
                                if (index == 1) {
                                    inputTrxStep = insertWorkflowStep;
                                }
                            }
                            if (dataStepErr.length == 0) {
                                workflowDb.updateWorkflowCurrentStep({ currStepId: inputTrxStep.id, id: insertData.id });
                                result = Object.assign({ status: 'pending' }, insertData);
                            }
                            else {
                                workflowDb.deleteDataRequest({ id: insertData.id, trxNo: reqNo });
                                result = {
                                    status: false,
                                    responseCode: 500,
                                    data: dataStepErr[0].data
                                };
                            }
                        }
                        else {
                            result = insertData;
                        }
                    }
                }
                else if (checkUseWorkflow.status == 'completed') {
                    const reqNo = yield createReqNo();
                    const dataEntity = Object.assign(Object.assign({}, body), { trxStatus: 1, reqNo: reqNo });
                    const insertData = yield insertWorkflowData(dataEntity);
                    if (insertData.responseCode == 200) {
                        result = Object.assign({ status: 'completed' }, insertData);
                    }
                    else {
                        result = insertData;
                    }
                }
                else {
                    //error
                    result = checkUseWorkflow;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-createDataRequest ' + error);
            }
        });
    };
    function checkWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const getSettingWorkflow = yield workflowDb.getWfSetting({ menuId: body.menuId, beUrl: body.backendUrl, method: body.method });
            if (getSettingWorkflow.status == true) {
                if (getSettingWorkflow.data != null) {
                    const conditionString = getSettingWorkflow.data.conditionString;
                    console.log('conditon', conditionString);
                    if (conditionString == null || conditionString == '') {
                        return { status: 'pending', data: getSettingWorkflow.data.wfId };
                    }
                    else {
                        console.log('masuk');
                        let param;
                        if (body.method == 'PUT') {
                            param = body.menuDataNew;
                        }
                        else {
                            param = body.menuData;
                        }
                        let validation = jexl_1.default.evalSync(conditionString, param);
                        if (validation == true) {
                            return {
                                status: 'pending',
                                data: getSettingWorkflow.data.wfId
                            };
                        }
                        else {
                            return {
                                status: false,
                                responseCode: 500,
                                data: 'condition string not valid'
                            };
                        }
                    }
                }
                else {
                    return { status: 'completed' };
                }
            }
            else {
                return getSettingWorkflow;
            }
        });
    }
    function insertWorkflowData(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield makeWorkflow(body);
            console.log('entity', entity.getReqNo());
            const insert = yield workflowDb.insertDataRequest(entity);
            if (insert.status == true) {
                let messageData;
                redisClient.set("reqNo", body.reqNo.toString());
                if (body.method.toLowerCase() == 'put') {
                    messageData = { id: insert.id, menuDataId: 0 };
                }
                else if (body.method.toLowerCase() == 'delete') {
                    messageData = { id: 0 };
                    messageData.menuDataId = yield Promise.all(body.menuData.map(id => {
                        return id.id;
                    }));
                }
                else {
                    messageData = { id: insert.id };
                    if (body.backendUrl == '/credential/role/mapping') {
                        messageData.menuDataId = body.menuData.role.id;
                    }
                    else if (body.backendUrl == '/credential/branch/upload') {
                        messageData.menuDataId = null;
                    }
                    else {
                        messageData.menuDataId = body.menuData.id || body.menuData.user.id;
                    }
                }
                return {
                    responseCode: insert.responseCode,
                    data: messageData,
                    id: insert.id
                };
            }
            else {
                return insert;
            }
        });
    }
    function createReqNo() {
        return __awaiter(this, void 0, void 0, function* () {
            let getReqNo = yield redisClient.get("reqNo");
            let checkReqNo;
            if (getReqNo == null) {
                checkReqNo = yield workflowDb.checkLastReqNo();
            }
            else {
                checkReqNo = getReqNo;
            }
            let reqNo;
            if (checkReqNo.length > 0) {
                const no = checkReqNo.length - 6;
                const reqnostr = checkReqNo.substr(6, no);
                const reqnoInt = parseInt(reqnostr) + 1;
                // const reqnoInt = parseInt(checkReqNo.substr(6,checkReqNo.length-6))+1
                reqNo = moment().tz("Asia/Jakarta").format('YYMMDD') + '00' + reqnoInt;
            }
            else {
                reqNo = moment().tz("Asia/Jakarta").format('YYMMDD') + '001';
            }
            return reqNo;
        });
    }
    function updateCache(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqWfsetting = yield internalServer.requestWfsetting({ wfId: body.wfId, actId: 'begin' });
            redisClient.set("wfSetting_wfid_" + body.wfId + "actid_begin", JSON.stringify(reqWfsetting));
        });
    }
}
exports.default = makeCreateDatarequest;
