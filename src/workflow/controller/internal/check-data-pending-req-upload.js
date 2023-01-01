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
function makeCheckPendingDataReqUpload({ checkDataPendingReqUpload }) {
    return function checkPendingDataReqUpload(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bodyparam = httpRequest.query;
                const posted = yield checkDataPendingReqUpload(bodyparam);
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: posted.responseCode,
                    body: posted
                };
            }
            catch (err) {
                // TODO: Error logging
                console.log(err);
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 400,
                    body: {
                        status: false,
                        responseCode: 400,
                        message: err.message
                    }
                };
            }
        });
    };
}
exports.default = makeCheckPendingDataReqUpload;
