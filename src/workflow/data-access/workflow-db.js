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
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('id');
function makeWorkflowDb({ QueryGet, QueryTransaction }) {
    return Object.freeze({
        getDataFlowTrx,
        getDataDetail,
        getDataCallbackUrl,
        getDataWorkflowStep,
        getDataWorkflowStepDetail,
        getDataWorkflowNotes,
        getDataWorkflowAction,
        getDataRequest,
        getDataTrxStepAll,
        checkDataWorkflow,
        checkDataWorkflowSetting,
        checkLastReqNo,
        checkDataUseWorkflow,
        getWfSetting,
        insertDataRequest,
        sameDataValidationWorkflow,
        updateDataNew,
        updateDataOld,
        insertWorkflowStep,
        updateWorkflowStep,
        updateWorkflowStatus,
        updateWorkflowStatusMethodUpload,
        updateWorkflowCurrentStep,
        updateKeyData,
        checkMaker,
        checkDataPendingReqUpload,
        deleteDataRequest,
        createDataWorkflowSetting,
        updateDataWorkflowSetting,
        deleteDataWorkflowSetting,
        getDataWorkflowSetting,
        getDataWorkflowSettingDetail
    });
    function getDataFlowTrx(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('body', body);
                        let limit = '';
                        let pagination = '';
                        let where = "WHERE module_id = '" + body.moduleId + "'";
                        let orderby;
                        if (body.filter) {
                            let filter;
                            if (body.filter.search('trx_status') != -1) {
                                let filter2 = body.filter.toLowerCase();
                                if (filter2.search("trx_status = 'waiting'") != -1) {
                                    filter = filter2.replace(/waiting/gi, 0);
                                }
                                else if (filter2.search("approved") != -1) {
                                    filter = filter2.replace(/approved/gi, 1);
                                }
                                else {
                                    filter = filter2.replace(/rejected/gi, 2);
                                }
                            }
                            else {
                                filter = body.filter;
                            }
                            where += " and " + filter;
                        }
                        if (body.menuId) {
                            where += " AND menu_id = '" + body.menuId + "' ";
                        }
                        if (body.infoData == 'status') {
                            if (body.username) {
                                where += " AND trx_sender = '" + body.username + "' ";
                            }
                        }
                        else {
                            // if(body.usernameToken){
                            //   where += " AND trx_sender = '"+body.usernameToken+"' ";
                            // }
                            const filterTodo = body.wfStep.toString().replace(/,/gi, "','");
                            where += " and trx_status = 0 and isnull(wf_id,'')+isnull(step_id,'') in ('" + filterTodo + "')";
                        }
                        if (body.perpage) {
                            limit += body.perpage;
                        }
                        else {
                            limit += 1000;
                        }
                        if (body.page) {
                            let offset = parseInt(body.page);
                            let page = offset - 1;
                            pagination = page * limit;
                        }
                        else {
                            pagination = 0;
                        }
                        let menu;
                        if (body.infoData == 'status') {
                            menu = '019';
                        }
                        else {
                            menu = '020';
                        }
                        let orderBy = body.orderby;
                        if (orderBy == 'reqDate') {
                            orderby = 'ORDER BY trx_date ';
                        }
                        else if (orderBy == 'reqNo') {
                            orderby = 'ORDER BY trx_no ';
                        }
                        else if (orderBy == 'reqSender') {
                            orderby = 'ORDER BY trx_sender ';
                        }
                        else if (orderBy == 'method') {
                            orderby = 'ORDER BY method ';
                        }
                        else if (orderBy == 'statusWorkflow') {
                            orderby = 'ORDER BY trx_status ';
                        }
                        else if (orderBy == 'keyId') {
                            orderby = 'ORDER BY key_id ';
                        }
                        else if (orderBy == 'keyName') {
                            orderby = 'ORDER BY key_name ';
                        }
                        else {
                            orderby = 'ORDER BY id ';
                        }
                        if (body.ordertype == 'asc' || body.ordertype == 'desc') {
                            orderby += body.ordertype;
                        }
                        else {
                            orderby += 'asc';
                        }
                        console.log('orderBy', orderBy);
                        console.log('orderby', orderby);
                        let sql = `SELECT id, module_id as 'moduleId', menu_id as 'menuId', menu_be_url as 'beUrl', menu_be_method as 'method', 
                  trx_date as 'trxDate', trx_no as 'trxNo', trx_sender as 'trxSender', 
                  CASE WHEN trx_status = 1 THEN 'Approved' WHEN trx_status = 2 THEN 'Rejected' ELSE 'Waiting' END as 'trxStatus', 
                  data as 'data', data_new as 'dataNew', created_time as 'createdTime', created_user as 'createdUser', updated_time as 'updatedTime', updated_user as 'updatedUser',   
                  key_id, key_name
                  FROM df_trx ${where} ${orderby} OFFSET ${parseInt(pagination)} ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY`;
                        let count = `SELECT COUNT(id) as 'all' FROM df_trx ${where}`;
                        let infoFilter = `SELECT field_order as 'fieldOrder', field_name as 'fieldName', field_desc as 'fieldDesc', field_type as 'fieldType' 
                          FROM adp_main.dbo.M_Menu_Filter WHERE menu_id = '${menu}' order by field_order asc`;
                        let result = yield QueryGet(sql);
                        let resultCount = yield QueryGet(count);
                        let resultFilter = yield QueryGet(infoFilter);
                        if (result.status == true && resultCount.status == true && resultFilter.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: "filled", responseCode: 200, data: result.data.recordset, countAll: resultCount.data.recordset[0].all, filter: resultFilter.data.recordset });
                            }
                            else {
                                resolve({ status: "empty", responseCode: 200, data: [], countAll: resultCount.data.recordset[0].all, filter: resultFilter.data.recordset });
                            }
                        }
                        else {
                            if (result.status == false) {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                            }
                            else if (resultCount.status == false) {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + resultCount.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + resultFilter.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataFlowTrx ' + error));
                    }
                });
            });
        });
    }
    function getDataDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT id, module_id as 'moduleId', menu_id as 'menuId', menu_be_url as 'beUrl', menu_be_method as 'method', 
                  trx_date as 'trxDate', trx_no as 'trxNo', trx_sender as 'trxSender', trx_status as 'trxStatus', wf_id as 'wfId', step_id as 'stepId', 
                  data as 'data', data_new as 'dataNew', curr_step_id as 'currStepId' FROM df_trx where id = '${body.id}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset[0] });
                            }
                            else {
                                resolve({ status: true, responseCode: 404, data: {} });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataDetail ' + error));
                    }
                });
            });
        });
    }
    function getDataCallbackUrl(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('body', body);
                        let sql = `SELECT callback_url as 'url' FROM df_setting WHERE menu_id = '${body.menuId}' AND backend_url = '${body.beUrl}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve(result.data.recordset[0].url);
                            }
                            else {
                                resolve('');
                            }
                        }
                        else {
                            resolve('');
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataCallbackUrl ' + error));
                    }
                });
            });
        });
    }
    function getDataWorkflowStepDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT id, trx_no as 'trxNo', wf_id as 'wfId', wf_step as 'stepId', wf_step_note as 'stepNote', 
                    step_user as 'stepUser', step_date as 'stepDate', wf_step_desc as 'stepDesc' FROM df_trx_step where trx_no = '${body.id}' ORDER BY id asc `;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, data: result.data.recordset });
                            }
                            else {
                                resolve({ status: true, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataWorkflowStepDetail ' + error));
                    }
                });
            });
        });
    }
    function getDataWorkflowStep(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT id, wf_step_desc as 'stepName', wf_step_descglob as 'stepNameGlob', step_date as 'stepDate', step_status as 'stepStatus'
                    FROM df_trx_step WHERE trx_no = '${body.id}' ORDER BY id asc `;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                let data = yield Promise.all(result.data.recordset.map((workflow, index) => {
                                    let stepDate;
                                    if (workflow.stepDate == null) {
                                        stepDate = null;
                                    }
                                    else {
                                        stepDate = (0, moment_1.default)(workflow.stepDate).format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    const step = {
                                        stepOrder: index + 1,
                                        stepName: workflow.stepName,
                                        stepNameGlob: workflow.stepNameGlob,
                                        stepDate: stepDate,
                                        stepStatus: workflow.stepStatus
                                    };
                                    return step;
                                }));
                                resolve({ status: true, data: data });
                            }
                            else {
                                resolve({ status: true, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataWorkflowStep ' + error));
                    }
                });
            });
        });
    }
    function getDataWorkflowNotes(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        // let sql = `SELECT wf_step_note as 'stepNote' from df_trx_step WHERE trx_no = '${body.id}' ORDER BY id desc `;
                        let sql = `SELECT wf_step_note as 'stepNote' from df_trx_step WHERE trx_no = '${body.id}' AND step_date != '' ORDER BY step_date desc`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, data: result.data.recordset[0].stepNote });
                            }
                            else {
                                resolve({ status: true, data: '' });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataWorkflowNotes ' + error));
                    }
                });
            });
        });
    }
    function getDataWorkflowAction(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('body', body);
                        let where = 'WHERE 1=1';
                        if (body.stepId) {
                            where += ` AND step_id = '${body.stepId}'`;
                        }
                        let sql = `SELECT act_id as 'actionId', act_name as 'actionName', act_color as 'actionColor' 
                  FROM df_mst_wf_act ${where} order by id asc`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - SQL ' + result.data.number });
                        }
                        // if(result.recordset.length > 0){
                        //   resolve({data: result.recordset})
                        // }else{
                        //   resolve({data: []});
                        // }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataWorkflowAction ' + error));
                    }
                });
            });
        });
    }
    function getDataRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let where;
                        if (body.backendUrl == '/credential/user') {
                            where = `WHERE menu_id in ('003','004') and trx_status=0 and menu_be_method != 'PUT'`;
                        }
                        else {
                            where = `where menu_id = '${body.menuId}' and trx_status=0 and menu_be_method != 'PUT'`;
                        }
                        let sql = `SELECT data, data_new as 'dataNew', menu_id as 'menuId' FROM df_trx ${where} order by id desc`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataRequest ' + error));
                    }
                });
            });
        });
    }
    function getDataTrxStepAll(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT wf_id as 'wfId', step_id as 'stepId' FROM df_mst_wf_step ORDER BY id asc`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - SQL ' + result.data.number });
                        }
                        // if(result.recordset.length > 0){
                        //   resolve({data: result.recordset})
                        // }else{
                        //   resolve({data: []});
                        // }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataTrxStepAll ' + error));
                    }
                });
            });
        });
    }
    function checkDataWorkflow(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('body', body);
                        let sql;
                        if (body.method == 'DELETE') {
                            sql = `SELECT menu_be_method as 'method', menu_be_url as 'beUrl', data, data_new as 'dataNew' FROM df_trx 
                 where menu_id = '${body.menuId}' AND menu_be_url = '${body.backendUrl}' AND trx_status = 0 
                 AND menu_be_method != 'PUT' order by id desc`;
                        }
                        else {
                            sql = `SELECT menu_be_method as 'method', menu_be_url as 'beUrl', data, data_new as 'dataNew' FROM df_trx 
                  where menu_id = '${body.menuId}' AND menu_be_url = '${body.backendUrl}' AND trx_status = 0 order by id desc`;
                        }
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Check Data - Workflow Service => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-dataCheckWorkflow ' + error));
                    }
                });
            });
        });
    }
    function checkDataWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT wf_id as 'wfId' FROM df_setting WHERE menu_id = '${body.menuId}' AND backend_url = '${body.beUrl}' AND method = '${body.method}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset[0] });
                            }
                            else {
                                resolve({ status: true, responseCode: 404, data: { wfId: null } });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Check Setting - Workflow Service => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-checkWorkflowSetting ' + error));
                    }
                });
            });
        });
    }
    function checkLastReqNo() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT trx_no from df_trx order by id desc`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve(result.data.recordset[0].trx_no);
                            }
                            else {
                                resolve('');
                            }
                        }
                        else {
                            resolve('');
                        }
                        // if(result.status == true){
                        //   if(result.data.recordset.length > 0){
                        //     resolve({status: true, data: result.data.recordset[0].trx_no})
                        //   }else{
                        //     resolve({status: true, data: ''});
                        //   }
                        // }else{
                        //   resolve({status: false, responseCode: 500, data: 'checkDataUseWorkflow => SQL '+result.data.number});
                        // }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-checkLastReqNo ' + error));
                    }
                });
            });
        });
    }
    function checkDataUseWorkflow(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT wf_id as 'wfId' FROM df_setting where menu_id = '${body.menuId}' AND backend_url = '${body.beUrl}' AND method = '${body.method}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, data: result.data.recordset[0].wfId });
                            }
                            else {
                                resolve({ status: true, data: null });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'checkDataUseWorkflow => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-checkDataUseWorkflow ' + error));
                    }
                });
            });
        });
    }
    function getWfSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT wf_id as 'wfId', condition_string as 'conditionString' FROM df_setting where menu_id = '${body.menuId}' AND backend_url = '${body.beUrl}' AND method = '${body.method}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, data: result.data.recordset[0] });
                            }
                            else {
                                resolve({ status: true, data: null });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'getWfSetting => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getWfSetting ' + error));
                    }
                });
            });
        });
    }
    function insertDataRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        // if(body.infoWorkflow == 'pending'){
                        //   let checkVerifikasi
                        //   if(body.getMethod() == 'DELETE'){
                        //     let dataverif:any[] = []
                        //     let errorSql = false
                        //     const verifikasiDelete = `SELECT data as 'dataOld' FROM df_trx WHERE menu_id = '${body.getMenuId()}' AND menu_be_url = '${body.getBackendUrl()}' AND menu_be_method = 'DELETE' AND trx_status = 0`
                        //     let resultVerifDelete = await QueryGet(verifikasiDelete)
                        //    if(resultVerifDelete.status == true){
                        //     if(resultVerifDelete.data.recordset.length > 0){
                        //       await resultVerifDelete.data.recordset.map(async data=>{
                        //         const parseData = JSON.parse(data.dataOld)
                        //         await parseData.map(data2=>{
                        //           const keyId = {keyid: data2.id}
                        //           dataverif.push(keyId)
                        //         })
                        //       })
                        //     }
                        //    }else{
                        //     errorSql = true
                        //    }
                        //     console.log('dataverif', dataverif);
                        //     if(errorSql == false){
                        //       if(dataverif.length > 0){
                        //         const parseData = JSON.parse(body.getDataOld())
                        //         const checkDelete = await validasiDataMethodDelete({dataVerif: dataverif, menuData: parseData})
                        //         console.log('check', checkDelete);
                        //         if(checkDelete.code == 200){
                        //           checkVerifikasi = {code: 200}
                        //         }else{
                        //           checkVerifikasi = {code: 406, message: checkDelete.message, dataFalse: checkDelete.data}
                        //         }
                        //       }else{
                        //         checkVerifikasi = {code: 200}
                        //       }
                        //     }else{
                        //       checkVerifikasi= {code: 500, message: 'verifikasi => SQL '+ resultVerifDelete.data.number}
                        //     }
                        //   }else{
                        //     // const sqlverifikasi = `SELECT key_id as 'keyId', key_name as 'keyName' FROM df_trx WITH (UPDLOCK, READPAST) WHERE trx_status = 0 AND (key_id = '${body.getKeyId()}' OR key_name = '${body.getKeyName()}') AND menu_id = '${body.getMenuId()}' 
                        //     //                      AND menu_be_url = '${body.getBackendUrl()}' AND menu_be_method != 'DELETE'`
                        //     const sqlverifikasi = `SELECT key_id as 'keyId', key_name as 'keyName' FROM df_trx WHERE trx_status = 0 AND (key_id = '${body.getKeyId()}' OR key_name = '${body.getKeyName()}') AND menu_id = '${body.getMenuId()}' 
                        //                          AND menu_be_url = '${body.getBackendUrl()}' AND menu_be_method != 'DELETE'`
                        //     let resultVerif = await QueryGet(sqlverifikasi)
                        //     if(resultVerif.status == true){
                        //       if(resultVerif.data.recordset.length > 0){
                        //         if(resultVerif.data.recordset[0].keyId == body.getKeyId()){
                        //           checkVerifikasi = {code: 406, message: 'waiting'}
                        //         }else{
                        //           checkVerifikasi = {code: 406, message: 'waiting name'}
                        //         }
                        //       }else{
                        //         checkVerifikasi = {code: 200} 
                        //       }
                        //     }else{
                        //       checkVerifikasi = {code: 500, message: 'Workflow Service - Verifikasi Workflow => SQL '+ resultVerif.data.number}
                        //     }
                        //   }
                        //   // console.log('checkverif', checkVerifikasi);
                        //   if(checkVerifikasi.code == 406){
                        //     if(checkVerifikasi.message == 'false delete workflow'){
                        //       resolve({status: checkVerifikasi.message, responseCode: 406,  data: checkVerifikasi.dataFalse})
                        //     }else{
                        //       resolve({status: 'waiting', responseCode: 406, data: checkVerifikasi.message})
                        //     }
                        //   }else if(checkVerifikasi.code == 500){
                        //     resolve({responseCode: 500, status: false, data: checkVerifikasi.message})
                        //   }else{
                        //     let stepId
                        //     if(body.getStepId() == null){
                        //       stepId = null
                        //     }else{
                        //       stepId = "'"+body.getStepId()+"'"
                        //     }
                        //     let sql = `INSERT INTO df_trx (module_id, menu_id, menu_be_url, menu_be_method, trx_date, trx_no, trx_sender, trx_status, data, data_new, step_id, wf_id, key_id, key_name, created_user, created_time) 
                        //                 Output Inserted.id
                        //                 VALUES ('${body.getModuleId()}', '${body.getMenuId()}', '${body.getBackendUrl()}', '${body.getMethod()}', 
                        //                         '${body.getReqDate()}', '${body.getReqNo()}', '${body.getReqSender()}', '${body.getStatus()}', 
                        //                         '${body.getDataOld()}', '${body.getDataNew()}', ${stepId}, '${body.getWfId()}', '${body.getKeyId()}', '${body.getKeyName()}', '${body.getUsername()}','${body.getCreatedTime()}')`;
                        //     let result = await QueryTransaction(sql);
                        //     // console.log("res", result);
                        //     if(result.status == true){
                        //       if(result.data.rowsAffected > 0){
                        //         resolve({status: true, responseCode: 200, data: 'Success Input', id: result.data.recordset[0].id});
                        //       }else{
                        //         resolve({status: false, responseCode: 400, data: 'Wrong Configuration'});
                        //       }
                        //     }else{
                        //       resolve({status: false, responseCode: 500, data: 'Workflow Service - Insert Workflow => SQL '+result.data.number});
                        //     }
                        //   }
                        // }else{
                        // }
                        let stepId;
                        if (body.getStepId() == null) {
                            stepId = null;
                        }
                        else {
                            stepId = "'" + body.getStepId() + "'";
                        }
                        let sql = `INSERT INTO df_trx (module_id, menu_id, menu_be_url, menu_be_method, trx_date, trx_no, trx_sender, trx_status, data, data_new, step_id, wf_id, key_id, key_name, created_user, created_time) 
                    Output Inserted.id
                    VALUES ('${body.getModuleId()}', '${body.getMenuId()}', '${body.getBackendUrl()}', '${body.getMethod()}', 
                            '${body.getReqDate()}', '${body.getReqNo()}', '${body.getReqSender()}', '${body.getStatus()}', 
                            '${body.getDataOld()}', '${body.getDataNew()}', ${stepId}, '${body.getWfId()}', '${body.getKeyId()}', '${body.getKeyName()}', '${body.getUsername()}','${body.getCreatedTime()}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Input', id: result.data.recordset[0].id });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - Insert Workflow => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-insertDataRequest ' + error));
                    }
                });
            });
        });
    }
    function sameDataValidationWorkflow(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let result;
                        if (body.method == 'DELETE') {
                            let dataverif = [];
                            let errorSql = false;
                            const verifikasiDelete = `SELECT data as 'dataOld' FROM df_trx WHERE menu_id = '${body.getMenuId()}' AND menu_be_url = '${body.getBackendUrl()}' AND menu_be_method = 'DELETE' AND trx_status = 0`;
                            let resultVerifDelete = yield QueryGet(verifikasiDelete);
                            if (resultVerifDelete.status == true) {
                                if (resultVerifDelete.data.recordset.length > 0) {
                                    yield resultVerifDelete.data.recordset.map((data) => __awaiter(this, void 0, void 0, function* () {
                                        const parseData = JSON.parse(data.dataOld);
                                        yield parseData.map(data2 => {
                                            const keyId = { keyid: data2.id };
                                            dataverif.push(keyId);
                                        });
                                    }));
                                }
                            }
                            else {
                                errorSql = true;
                            }
                            if (errorSql == false) {
                                if (dataverif.length > 0) {
                                    const parseData = JSON.parse(body.getDataOld());
                                    const checkDelete = yield validasiDataMethodDelete({ dataVerif: dataverif, menuData: parseData });
                                    if (checkDelete.code == 200) {
                                        result = { status: true };
                                    }
                                    else {
                                        result = { status: checkDelete.message, responseCode: 406, data: checkDelete.data };
                                    }
                                }
                                else {
                                    result = { status: true };
                                }
                            }
                            else {
                                result = { status: false, responseCode: 500, data: 'Workflow Service - sameDataValidationWorkflow => SQL ' + resultVerifDelete.data.number };
                            }
                        }
                        else {
                            const sqlverify = `SELECT key_id as 'keyId', key_name as 'keyName' FROM df_trx WHERE trx_status = 0 AND (key_id = '${body.keyId}' OR key_name = '${body.keyName}') AND menu_id = '${body.menuId}' 
                               AND menu_be_url = '${body.backendUrl}' AND menu_be_method != 'DELETE'`;
                            let resultVerif = yield QueryGet(sqlverify);
                            if (resultVerif.status == true) {
                                if (resultVerif.data.recordset.length > 0) {
                                    if (resultVerif.data.recordset[0].keyId == body.keyId) {
                                        result = { status: 'waiting', responseCode: 406, data: 'waiting id' };
                                    }
                                    else {
                                        result = { status: 'waiting', responseCode: 406, data: 'waiting name' };
                                    }
                                }
                                else {
                                    result = { status: true };
                                }
                            }
                            else {
                                result = { status: false, responseCode: 500, data: 'Workflow Service - sameDataValidationWorkflow => SQL ' + resultVerif.data.number };
                            }
                        }
                        resolve(result);
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getWfSetting ' + error));
                    }
                });
            });
        });
    }
    function updateDataNew(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE df_trx SET data_new = '${body.dataNew}' WHERE id = '${body.id}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Update' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            if (result.data.number == 2526) {
                                resolve({ status: false, responseCode: 406, data: 'SQL ' + result.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateDataNew ' + error));
                    }
                });
            });
        });
    }
    function updateDataOld(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE df_trx SET data = '${body.dataOld}' WHERE id = '${body.id}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Update' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            if (result.data.number == 2526) {
                                resolve({ status: false, responseCode: 406, data: 'SQL ' + result.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateDataOld ' + error));
                    }
                });
            });
        });
    }
    function insertWorkflowStep(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql;
                        if (body.stepDate == null) {
                            sql = `INSERT INTO df_trx_step (trx_no, wf_id, wf_step, wf_step_note, step_user, step_status, wf_step_desc, wf_step_descglob) 
                  Output Inserted.id 
                  VALUES ('${body.trxNo}', '${body.wfId}', '${body.stepId}', '${body.stepNote}', '${body.stepUser}', '${body.stepStatus}', '${body.stepDesc}', '${body.stepDescGlob}')`;
                        }
                        else {
                            sql = `INSERT INTO df_trx_step (trx_no, wf_id, wf_step, wf_step_note, step_user, step_status, step_date, wf_step_desc, wf_step_descglob) 
                  Output Inserted.id        
                  VALUES ('${body.trxNo}', '${body.wfId}', '${body.stepId}', '${body.stepNote}', '${body.stepUser}', '${body.stepStatus}', '${body.stepDate}', '${body.stepDesc}', '${body.stepDescGlob}')`;
                        }
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Insert', id: result.data.recordset[0].id });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration', id: null });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - Insert Workflow Step => SQL ' + result.data.number, id: null });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-insertWorkflowStep ' + error));
                    }
                });
            });
        });
    }
    function updateWorkflowStep(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE df_trx_step SET step_date = '${body.stepDate}', wf_step_note = '${body.stepNote}', step_user = '${body.stepUser}', step_status = '${body.stepStatus}'
                  WHERE trx_no = '${body.trxNo}' AND wf_step = '${body.stepId}' AND id = '${body.currId}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Update' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - Update Workflow Step => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateWorkflowStep ' + error));
                    }
                });
            });
        });
    }
    function updateWorkflowStatus(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let stepId;
                        if (body.stepId == null) {
                            stepId = null;
                        }
                        else {
                            stepId = "'" + body.stepId + "'";
                        }
                        let sql = `UPDATE df_trx SET trx_status = '${body.stepStatus}', step_id = ${stepId} WHERE id = '${body.id}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Update' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - Update Workflow Status => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateWorkflowStatus ' + error));
                    }
                });
            });
        });
    }
    function updateWorkflowStatusMethodUpload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE df_trx SET trx_status = '1' WHERE menu_be_method = 'UPLOAD' AND menu_be_url = '${body.beUrl}' `;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Update' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - Update Workflow Status => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateWorkflowStatusMethodUpload ' + error));
                    }
                });
            });
        });
    }
    function updateWorkflowCurrentStep(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE df_trx SET curr_step_id = ${body.currStepId} WHERE id = '${body.id}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Update' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'Workflow Service - Update Workflow Current Step => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateWorkflowCurrentStep ' + error));
                    }
                });
            });
        });
    }
    function updateKeyData(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE df_trx SET key_id = '${body.keyId}', key_name = '${body.keyName}' WHERE id = '${body.id}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Success Update' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration' });
                            }
                        }
                        else {
                            if (result.data.number == 2526) {
                                resolve({ status: false, responseCode: 406, data: 'SQL ' + result.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateKeyData ' + error));
                    }
                });
            });
        });
    }
    function validasiDataMethodDelete(dataFlow) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                let hasil = 'true';
                let dataError = [];
                yield dataFlow.menuData.map(data => {
                    const find = dataFlow.dataVerif.find(function validasiId(workflow) {
                        console.log('workflow', workflow);
                        return workflow.keyid === data.id;
                    });
                    if (find != undefined) {
                        console.log('fn', find);
                        hasil = 'false delete workflow';
                        dataError.push(find.keyid);
                    }
                    else {
                        console.log('undefine', find);
                        hasil = 'true';
                    }
                });
                if (dataError.length > 0) {
                    result = { code: 406, message: 'false delete workflow', data: dataError };
                }
                else {
                    result = { code: 200, message: hasil };
                }
                console.log('res2', result);
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    function checkMaker(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT * FROM df_trx WHERE id = '${body.id}' AND trx_sender = '${body.trxSender}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }
                        else {
                            resolve(false);
                        }
                        // if(result.status == true){
                        //   if(result.data.recordset.length > 0){
                        //     resolve({status: true, responseCode: 200, data: true})
                        //   }else{
                        //     resolve({status: true, responseCode: 200, data: false});
                        //   }
                        // }else{
                        //   resolve({status: false, responseCode: 500, data: 'SQL '+result.data.number});
                        // }
                    }
                    catch (error) {
                        reject(new Error('checkMaker ' + error));
                    }
                });
            });
        });
    }
    function checkDataPendingReqUpload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT * FROM df_trx WHERE menu_id = '${body.menuId}' AND trx_status = 0`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: true });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: false });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-checkDataPendingReqUpload ' + error));
                    }
                });
            });
        });
    }
    function deleteDataRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `DELETE FROM df_trx where id = ${body.id}`;
                        let result = yield QueryTransaction(sql);
                        let sqlStep = `DELETE FROM df_trx_step where trx_no = '${body.trxNo}'`;
                        let resultDeleteStep = yield QueryTransaction(sqlStep);
                        if (result.status == true) {
                            if (resultDeleteStep.status == true) {
                                resolve({ status: true, responseCode: 200, data: 'Success Delete' });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number, id: null });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number, id: null });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-insertWorkflowStep ' + error));
                    }
                });
            });
        });
    }
    function createDataWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sql = `INSERT INTO df_setting (module_id, menu_id, backend_url, method, wf_id, callback_url, condition_string, created_user, created_time) 
                    VALUES ( '${body.getModuleId()}', '${body.getMenuId()}', '${body.getBackendUrl()}','${body.getMethod()}', 
                    '${body.getWfId()}','${body.getCallbackUrl()}', '${body.getConditionString()}','${body.getUsernameToken()}', '${body.getCreatedTime()}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Workflow Setting Berhasil Ditambahkan', dataGlob: 'Workflow Setting Inserted Successfully' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration', dataGlob: 'Wrong Configuration' });
                            }
                        }
                        else {
                            if (result.data.number == 2526) {
                                resolve({ status: false, responseCode: 406, data: 'SQL ' + result.data.number, dataGlob: 'SQL ' + result.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number, dataGlob: 'SQL ' + result.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-createDataWorkflowSetting ' + error));
                    }
                });
            });
        });
    }
    function updateDataWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sql = `UPDATE df_setting SET 
                      module_id = '${body.getModuleId()}',
                      menu_id = '${body.getMenuId()}',
                      backend_url = '${body.getBackendUrl()}', 
                      method = '${body.getMethod()}', 
                      wf_id = '${body.getWfId()}', 
                      callback_url = '${body.getCallbackUrl()}',
                      condition_string = '${body.getConditionString()}',
                      updated_user = '${body.getUsernameToken()}',
                      updated_time = '${body.getUpdatedTime()}'  
                      where id = '${body.getId()}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Workflow Setting Berhasil Diubah', dataGlob: 'Workflow Setting Updated Successfully' });
                            }
                            else {
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration', dataGlob: 'Wrong Configuration' });
                            }
                        }
                        else {
                            if (result.data.number == 2526) {
                                resolve({ status: false, responseCode: 406, data: 'SQL ' + result.data.number, dataGlob: 'SQL ' + result.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number, dataGlob: 'SQL ' + result.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-updateDataWorkflowSetting ' + error));
                    }
                });
            });
        });
    }
    function deleteDataWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('body', body);
                        const id = body.id.toString().replace(/,/gi, "','");
                        const sql = `DELETE FROM df_setting WHERE id in ('${id}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ status: true, responseCode: 200, data: 'Workflow Setting Berhasil Dihapus', dataGlob: 'Workflow Setting Deleted Successfully' });
                            }
                            else {
                                //usually id not found
                                resolve({ status: false, responseCode: 400, data: 'Wrong Configuration', dataGlob: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number, dataGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-deleteDataWorkflowSetting' + error));
                    }
                });
            });
        });
    }
    function getDataWorkflowSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let limit = '';
                        let pagination = '';
                        let where = 'WHERE 1=1';
                        let orderby;
                        if (body.filter) {
                            where += " and " + body.filter;
                        }
                        if (body.perpage) {
                            limit += body.perpage;
                        }
                        else {
                            limit += 1000;
                        }
                        if (body.page) {
                            let offset = parseInt(body.page);
                            let page = offset - 1;
                            pagination = page * limit;
                        }
                        else {
                            pagination = 0;
                        }
                        let orderBy = body.orderby;
                        if (orderBy == 'moduleId') {
                            orderby = 'ORDER BY module_id ';
                        }
                        else if (orderBy == 'menuId') {
                            orderby = 'ORDER BY menu_id ';
                        }
                        else if (orderBy == 'backendUrl') {
                            orderby = 'ORDER BY backend_url ';
                        }
                        else if (orderBy == 'method') {
                            orderby = 'ORDER BY method ';
                        }
                        else if (orderBy == 'wfId') {
                            orderby = 'ORDER BY wf_id ';
                        }
                        else if (orderBy == 'callbackUrl') {
                            orderby = 'ORDER BY callback_url ';
                        }
                        else if (orderBy == 'conditionString') {
                            orderby = 'ORDER BY condition_string ';
                        }
                        else if (orderBy == 'createdUser') {
                            orderby = 'ORDER BY created_user ';
                        }
                        else if (orderBy == 'updatedUser') {
                            orderby = 'ORDER BY updated_user ';
                        }
                        else if (orderBy == 'createdTime') {
                            orderby = 'ORDER BY created_time ';
                        }
                        else if (orderBy == 'updatedTime') {
                            orderby = 'ORDER BY updated_time ';
                        }
                        else {
                            orderby = 'ORDER BY id ';
                        }
                        if (body.ordertype == 'asc' || body.ordertype == 'desc') {
                            orderby += body.ordertype;
                        }
                        else {
                            orderby += 'asc';
                        }
                        let sql = `SELECT * FROM df_setting ${where} ${orderby} OFFSET ${parseInt(pagination)} ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY`;
                        let count = `SELECT COUNT(id) as 'count' FROM df_setting ${where}`;
                        let infoFilter = `SELECT field_order as 'fieldOrder', field_name as 'fieldName', field_desc as 'fieldDesc', field_type as 'fieldType' 
                          FROM M_Menu_Filter WHERE menu_id = ''`;
                        let result = yield QueryGet(sql);
                        let resultCount = yield QueryGet(count);
                        let resultFilter = yield QueryGet(infoFilter);
                        if (result.status == true && resultCount.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset, countAll: resultCount.data.recordset[0].count, filter: resultFilter.data.recordset });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: [], countAll: resultCount.data.recordset[0].count, filter: resultFilter.data.recordset });
                            }
                        }
                        else {
                            if (result.status == false) {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + resultCount.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataWorkflowSetting ' + error));
                    }
                });
            });
        });
    }
    function getDataWorkflowSettingDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT * FROM df_setting where id = ${body.id}`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset[0] });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: {} });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('workflowDb-getDataWorkflowSettingDetail ' + error));
                    }
                });
            });
        });
    }
}
exports.default = makeWorkflowDb;
