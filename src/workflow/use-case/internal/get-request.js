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
Object.defineProperty(exports, "__esModule", { value: true });
function makeGetRequest({ workflowDb }) {
    return function getRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getRequest = yield workflowDb.getDataRequest(body);
                let result;
                if (getRequest.status == true) {
                    let dataRequest = [];
                    if (getRequest.data.length > 0) {
                        yield getRequest.data.map((req) => __awaiter(this, void 0, void 0, function* () {
                            // console.log('req', req);
                            if (req.data != '{}') {
                                if (req.data != null) {
                                    if (req.data != '[object Object]') {
                                        const data = JSON.parse(req.data);
                                        // console.log('data', data);
                                        if (req.menuId == '005') {
                                            if (data.role) {
                                                dataRequest.push(data.role);
                                            }
                                            else {
                                                dataRequest.push(data);
                                            }
                                        }
                                        else if (req.menuId == '006') {
                                            if (data.length > 0) {
                                                yield data.map(flow => {
                                                    dataRequest.push(flow);
                                                });
                                            }
                                            else {
                                                dataRequest.push(data);
                                            }
                                        }
                                        else {
                                            dataRequest.push(data);
                                        }
                                    }
                                }
                            }
                        }));
                    }
                    else {
                        dataRequest = [];
                    }
                    result = {
                        status: getRequest.status,
                        responseCode: getRequest.responseCode,
                        data: {
                            menuData: dataRequest
                        }
                    };
                }
                else {
                    result = getRequest;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getDataRequest ' + error);
            }
        });
    };
}
exports.default = makeGetRequest;
