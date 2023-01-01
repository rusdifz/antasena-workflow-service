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
function makeUpdateDataWorkflowSetting({ workflowDb, makeWfSetting }) {
    return function updateDataWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield makeWfSetting(body);
                const updated = yield workflowDb.updateDataWorkflowSetting(entity);
                const result = {
                    status: updated.status,
                    responseCode: updated.responseCode,
                    data: {
                        locl: updated.data,
                        glob: updated.dataGlob
                    }
                };
                return result;
            }
            catch (error) {
                throw new Error('usecase-updateDataWorkflowSetting ' + error);
            }
        });
    };
}
exports.default = makeUpdateDataWorkflowSetting;
