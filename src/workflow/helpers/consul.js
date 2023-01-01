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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
require('dotenv').config();
const portService = Number(process.env.CONSUL_PORT);
const consul = require('consul')({
    host: process.env.CONSUL_HOST,
    port: portService,
});
function makeConsul({}) {
    return Object.freeze({
        setConsul,
        lookupService
    });
    function setConsul(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                const port = Number(process.env.PORT_APP);
                const hostname = os_1.default.hostname();
                const service = {
                    id: body.id,
                    name: body.name,
                    port: port,
                    address: hostname,
                    check: {
                        dockerContainerId: hostname,
                        tcp: hostname + ':' + port,
                        interval: '10s',
                        ttl: '60s',
                        timeout: '15s'
                    }
                };
                consul.agent.service.register(service, err => {
                    if (err)
                        console.log('register', err);
                });
                consul.agent.service.deregister(service.id, err => {
                    if (err)
                        console.log('deregister', err);
                });
                consul.catalog.service.nodes(service.name, (err, result) => {
                    if (err)
                        throw new Error(err);
                    console.log("Result Service:", result);
                });
            });
        });
    }
    function lookupService(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                console.log('body', body);
                const servicename = body.service;
                // resolve(servicename)
                consul.catalog.service.nodes(servicename, (err, result) => {
                    if (err)
                        throw new Error(err);
                    resolve(result);
                    console.log('ress1', result);
                });
                consul.catalog.connect.nodes(servicename, function (err, result) {
                    if (err)
                        throw err;
                    console.log('ress2', result);
                });
            });
        });
    }
}
exports.default = makeConsul;
