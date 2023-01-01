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
function makeSendNotif({ userDb, makeNotification }) {
    return function sendNotif(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('usecase', body);
                const getMessage = yield getDataMessage({ actionId: body.actionId, menu: body.menuId, beUrl: body.beUrl, totalData: body.totalData });
                const entityNotif = yield makeNotification(Object.assign(Object.assign({ moduleId: body.moduleId, username: body.username }, getMessage), { status: 0 }));
                const sendNotification = yield userDb.inputDataNotification(entityNotif);
                console.log('sendNotif', sendNotification);
                if (body.actionId == '004') {
                    const getListRole = yield userDb.getListRoleNotifWorkflow();
                    if (getListRole.length > 0) {
                        let messageNotifApprover;
                        if (body.menu == '003') {
                            //user role
                            messageNotifApprover = yield makeNotification({
                                title: 'Permintaan Persetujuan Kewenangan Pengguna',
                                titleGlob: 'User Role Approval Request',
                                message: body.totalData + ' Pengguna',
                                messageGlob: body.totalData + ' User'
                            });
                        }
                        else if (body.menu == '004') {
                            //user branch
                            messageNotifApprover = yield makeNotification({
                                title: 'Permintaan Persetujuan Kantor Cabang Pengguna',
                                titleGlob: 'User Branch Approval Request Has Been revised',
                                message: body.totalData + ' Pengguna',
                                messageGlob: body.totalData + ' User'
                            });
                        }
                        else if (body.menu == '005') {
                            //role
                            messageNotifApprover = yield makeNotification({
                                title: 'Permintaan Persetujuan Role',
                                titleGlob: 'Role Approval Request',
                                message: body.totalData + ' Role',
                                messageGlob: body.totalData + ' Role'
                            });
                        }
                        else {
                            if (body.menu == '006' && body.beUrl == '/credential/branch/upload') {
                                //branch upload
                                messageNotifApprover = yield makeNotification({
                                    title: 'Permintaan Persetujuan Unggah Cabang',
                                    titleGlob: 'Branch Upload Approval Request',
                                    message: '1 Data Unggah Cabang',
                                    messageGlob: '1 Data Branch Upload',
                                });
                            }
                            else {
                                //branch
                                messageNotifApprover = yield makeNotification({
                                    title: 'Permintaan Persetujuan Cabang',
                                    titleGlob: 'Branch Approval Request',
                                    message: body.totalData + ' Cabang',
                                    messageGlob: body.totalData + ' Cabang'
                                });
                            }
                            const entityNotifApprover = yield makeNotification(Object.assign({ moduleId: body.moduleId, username: body.username, status: 0 }, messageNotifApprover));
                            const sendNotification = yield userDb.inputDataNotification(entityNotifApprover);
                            console.log('sendNotif', sendNotification);
                        }
                    }
                }
                return sendNotification;
            }
            catch (error) {
                throw new Error('usecase-checkWorkflowSetting ' + error);
            }
        });
    };
    function getDataMessage(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('body', body);
                const listNotifAgree = {
                    userRole: {
                        title: 'Permintaan Kewenangan Pengguna Telah Disetujui',
                        titleGlob: 'User Role Approval Request has been Approved',
                        message: body.totalData + ' Pengguna',
                        messageGlob: body.totalData + ' User'
                    },
                    userBranch: {
                        title: 'Permintaan Kantor Cabang Pengguna Telah Disetujui',
                        titleGlob: 'User Branch Approval Request Has Been Approved',
                        message: body.totalData + ' Pengguna',
                        messageGlob: body.totalData + ' User'
                    },
                    branch: {
                        title: 'Permintaan Persetujuan Cabang Telah Disetujui',
                        titleGlob: 'Branch Approval Request Has Been Approved',
                        message: body.totalData + ' Cabang',
                        messageGlob: body.totalData + ' Branch'
                    },
                    branchUpload: {
                        title: 'Permintaan Unggah Cabang Telah Disetujui',
                        titleGlob: 'Branch Upload Request Has Been Approved',
                        message: body.totalData + ' Berkas',
                        messageGlob: body.totalData + ' File'
                    },
                    role: {
                        title: 'Permintaan Persetujuan Role Telah Disetujui',
                        titleGlob: 'Role Approval Request Has Been Approved',
                        message: body.totalData + ' role',
                        messageGlob: body.totalData + ' Role'
                    }
                };
                const listNotifReject = {
                    userRole: {
                        title: 'Permintaan Persetujuan Kewenangan Pengguna Telah Ditolak',
                        titleGlob: 'User Role Approval Request has been Rejected',
                        message: body.totalData + ' Pengguna',
                        messageGlob: body.totalData + ' User'
                    },
                    userBranch: {
                        title: 'Permintaan Persetujuan Kantor Cabang Pengguna Telah Ditolak',
                        titleGlob: 'User Branch Approval Request Has Been Rejected',
                        message: body.totalData + ' Pengguna',
                        messageGlob: body.totalData + ' User'
                    },
                    branch: {
                        title: 'Permintaan Persetujuan Cabang Telah Ditolak',
                        titleGlob: 'Branch Approval Request Has Been Rejected',
                        message: body.totalData + ' Cabang',
                        messageGlob: body.totalData + ' Branch'
                    },
                    branchUpload: {
                        title: 'Permintaan Unggah Cabang Telah Ditolak',
                        titleGlob: 'Branch Upload Request Has Been Rejected',
                        message: body.totalData + ' Berkas',
                        messageGlob: body.totalData + ' File'
                    },
                    role: {
                        title: 'Permintaan Persetujuan Role Telah Ditolak',
                        titleGlob: 'Role Approval Request Has Been Rejected',
                        message: body.totalData + ' role',
                        messageGlob: body.totalData + ' Role'
                    }
                };
                const listNotifRevision = {
                    userRole: {
                        title: 'Permintaan Persetujuan Kewenangan Pengguna Direvisi',
                        titleGlob: 'User Role Approval Request for Revision',
                        message: body.totalData + ' Pengguna',
                        messageGlob: body.totalData + ' User'
                    },
                    userBranch: {
                        title: 'Permintaan Persetujuan Kantor Cabang Pengguna Direvisi',
                        titleGlob: 'User Branch Approval Request for Revision',
                        message: body.totalData + ' Pengguna',
                        messageGlob: body.totalData + ' User'
                    },
                    branch: {
                        title: 'Permintaan Persetujuan Cabang Direvisi',
                        titleGlob: 'Branch Approval Request for Revision',
                        message: body.totalData + ' Cabang',
                        messageGlob: body.totalData + ' Branch'
                    },
                    branchUpload: {
                        title: 'Permintaan Unggah Cabang Direvisi',
                        titleGlob: 'Branch Upload Request for Revision',
                        message: body.totalData + ' Berkas',
                        messageGlob: body.totalData + ' File'
                    },
                    role: {
                        title: 'Permintaan Persetujuan Role Direvisi',
                        titleGlob: 'Role Approval Request for Revision',
                        message: body.totalData + ' role',
                        messageGlob: body.totalData + ' Role'
                    }
                };
                let result;
                if (body.actionId == '001' || body.actionId == '003') {
                    console.log('setujui');
                    if (body.menu == '003') {
                        result = listNotifAgree.userRole;
                    }
                    else if (body.menu == '004') {
                        result = listNotifAgree.userBranch;
                    }
                    else if (body.menu == '005') {
                        result = listNotifAgree.role;
                    }
                    else {
                        if (body.menu == '006' && body.beUrl == '/credential/branch/upload') {
                            result = listNotifAgree.branchUpload;
                        }
                        else {
                            result = listNotifAgree.branch;
                        }
                    }
                    if (body.actionId == '001') {
                        result.title = result.title + ' Checker 1 dan Sedang Menunggu persetujuan Checker 2';
                        result.titleGlob = result.titleGlob + ' Checker 1 and Awaiting Checker 2 Approval';
                    }
                    else {
                        result.title = result.title + ' Checker 2 dan Sedang Menunggu persetujuan Approver';
                        result.titleGlob = result.titleGlob + ' Checker 2 and Awaiting Approver';
                    }
                }
                else if (body.actionId == '002' || body.actionId == '004' || body.actionId == '007') {
                    console.log('reject');
                    if (body.menu == '003') {
                        result = listNotifReject.userRole;
                    }
                    else if (body.menu == '004') {
                        result = listNotifReject.userBranch;
                    }
                    else if (body.menu == '005') {
                        result = listNotifReject.role;
                    }
                    else {
                        if (body.menu == '006' && body.beUrl == '/credential/branch/upload') {
                            result = listNotifReject.branchUpload;
                        }
                        else {
                            result = listNotifReject.branch;
                        }
                    }
                    if (body.actionId == '002') {
                        result.title = result.title + ' Oleh Checker 1';
                        result.titleGlob = result.titleGlob + ' By Checker 1';
                    }
                    else if (body.actionId == '004') {
                        result.title = result.title + ' Oleh Checker 2';
                        result.titleGlob = result.titleGlob + ' By Checker';
                    }
                    else {
                        result.title = result.title + ' Oleh Approver';
                        result.titleGlob = result.titleGlob + ' By Approver';
                    }
                }
                else {
                    console.log('revisi');
                    if (body.menu == '003') {
                        result = listNotifRevision.userRole;
                    }
                    else if (body.menu == '004') {
                        result = listNotifRevision.userBranch;
                    }
                    else if (body.menu == '005') {
                        result = listNotifRevision.role;
                    }
                    else {
                        if (body.menu == '006' && body.beUrl == '/credential/branch/upload') {
                            result = listNotifRevision.branchUpload;
                        }
                        else {
                            result = listNotifRevision.branch;
                        }
                    }
                    if (body.actionId == '008') {
                        result.title = result.title + ' Telah Selesai dan Sedang Menunggu Persetujuan Checker 1';
                        result.titleGlob = result.titleGlob + ' has been Completed and Awaiting Approval Checker 1';
                    }
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getDataMessage ' + error);
            }
        });
    }
}
exports.default = makeSendNotif;
