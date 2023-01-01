"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.ErrorHandler = void 0;
// import slack from './slack';
class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.ErrorHandler = ErrorHandler;
const handleError = (err, res) => {
    const { statusCode, message } = err;
    // slack.alert({
    //     text: message
    // });
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};
exports.handleError = handleError;
