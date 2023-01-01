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
const mssql_1 = __importDefault(require("mssql"));
require('dotenv').config();
const environment = process.env.ENVIRONMENT;
let server = process.env.DB_SERVER_DEV;
let user = process.env.DB_USER_DEV;
let password = process.env.DB_PASS_DEV;
let port = process.env.DB_PORT_DEV;
const pool = new mssql_1.default.ConnectionPool({
    user: user,
    password: password,
    server: server,
    database: 'ADP_Main',
    port: Number(port),
    parseJSON: true,
    dateStrings: true,
    pool: {
        max: 10,
        min: 0
    },
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
});
pool.connect((err) => {
    if (!err)
        console.log('DB koneksi adp_main suksess');
    else
        console.log('DB koneksi adp_main error : ' + err);
});
function makeUserDb({}) {
    return Object.freeze({
        getListRoleNotifWorkflow,
        getErrorCode,
        inputDataNotification
    });
    function getListRoleNotifWorkflow() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sqlApr = `SELECT * FROM m_user_role WHERE role_id LIKE '%APR%'`;
                        let resultApr = yield Query(sqlApr);
                        if (resultApr.recordset.length > 0) {
                            resolve(resultApr.recordset);
                        }
                        else {
                            resolve([]);
                        }
                    }
                    catch (error) {
                        reject(new Error('userDb - getListRoleNotifWorkflow ' + error));
                    }
                });
            });
        });
    }
    function getErrorCode() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'W001' ";
                        let result = yield Query(sql);
                        if (result.recordset.length > 0) {
                            resolve(result.recordset[0]);
                        }
                        else {
                            resolve({ local: '', global: '' });
                        }
                    }
                    catch (error) {
                        reject(new Error('getErrorCode ' + error));
                    }
                });
            });
        });
    }
    function inputDataNotification(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `INSERT INTO m_notification (module_id, username, datetime, title, title_glob, message, message_glob, status, created_user, created_time) 
                  VALUES ('${body.getModuleId()}', '${body.getUsername()}', '${body.getDatetime()}', '${body.getTitle()}', '${body.getTitleGlob()}', 
                          '${body.getMessage()}', '${body.getMessageGlob()}', ${body.getStatus()}, '${body.getUsername()}', '${body.getCreatedTime()}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200 });
                            }
                            else {
                                resolve({ code: 400 });
                            }
                        }
                        else {
                            resolve({ code: 500, data: 'SQL ' + result.data.number });
                            console.log('resu', result.data);
                        }
                    }
                    catch (error) {
                        reject(new Error('userDb - inputDataNotification ' + error));
                    }
                });
            });
        });
    }
    function Query(sintax) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const db = pool;
                db.connect((err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return reject(new Error(err));
                    }
                    yield db.request().query(sintax, (err, results) => {
                        if (err) {
                            return reject(new Error("querry error " + err));
                        }
                        else {
                            resolve(results);
                        }
                    });
                    if (environment === 'development') {
                        console.log("execQuery", sintax);
                    }
                }));
            }));
        });
    }
}
exports.default = makeUserDb;
function QueryTransaction(sintax) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const db = pool;
        const transaction = db.transaction();
        console.log('trsn success');
        yield transaction.begin((err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                reject(new Error('SQL Transaction' + err));
            }
            console.log('masuk');
            const request = transaction.request();
            var query = yield request.query(sintax, (err, results) => {
                if (err) {
                    transaction.rollback(err => {
                        if (err) {
                            console.log('rollback error');
                        }
                        else {
                            console.log('rollback success');
                        }
                    });
                    resolve({ status: false, data: err });
                }
                else {
                    transaction.commit(err => {
                        if (err) {
                            console.log('commit error');
                        }
                        else {
                            console.log('commit success');
                        }
                    });
                    resolve({ status: true, data: results });
                }
            });
            if (environment === 'development') {
                console.log("execQuery", sintax);
            }
        }));
    }));
}
