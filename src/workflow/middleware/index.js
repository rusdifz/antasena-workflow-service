"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalServer = void 0;
const internal_service_1 = __importDefault(require("./internal-service"));
const helpers_1 = require("../helpers");
const data_access_1 = require("../data-access");
const internalServer = (0, internal_service_1.default)({ consulService: helpers_1.consulService, workflowDb: data_access_1.workflowDb });
exports.internalServer = internalServer;
const paramMiddleware = Object.freeze({
    internalServer
});
exports.default = paramMiddleware;
