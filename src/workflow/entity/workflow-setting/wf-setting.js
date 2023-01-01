"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeWorkflowSetting(moment) {
    return function makeWorkflowSetting({ id = '', moduleId = '', menuId = '', backendUrl = '', method = '', wfId = '', callbackUrl = '', conditionString = '', usernameToken = '', createdTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), updatedTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss') } = {}) {
        return Object.freeze({
            getId: () => id,
            getModuleId: () => moduleId,
            getMenuId: () => menuId,
            getBackendUrl: () => backendUrl,
            getMethod: () => method,
            getWfId: () => wfId,
            getCallbackUrl: () => callbackUrl,
            getConditionString: () => conditionString,
            getUsernameToken: () => usernameToken,
            getCreatedTime: () => createdTime,
            getUpdatedTime: () => updatedTime
        });
    };
}
exports.default = buildMakeWorkflowSetting;
