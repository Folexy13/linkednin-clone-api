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
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Import db & configs
const configSetup_1 = __importDefault(require("../config/configSetup"));
const db_1 = __importDefault(require("./db"));
// Import function files
const utility_1 = require("../helpers/utility");
const types_1 = require("../helpers/types");
const auth_1 = require("../helpers/auth");
// register or create admin
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { names, phone, email, password, role } = req.body;
    //Hash password
    const salt = yield bcryptjs_1.default.genSalt(15);
    const hashPassword = yield bcryptjs_1.default.hash(password, salt);
    let insertData = { names, phone, email, role, password: hashPassword };
    try {
        const adminExists = yield db_1.default.admins.findOne({ where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        // if admin exists, stop the process and return a message
        if (adminExists)
            return (0, utility_1.errorResponse)(res, `admin with email ${email} already exists`);
        const admin = yield db_1.default.admins.create(insertData);
        if (admin)
            return (0, utility_1.successResponse)(res, `Registration successfull`);
        return (0, utility_1.errorResponse)(res, `An error occured`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// admin login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { email, password } = req.body;
    try {
        const admin = yield db_1.default.admins.findOne({
            where: { email },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        if (admin) {
            const validPass = yield bcryptjs_1.default.compareSync(password, admin.password);
            if (!validPass)
                return (0, utility_1.errorResponse)(res, 'Email or Password is incorrect!');
            if (admin.status === 'suspended')
                return (0, utility_1.errorResponse)(res, 'Account Suspended!, Please contact control admin!');
            // Create and assign token
            let payload = {
                id: admin.id,
                email,
                names: admin.names,
                phone: admin.phone,
                role: admin.role,
                status: admin.status,
                type: 'admin',
            };
            const token = jsonwebtoken_1.default.sign(payload, configSetup_1.default.JWTSECRET);
            const data = { type: 'token', token, admin: payload };
            return (0, utility_1.successResponse)(res, 'Login successfull', data);
        }
        else {
            return (0, utility_1.handleResponse)(res, 401, false, `Incorrect Email`);
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// admin update password
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { email, oldPassword, newPassword } = req.body;
    try {
        const admin = yield db_1.default.admins.findOne({ where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!admin)
            return (0, utility_1.errorResponse)(res, `admin not found!`);
        const validPassword = yield bcryptjs_1.default.compareSync(oldPassword, admin.password);
        if (!validPassword)
            return (0, utility_1.errorResponse)(res, `Incorrect old password!`);
        const salt = yield bcryptjs_1.default.genSalt(15);
        const hashPassword = yield bcryptjs_1.default.hash(newPassword, salt);
        const updatedPassword = yield admin.update({ password: hashPassword, status: 'active' });
        if (!updatedPassword)
            return (0, utility_1.errorResponse)(res, `Unable update password!`);
        return (0, utility_1.successResponse)(res, `Password updated successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// admin reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { email } = req.body;
    try {
        const admin = yield db_1.default.admins.findOne({
            where: { email },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        if (admin) {
            const sendOtpResponse = yield (0, auth_1.sendOtp)({ email, type: types_1.typeEnum.RESET });
            if (!sendOtpResponse.status)
                return (0, utility_1.errorResponse)(res, sendOtpResponse.message);
            return (0, utility_1.successResponse)(res, sendOtpResponse.message, sendOtpResponse.data);
        }
        else {
            return (0, utility_1.handleResponse)(res, 401, false, `Incorrect Email`);
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// admin change password after reset
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { token, password } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, configSetup_1.default.JWTSECRET);
        if (!decoded)
            return (0, utility_1.errorResponse)(res, `Invalid verification`);
        const admin = yield db_1.default.admins.findOne({ where: { email: decoded.email, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!admin)
            return (0, utility_1.errorResponse)(res, `Account Suspended!, Please contact support!`);
        const salt = yield bcryptjs_1.default.genSalt(15);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        const updatedPassword = yield admin.update({ password: hashPassword });
        if (!updatedPassword)
            return (0, utility_1.errorResponse)(res, `Unable update password!`);
        return (0, utility_1.successResponse)(res, `Password changed successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
exports.default = {
    register,
    login,
    updatePassword,
    resetPassword,
    changePassword,
};
