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
function makeCheckWorkflowSetting({ workflowDb }) {
    return function checkWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workflow = yield workflowDb.checkDataWorkflowSetting(body);
                let result;
                if (workflow.status == true) {
                    let data;
                    if (workflow.responseCode == 200) {
                        data = workflow.data.wfId;
                    }
                    else {
                        data = null;
                    }
                    result = {
                        status: workflow.status,
                        responseCode: 200,
                        data: data
                    };
                }
                else {
                    result = workflow;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-checkWorkflowSetting ' + error);
            }
        });
    };
}
exports.default = makeCheckWorkflowSetting;
