"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const brokerType = require('redis-streams-broker').StreamChannelBroker;
let port = process.env.REDIS_PORT;
let host = process.env.REDIS_HOST;
let pass = process.env.REDIS_PASSWORD;
const redis = new Redis({
    port: port,
    host: host,
    password: pass
});
const redisClient = new brokerType(redis, "saveLog");
exports.default = redisClient;
