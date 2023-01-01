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
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const environment = process.env.ENVIRONMENT;
function makeInternalServer({ consulService, workflowDb }) {
    return Object.freeze({
        authentication,
        credentialRequest,
        userProfile,
        requestWfsetting,
        getWorkflowAction,
        worfklowTodoSetting
        // sendLogRequest
    });
    function authentication(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    // const result = await consulService.lookupService({service: 'auth-service'})
                    // console.log('res', result);
                    // const response = await http.request({
                    //     host: result[0].ServiceAddress,
                    //     port: result[0].ServicePort,
                    //     path: '/account/get',
                    //     method: 'GET'
                    // })
                    // res.send(response)
                    // const host = result[0].ServiceAddress
                    // const port = result[0].ServicePort
                    // const path = '/master/auth/me'
                    // const url2 = 'https://'+host+':'+port+path
                    // const url = 'https://api.adapro.tech/master/auth/me'
                    const url = process.env.URL_MASTER + '/auth/me';
                    const token = body.token;
                    (0, axios_1.default)({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    })
                        .then(result => {
                        resolve(result.data);
                    })
                        .catch(err => {
                        // console.log('err',err)
                        // reject(new Error(err))
                        resolve(err.response.data);
                    });
                });
            });
        });
    }
    function credentialRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    let url;
                    let method;
                    let data;
                    const getUrl = yield workflowDb.getDataCallbackUrl({ menuId: body.menuId, beUrl: body.beUrl });
                    const urlHost = process.env.URL_INTERNAL_CREDENTIAL;
                    url = urlHost + getUrl;
                    // console.log('ul', url);
                    // if(body.menuId == '003'){
                    //   url = 'http://34.101.137.61:7002/credential/internal/user/detail/role' 
                    //   // url = 'http://localhost:7002/credential/internal/user/detail/role'        
                    // }else if(body.menuId == '004'){
                    //   url = 'http://34.101.137.61:7002/credential/internal/user/detail/branch'
                    //   // url = 'http://localhost:7002/credential/internal/user/detail/branch'
                    // }else if(body.menuId == '005'){
                    //   if(body.beUrl == '/credential/role/mapping'){
                    //     url = 'http://34.101.137.61:7002/credential/internal/role/mapping/'
                    //     // url = 'http://localhost:7002/credential/internal/role/mapping/'
                    //   }else{
                    //     url = 'http://34.101.137.61:7002/credential/internal/role/detail/'
                    //   // url = 'http://localhost:7002/credential/internal/role/detail/'
                    //   }
                    // }else{
                    //   url = 'http://34.101.137.61:7002/credential/internal/branch/detail'
                    //   // url = 'http://localhost:7002/credential/internal/branch/detail'
                    // }
                    if (body.method.toLowerCase() == 'post' || body.method.toLowerCase() == 'upload') {
                        method = 'POST';
                        data = {
                            data: body.data
                        };
                    }
                    else if (body.method.toLowerCase() == 'put') {
                        method = 'PUT';
                        data = {
                            data: body.data
                        };
                    }
                    else {
                        method = 'DELETE';
                        data = {
                            params: body.data
                        };
                    }
                    (0, axios_1.default)(Object.assign(Object.assign({ method: method, url: url }, data), { headers: {
                            'Content-Type': 'application/json'
                        } }))
                        .then(result => {
                        console.log('data', result.data);
                        resolve(result.data);
                    })
                        .catch(err => {
                        console.log('err', err.response.data);
                        resolve(err.response.data);
                    });
                });
            });
        });
    }
    function userProfile(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                // let url = "https://api-dev.adapro.tech/general/user/profile"
                // let url = "http://34.101.137.61:7001/general/internal/user/profile/data"
                let url = process.env.URL_INTERNAL_GENERAL + '/internal/user/profile/data';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        username: body.username
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    // console.log('data',result.data)
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err)
                    // resolve(err)
                    reject(new Error(err));
                });
            });
        });
    }
    function requestWfsetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                let url = process.env.URL_WORKFLOW_SETTING + '/internal/request';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        wfid: body.wfId,
                        actid: body.actId
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: body.key
                    }
                })
                    .then(result => {
                    // console.log('data',result.data)
                    resolve(result.data.data);
                })
                    .catch(err => {
                    // console.log('err',err)
                    // resolve(err)
                    reject(new Error(err));
                });
            });
        });
    }
    function getWorkflowAction(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                let url = process.env.URL_WORKFLOW_SETTING + '/internal/action';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        wfid: body.wfId,
                        stepid: body.stepId
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: body.key
                    }
                })
                    .then(result => {
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err)
                    // reject(new Error(err))
                    const dataError = { status: false, data: err };
                    resolve(dataError);
                });
            });
        });
    }
    function worfklowTodoSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                let url = process.env.URL_WORKFLOW_SETTING + '/internal/todo';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        roleId: body.roleId
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: body.key
                    }
                })
                    .then(result => {
                    resolve(result.data.data);
                })
                    .catch(err => {
                    // console.log('err',err)
                    // resolve(err)
                    reject(new Error(err));
                });
            });
        });
    }
    // async function sendLogRequest(body){
    //   return new Promise(function(resolve, reject) {
    //     const url = process.env.URL_HOST_LOG+'/activity/detail'
    //     // const url = 'https://api-dev.adapro.tech/log/activity/detail'
    //     axios ({
    //       method: 'PUT',
    //       url: url,
    //       data: {
    //         ...body
    //       },
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     })
    //     .then(result =>{
    //       // console.log('masuk');
    //       resolve(result.data)
    //     })
    //     .catch(err =>{
    //       if(err.response != undefined){
    //         resolve(err.response.data)
    //       }else{
    //         reject(new Error('Log Service ECONNREFUSED'))
    //       }
    //     })
    //   })
    // }
}
exports.default = makeInternalServer;
