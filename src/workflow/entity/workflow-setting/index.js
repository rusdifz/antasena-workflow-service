"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wf_setting_1 = __importDefault(require("./wf-setting"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('id');
const makeWfSetting = (0, wf_setting_1.default)(moment_timezone_1.default);
exports.default = makeWfSetting;
