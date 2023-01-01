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
const app = require('express')();
let port = process.env.REDIS_PORT;
let host = process.env.REDIS_HOST;
let pass = process.env.REDIS_PASSWORD;
let lock = require("redis-lock")(require("redis").createClient({
    port: port,
    host: host,
    password: pass
}), 1);
module.exports = function makeExpressCallback(controller, camelcaseKeys) {
    return (req, res) => {
        lock("myLock", function (done) {
            return __awaiter(this, void 0, void 0, function* () {
                const httpRequest = {
                    body: camelcaseKeys(req.body, { deep: true }),
                    query: camelcaseKeys(req.query, { deep: true }),
                    params: camelcaseKeys(req.params, { deep: true }),
                    ip: req.ip,
                    method: req.method,
                    path: req.path,
                    file: req.file,
                    token: req.headers.authorization,
                    headers: {
                        'Content-Type': req.get('Content-Type'),
                        Referer: req.get('referer'),
                        'User-Agent': req.get('User-Agent')
                    }
                };
                yield controller(httpRequest)
                    // controller(httpRequest)
                    .then(httpResponse => {
                    if (httpResponse.headers) {
                        httpResponse.headers.VersionApp = '1.0.28';
                        res.set(httpResponse.headers);
                    }
                    res.type('json');
                    res.status(httpResponse.statusCode).send(httpResponse.body);
                })
                    .catch(e => {
                    res.status(500).send({ error: 'An unkown error occurred.' });
                });
                done();
            });
        });
    };
};
