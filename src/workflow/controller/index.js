"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkflowSettingDetail = exports.getWorkflowSetting = exports.deleteWorkflowSetting = exports.updateWorkflowSetting = exports.createWorkflowSetting = exports.createRequestUpload = exports.checkPendingDataReqUpload = exports.checkWorkflowSetting = exports.checkWorkflowData = exports.getRequest = exports.internalCreateRequest = exports.updateDetail = exports.getDetail = exports.getTodo = exports.getStatus = void 0;
const helpers_1 = require("../helpers");
const use_case_1 = require("../use-case");
const middleware_1 = require("../middleware");
const get_status_1 = __importDefault(require("./status/get-status"));
const get_todo_1 = __importDefault(require("./todo/get-todo"));
const get_detail_1 = __importDefault(require("./detail/get-detail"));
const update_detail_1 = __importDefault(require("./detail/update-detail"));
const create_data_request_1 = __importDefault(require("./internal/create-data-request"));
const get_request_1 = __importDefault(require("./internal/get-request"));
const check_workflow_data_1 = __importDefault(require("./internal/check-workflow-data"));
const check_workflow_setting_1 = __importDefault(require("./internal/check-workflow-setting"));
const check_data_pending_req_upload_1 = __importDefault(require("./internal/check-data-pending-req-upload"));
const create_request_upload_file_1 = __importDefault(require("./internal/create-request-upload-file"));
const create_wf_setting_1 = __importDefault(require("./internal/setting/create-wf-setting"));
const update_wf_setting_1 = __importDefault(require("./internal/setting/update-wf-setting"));
const delete_wf_setting_1 = __importDefault(require("./internal/setting/delete-wf-setting"));
const get_wf_setting_1 = __importDefault(require("./internal/setting/get-wf-setting"));
const get_wf_setting_detail_1 = __importDefault(require("./internal/setting/get-wf-setting-detail"));
const getStatus = (0, get_status_1.default)({ getDataStatus: use_case_1.getDataStatus, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getStatus = getStatus;
const getTodo = (0, get_todo_1.default)({ getDataTodo: use_case_1.getDataTodo, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getTodo = getTodo;
const getDetail = (0, get_detail_1.default)({ getDataDetail: use_case_1.getDataDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getDetail = getDetail;
const updateDetail = (0, update_detail_1.default)({ updateDataDetail: use_case_1.updateDataDetail, internalServer: middleware_1.internalServer, sendNotif: use_case_1.sendNotif, redisClient: helpers_1.redisClient });
exports.updateDetail = updateDetail;
const internalCreateRequest = (0, create_data_request_1.default)({ insertDataRequest: use_case_1.insertDataRequest });
exports.internalCreateRequest = internalCreateRequest;
const getRequest = (0, get_request_1.default)({ getDataRequest: use_case_1.getDataRequest });
exports.getRequest = getRequest;
const checkWorkflowData = (0, check_workflow_data_1.default)({ checkDataWorkflow: use_case_1.checkDataWorkflow });
exports.checkWorkflowData = checkWorkflowData;
const checkWorkflowSetting = (0, check_workflow_setting_1.default)({ checkDataWorkflowSetting: use_case_1.checkDataWorkflowSetting });
exports.checkWorkflowSetting = checkWorkflowSetting;
const checkPendingDataReqUpload = (0, check_data_pending_req_upload_1.default)({ checkDataPendingReqUpload: use_case_1.checkDataPendingReqUpload });
exports.checkPendingDataReqUpload = checkPendingDataReqUpload;
const createRequestUpload = (0, create_request_upload_file_1.default)({ createDataRequestUploadFile: use_case_1.createDataRequestUploadFile });
exports.createRequestUpload = createRequestUpload;
const createWorkflowSetting = (0, create_wf_setting_1.default)({ createDataWorkflowSetting: use_case_1.createDataWorkflowSetting, internalServer: middleware_1.internalServer });
exports.createWorkflowSetting = createWorkflowSetting;
const updateWorkflowSetting = (0, update_wf_setting_1.default)({ updateDataWorkflowSetting: use_case_1.updateDataWorkflowSetting, internalServer: middleware_1.internalServer });
exports.updateWorkflowSetting = updateWorkflowSetting;
const deleteWorkflowSetting = (0, delete_wf_setting_1.default)({ deleteDataWorkflowSetting: use_case_1.deleteDataWorkflowSetting, internalServer: middleware_1.internalServer });
exports.deleteWorkflowSetting = deleteWorkflowSetting;
const getWorkflowSetting = (0, get_wf_setting_1.default)({ getDataWorkflowSetting: use_case_1.getDataWorkflowSetting, internalServer: middleware_1.internalServer });
exports.getWorkflowSetting = getWorkflowSetting;
const getWorkflowSettingDetail = (0, get_wf_setting_detail_1.default)({ getDataWorkflowSettingDetail: use_case_1.getDataWorkflowSettingDetail, internalServer: middleware_1.internalServer });
exports.getWorkflowSettingDetail = getWorkflowSettingDetail;
const workflowController = Object.freeze({
    getStatus,
    getTodo,
    getDetail,
    updateDetail,
    internalCreateRequest,
    getRequest,
    checkWorkflowData,
    checkWorkflowSetting,
    checkPendingDataReqUpload,
    createRequestUpload,
    createWorkflowSetting,
    updateWorkflowSetting,
    deleteWorkflowSetting,
    getWorkflowSetting,
    getWorkflowSettingDetail
});
exports.default = workflowController;
