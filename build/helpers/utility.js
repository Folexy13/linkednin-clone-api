"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = exports.randId = exports.otpValidity = exports.addMinutesToDate = exports.generateOtp = exports.fnResponse = exports.errorResponse = exports.successResponse = exports.handleResponse = void 0;
const handleResponse = (res, statusCode, status, message, data) => {
    return res.status(statusCode).json({
        status,
        message,
        data,
    });
};
exports.handleResponse = handleResponse;
const successResponse = (res, message = 'Operation successfull', data) => {
    return res.status(200).json({
        status: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, message = 'An error occured', data) => {
    return res.status(400).json({
        status: false,
        message,
        data,
    });
};
exports.errorResponse = errorResponse;
const fnResponse = ({ status, message, data }) => {
    return { status, message, data };
};
exports.fnResponse = fnResponse;
const generateOtp = () => {
    return Math.floor(Math.random() * 999999 + 1);
};
exports.generateOtp = generateOtp;
const addMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
};
exports.addMinutesToDate = addMinutesToDate;
const otpValidity = (a, b) => {
    if (a.getTime() > b.getTime())
        return true;
    return false;
};
exports.otpValidity = otpValidity;
const randId = () => {
    return Math.floor(Math.random() * 10000000 + 1).toString(16);
};
exports.randId = randId;
exports.formatCurrency = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
});
