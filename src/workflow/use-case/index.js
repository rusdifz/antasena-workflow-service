"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotif = exports.getDataWorkflowSettingDetail = exports.getDataWorkflowSetting = exports.deleteDataWorkflowSetting = exports.updateDataWorkflowSetting = exports.createDataWorkflowSetting = exports.createDataRequestUploadFile = exports.checkDataPendingReqUpload = exports.checkDataWorkflowSetting = exports.checkDataWorkflow = exports.getDataRequest = exports.insertDataRequest = exports.updateDataDetail = exports.getDataDetail = exports.getDataTodo = exports.getDataStatus = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('id');
const data_access_1 = require("../data-access");
const middleware_1 = require("../middleware");
const workflow_1 = __importDefault(require("../entity/workflow"));
const notification_1 = __importDefault(require("../entity/notification"));
const workflow_setting_1 = __importDefault(require("../entity/workflow-setting"));
const get_status_1 = __importDefault(require("./status/get-status"));
const get_todo_1 = __importDefault(require("./todo/get-todo"));
const get_detail_1 = __importDefault(require("./detail/get-detail"));
const update_detail_1 = __importDefault(require("./detail/update-detail"));
const create_data_request_1 = __importDefault(require("./internal/create-data-request"));
const get_request_1 = __importDefault(require("./internal/get-request"));
const check_data_workflow_1 = __importDefault(require("./internal/check-data-workflow"));
const check_workflow_setting_1 = __importDefault(require("./internal/check-workflow-setting"));
const check_data_pending_req_upload_1 = __importDefault(require("./internal/check-data-pending-req-upload"));
const create_data_request_upload_file_1 = __importDefault(require("./internal/create-data-request-upload-file"));
const create_wf_setting_1 = __importDefault(require("./internal/setting/create-wf-setting"));
const update_wf_setting_1 = __importDefault(require("./internal/setting/update-wf-setting"));
const delete_wf_setting_1 = __importDefault(require("./internal/setting/delete-wf-setting"));
const get_wf_setting_1 = __importDefault(require("./internal/setting/get-wf-setting"));
const get_wf_setting_detail_1 = __importDefault(require("./internal/setting/get-wf-setting-detail"));
const send_notif_1 = __importDefault(require("./notification/send-notif"));
const getDataStatus = (0, get_status_1.default)({ workflowDb: data_access_1.workflowDb, moment: moment_timezone_1.default });
exports.getDataStatus = getDataStatus;
const getDataTodo = (0, get_todo_1.default)({ workflowDb: data_access_1.workflowDb, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.getDataTodo = getDataTodo;
const getDataDetail = (0, get_detail_1.default)({ workflowDb: data_access_1.workflowDb, internalServer: middleware_1.internalServer, moment: moment_timezone_1.default });
exports.getDataDetail = getDataDetail;
const updateDataDetail = (0, update_detail_1.default)({ workflowDb: data_access_1.workflowDb, internalServer: middleware_1.internalServer, moment: moment_timezone_1.default, userDb: data_access_1.userDb });
exports.updateDataDetail = updateDataDetail;
const insertDataRequest = (0, create_data_request_1.default)({ workflowDb: data_access_1.workflowDb, makeWorkflow: workflow_1.default, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.insertDataRequest = insertDataRequest;
const getDataRequest = (0, get_request_1.default)({ workflowDb: data_access_1.workflowDb });
exports.getDataRequest = getDataRequest;
const checkDataWorkflow = (0, check_data_workflow_1.default)({ workflowDb: data_access_1.workflowDb });
exports.checkDataWorkflow = checkDataWorkflow;
const checkDataWorkflowSetting = (0, check_workflow_setting_1.default)({ workflowDb: data_access_1.workflowDb });
exports.checkDataWorkflowSetting = checkDataWorkflowSetting;
const checkDataPendingReqUpload = (0, check_data_pending_req_upload_1.default)({ workflowDb: data_access_1.workflowDb });
exports.checkDataPendingReqUpload = checkDataPendingReqUpload;
const createDataRequestUploadFile = (0, create_data_request_upload_file_1.default)({ workflowDb: data_access_1.workflowDb, makeWorkflow: workflow_1.default, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.createDataRequestUploadFile = createDataRequestUploadFile;
const createDataWorkflowSetting = (0, create_wf_setting_1.default)({ workflowDb: data_access_1.workflowDb, makeWfSetting: workflow_setting_1.default });
exports.createDataWorkflowSetting = createDataWorkflowSetting;
const updateDataWorkflowSetting = (0, update_wf_setting_1.default)({ workflowDb: data_access_1.workflowDb, makeWfSetting: workflow_setting_1.default });
exports.updateDataWorkflowSetting = updateDataWorkflowSetting;
const deleteDataWorkflowSetting = (0, delete_wf_setting_1.default)({ workflowDb: data_access_1.workflowDb });
exports.deleteDataWorkflowSetting = deleteDataWorkflowSetting;
const getDataWorkflowSetting = (0, get_wf_setting_1.default)({ workflowDb: data_access_1.workflowDb, moment: moment_timezone_1.default });
exports.getDataWorkflowSetting = getDataWorkflowSetting;
const getDataWorkflowSettingDetail = (0, get_wf_setting_detail_1.default)({ workflowDb: data_access_1.workflowDb, moment: moment_timezone_1.default });
exports.getDataWorkflowSettingDetail = getDataWorkflowSettingDetail;
const sendNotif = (0, send_notif_1.default)({ userDb: data_access_1.userDb, makeNotification: notification_1.default });
exports.sendNotif = sendNotif;
const workflowService = Object.freeze({
    getDataStatus,
    getDataTodo,
    getDataDetail,
    updateDataDetail,
    insertDataRequest,
    getDataRequest,
    checkDataWorkflow,
    checkDataWorkflowSetting,
    checkDataPendingReqUpload,
    createDataRequestUploadFile,
    createDataWorkflowSetting,
    updateDataWorkflowSetting,
    deleteDataWorkflowSetting,
    getDataWorkflowSetting,
    getDataWorkflowSettingDetail,
    sendNotif
});
exports.default = workflowService;
