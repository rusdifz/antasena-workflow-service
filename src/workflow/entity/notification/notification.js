"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeNotification(moment) {
    return function makeNotification({ moduleId = '', username = '', datetime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), title = '', titleGlob = '', message = '', messageGlob = '', status = 0, createdTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss') } = {}) {
        return Object.freeze({
            getModuleId: () => moduleId,
            getUsername: () => username,
            getDatetime: () => datetime,
            getTitle: () => title,
            getTitleGlob: () => titleGlob,
            getMessage: () => message,
            getMessageGlob: () => messageGlob,
            getStatus: () => status,
            getCreatedTime: () => createdTime
        });
    };
}
exports.default = buildMakeNotification;
