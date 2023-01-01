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
function makeGetDetail({ workflowDb, internalServer, moment }) {
    return function getDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workflow = yield workflowDb.getDataDetail(body);
                console.log('get data', workflow);
                let result;
                if (workflow.status == true) {
                    if (workflow.responseCode == 200) {
                        //ini join tabel
                        const workflowStepData = yield workflowDb.getDataWorkflowStep({ id: workflow.data.trxNo });
                        //ini ga join tabel
                        const workflowStep = yield workflowDb.getDataWorkflowStepDetail({ id: workflow.data.trxNo });
                        const workflowAction = yield internalServer.getWorkflowAction({ wfId: workflow.data.wfId, stepId: workflow.data.stepId });
                        if (workflowStepData.status == true && workflowStep.status == true && workflowAction.status == true) {
                            let workflowNotes = [];
                            if (workflowStep.length > 0) {
                                console.log('masuk kesini');
                                yield Promise.all(workflowStep.map((step) => __awaiter(this, void 0, void 0, function* () {
                                    if (step.stepDate != null) {
                                        if (step.stepNote == null || step.stepNote == '') {
                                            console.log('note kosong');
                                        }
                                        else {
                                            const dataUser = yield internalServer.userProfile({ username: step.stepUser });
                                            const dataWorkflowNotes = {
                                                username: step.stepUser,
                                                userFullname: dataUser.data.nickname,
                                                userImg: dataUser.data.img,
                                                userAction: step.stepDesc,
                                                userActioncolor: null,
                                                userComment: step.stepNote
                                            };
                                            yield workflowNotes.push(dataWorkflowNotes);
                                        }
                                    }
                                })));
                            }
                            let dataold;
                            let datanew;
                            let menudata;
                            if (workflow.data.data == '') {
                                dataold = '';
                            }
                            else {
                                dataold = JSON.parse(workflow.data.data);
                            }
                            if (workflow.data.dataNew == '') {
                                datanew = '';
                            }
                            else {
                                datanew = JSON.parse(workflow.data.dataNew);
                            }
                            let updatedTimeOld;
                            let updatedTimeNew;
                            let createdTimeNew;
                            let createdTimeOld;
                            if (workflow.data.beUrl != '/credential/branch/upload') {
                                console.log('harusnya tidak masuk');
                                if (workflow.data.beUrl == '/credential/role/mapping') {
                                    if (dataold.role.updatedTime == null) {
                                        updatedTimeOld = null;
                                    }
                                    else {
                                        updatedTimeOld = moment(dataold.role.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    if (datanew.role.updatedTime == null) {
                                        updatedTimeNew = null;
                                    }
                                    else {
                                        updatedTimeNew = moment(datanew.role.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    createdTimeOld = moment(dataold.role.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    createdTimeNew = moment(datanew.role.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                }
                                else if (workflow.data.beUrl == '/credential/user/detail/role' || workflow.data.beUrl == '/credential/user/detail/branch') {
                                    if (dataold.user.updatedTime == null) {
                                        updatedTimeOld = null;
                                    }
                                    else {
                                        updatedTimeOld = moment(dataold.user.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    if (datanew.user.updatedTime == null) {
                                        updatedTimeNew = null;
                                    }
                                    else {
                                        updatedTimeNew = moment(datanew.user.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    createdTimeOld = moment(dataold.user.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    createdTimeNew = moment(datanew.user.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                }
                                else {
                                    if (dataold.updatedTime == null) {
                                        updatedTimeOld = null;
                                    }
                                    else {
                                        updatedTimeOld = moment(dataold.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    if (datanew.updatedTime == null) {
                                        updatedTimeNew = null;
                                    }
                                    else {
                                        updatedTimeNew = moment(datanew.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    createdTimeOld = moment(dataold.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    createdTimeNew = moment(datanew.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                            if (workflow.data.method.toLowerCase() == 'post') {
                                if (workflow.data.menuId == '005') {
                                    //role
                                    if (workflow.data.beUrl == '/credential/role/mapping') {
                                        delete dataold.role.createdTime;
                                        delete dataold.role.updatedTime;
                                        delete datanew.role.createdTime;
                                        delete datanew.role.updatedTime;
                                        dataold.role.createdTime = createdTimeOld;
                                        dataold.role.updatedTime = updatedTimeOld;
                                        datanew.role.createdTime = createdTimeNew;
                                        datanew.role.updatedTime = updatedTimeNew;
                                    }
                                    else {
                                        delete dataold.createdTime;
                                        delete dataold.updatedTime;
                                        delete datanew.createdTime;
                                        delete datanew.updatedTime;
                                        dataold.createdTime = createdTimeOld;
                                        dataold.updatedTime = updatedTimeOld;
                                        datanew.createdTime = createdTimeNew;
                                        datanew.updatedTime = updatedTimeNew;
                                    }
                                }
                                else if (workflow.data.menuId == '006') {
                                    //branch     
                                    if (workflow.data.beUrl != '/credential/branch/upload') {
                                        delete dataold.createdTime;
                                        delete dataold.updatedTime;
                                        delete datanew.createdTime;
                                        delete datanew.updatedTime;
                                        dataold.createdTime = createdTimeOld;
                                        dataold.updatedTime = updatedTimeOld;
                                        datanew.createdTime = createdTimeNew;
                                        datanew.updatedTime = updatedTimeNew;
                                    }
                                }
                                else {
                                    //user
                                    delete dataold.user.createdTime;
                                    delete dataold.user.updatedTime;
                                    delete datanew.user.createdTime;
                                    delete datanew.user.updatedTime;
                                    dataold.user.createdTime = createdTimeOld;
                                    dataold.user.updatedTime = updatedTimeOld;
                                    datanew.user.createdTime = createdTimeNew;
                                    datanew.user.updatedTime = updatedTimeNew;
                                }
                                menudata = {
                                    menuData: dataold,
                                    menuDataNew: datanew
                                };
                            }
                            else if (workflow.data.method.toLowerCase() == 'put') {
                                delete datanew.createdTime;
                                delete datanew.updatedTime;
                                datanew.createdTime = createdTimeNew;
                                datanew.updatedTime = updatedTimeNew;
                                menudata = {
                                    menuData: null,
                                    menuDataNew: datanew
                                };
                            }
                            else {
                                //delete
                                const menuOld = yield Promise.all(dataold.map(data => {
                                    const createdTime = moment(data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    let updatedTime;
                                    if (data.updatedTime == null) {
                                        updatedTime = null;
                                    }
                                    else {
                                        updatedTime = moment(data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    delete data.createdTime;
                                    delete data.updatedTime;
                                    data.createdTime = createdTime;
                                    data.updatedTime = updatedTime;
                                    return data;
                                }));
                                menudata = {
                                    menuData: menuOld,
                                    menuDataNew: null
                                };
                            }
                            const dataWorkflow = Object.assign(Object.assign({ id: workflow.data.id, menuId: workflow.data.menuId, backendUrl: workflow.data.beUrl, action: workflow.data.method, reqDate: moment(workflow.data.trxDate).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), reqNo: workflow.data.trxNo, reqSender: workflow.data.trxSender }, menudata), { workflowStep: workflowStepData.data, workflowNotes: workflowNotes, workflowAction: workflowAction.data });
                            result = {
                                status: workflow.status,
                                responseCode: 200,
                                data: dataWorkflow
                            };
                        }
                        else {
                            let errData;
                            if (workflowStepData.status == false) {
                                errData = 'getDataWorkflowStep => ' + workflowStepData.data;
                            }
                            else if (workflowStep.status == false) {
                                errData = 'getDataWorkflowStepDetail => ' + workflowStep.data;
                            }
                            else {
                                errData = 'getWorkflowAction => ' + workflowAction.data;
                            }
                            result = {
                                status: false,
                                responseCode: 500,
                                data: errData
                            };
                        }
                    }
                    else {
                        result = {
                            status: workflow.status,
                            responseCode: 200,
                            data: workflow.data
                        };
                    }
                }
                else {
                    result = workflow;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getDetail ' + error);
            }
        });
    };
}
exports.default = makeGetDetail;
