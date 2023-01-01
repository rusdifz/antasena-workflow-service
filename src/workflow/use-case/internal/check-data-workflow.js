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
function makeCheckDataWorkflow({ workflowDb }) {
    return function checkDataWorkflow(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkWorkflow = yield workflowDb.checkDataWorkflow(body);
                let result;
                if (checkWorkflow.status == true) {
                    let data = [];
                    if (checkWorkflow.data.length > 0) {
                        yield checkWorkflow.data.map((workflow) => __awaiter(this, void 0, void 0, function* () {
                            if (workflow.method == 'DELETE') {
                                const menudata = JSON.parse(workflow.data);
                                yield menudata.map(menu => {
                                    data.push(menu);
                                });
                            }
                            else if (workflow.method == 'PUT') {
                                const menudata = JSON.parse(workflow.dataNew);
                                data.push(menudata);
                            }
                            else {
                                const menudata = JSON.parse(workflow.data);
                                if (workflow.beUrl == '/credential/role/mapping') {
                                    data.push(menudata.role);
                                }
                                else {
                                    data.push(menudata);
                                }
                            }
                        }));
                    }
                    result = {
                        status: checkWorkflow.status,
                        responseCode: checkWorkflow.responseCode,
                        data: data
                    };
                }
                else {
                    result = checkWorkflow;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-checkStatusWorkflow ' + error);
            }
        });
    };
}
exports.default = makeCheckDataWorkflow;
