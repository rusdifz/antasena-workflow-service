"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const makeCallback = require('./call-back');
const helpers_1 = require("./helpers");
const controller_1 = require("./controller");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: '5000kb' }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.get('/status', makeCallback(controller_1.getStatus, camelcase_keys_1.default));
app.get('/todo', makeCallback(controller_1.getTodo, camelcase_keys_1.default));
app.get('/detail', makeCallback(controller_1.getDetail, camelcase_keys_1.default));
app.post('/detail', makeCallback(controller_1.updateDetail, camelcase_keys_1.default));
app.post('/internal/request', makeCallback(controller_1.internalCreateRequest, camelcase_keys_1.default));
app.get('/internal/request', makeCallback(controller_1.getRequest, camelcase_keys_1.default));
app.get('/internal/check/setting', makeCallback(controller_1.checkWorkflowSetting, camelcase_keys_1.default));
app.get('/internal/check/data', makeCallback(controller_1.checkWorkflowData, camelcase_keys_1.default));
app.get('/internal/check/data/pending/upload', makeCallback(controller_1.checkPendingDataReqUpload, camelcase_keys_1.default));
app.post('/internal/request/upload', makeCallback(controller_1.createRequestUpload, camelcase_keys_1.default));
app.put('/internal/setting/detail', makeCallback(controller_1.createWorkflowSetting, camelcase_keys_1.default));
app.post('/internal/setting/detail', makeCallback(controller_1.updateWorkflowSetting, camelcase_keys_1.default));
app.delete('/internal/setting/detail', makeCallback(controller_1.deleteWorkflowSetting, camelcase_keys_1.default));
app.get('/internal/setting', makeCallback(controller_1.getWorkflowSetting, camelcase_keys_1.default));
app.get('/internal/setting/detail', makeCallback(controller_1.getWorkflowSettingDetail, camelcase_keys_1.default));
//endpoint check server
app.get('/server_check', function (req, res) {
    res.send({
        statusCode: 200,
        body: {
            responseCode: 200,
            data: 'workflow service good'
        }
    });
});
app.use((err, req, res, next) => {
    (0, helpers_1.handleError)(err, res);
});
exports.default = app;
