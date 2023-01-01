"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workflow_1 = __importDefault(require("./workflow"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('id');
const makeWorkflow = (0, workflow_1.default)(moment_timezone_1.default);
exports.default = makeWorkflow;
