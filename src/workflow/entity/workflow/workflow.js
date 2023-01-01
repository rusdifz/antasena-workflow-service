"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeWorkflow(moment) {
    return function makeWorkflow({ username = '', moduleId = '', menuId = '', backendUrl = '', method = '', menuData = {}, menuDataNew = {}, trxStatus = '', wfId = '', stepId = '', reqDate = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), reqNo = '', keyId = '', keyName = '', createdTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), updatedTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss') } = {}) {
        let dataOld;
        if (menuData == null) {
            dataOld = JSON.stringify({});
        }
        else {
            dataOld = JSON.stringify(menuData);
        }
        const dataNew = JSON.stringify(menuDataNew);
        const reqSender = username;
        console.log('reqNo', reqNo);
        return Object.freeze({
            getUsername: () => username,
            getModuleId: () => moduleId,
            getMenuId: () => menuId,
            getBackendUrl: () => backendUrl,
            getMethod: () => method,
            getDataOld: () => dataOld,
            getDataNew: () => dataNew,
            getStatus: () => trxStatus,
            getWfId: () => wfId,
            getStepId: () => stepId,
            getReqDate: () => reqDate,
            getReqNo: () => reqNo,
            getReqSender: () => reqSender,
            getKeyId: () => keyId,
            getKeyName: () => keyName,
            getCreatedTime: () => createdTime,
            getUpdatedTime: () => updatedTime
        });
    };
}
exports.default = buildMakeWorkflow;
