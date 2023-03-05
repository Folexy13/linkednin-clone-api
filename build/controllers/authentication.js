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
exports.updateUserSettings = exports.verifyOtp = exports.changePassword = exports.resetPassword = exports.updatePassword = exports.preLogin = exports.register = void 0;
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
const middlewares_1 = require("../helpers/middlewares");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { names, phone, email, password, businessId, branchId } = req.body;
    const business = yield (0, middlewares_1.checkBusiness)(businessId);
    if (!business.status)
        return (0, utility_1.errorResponse)(res, 'Business Not found');
    const branch = yield (0, middlewares_1.checkBranch)(branchId);
    if (!branch.status)
        return (0, utility_1.errorResponse)(res, 'Branch Not found');
    //Hash password
    const salt = yield bcryptjs_1.default.genSalt(15);
    const hashPassword = yield bcryptjs_1.default.hash(password, salt);
    let insertData = { names, phone, email, password: hashPassword };
    try {
        const agentExists = yield db_1.default.agents.findOne({ where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        // if agent exists, stop the process and return a message
        if (agentExists)
            return (0, utility_1.handleResponse)(res, 400, false, `agent with email ${email} already exists`);
        const agent = yield db_1.default.agents.create(insertData);
        if (agent) {
            yield db_1.default.agentSettings.create({ agentId: agent.id });
            // let payload: AuthPayloadDataType = {
            // 	id: agent.id,
            // 	names,
            // 	phone,
            // 	email,
            // };
            // const token: string = jwt.sign(payload, config.JWTSECRET);
            // const data: TokenDataType = { type: 'token', token, agent: payload };
            // await sendOtp({ email, type: typeEnum.VERIFICATION });
            return (0, utility_1.handleResponse)(res, 200, true, `Registration successfull`);
        }
        else {
            return (0, utility_1.handleResponse)(res, 401, false, `An error occured`);
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
exports.register = register;
const preLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { email, password } = req.body;
    try {
        const agent = yield db_1.default.agents.findOne({
            where: { email },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: { model: db_1.default.agentSettings, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        });
        if (agent) {
            if (agent.agentSetting.twoFa) {
                const sendOtpResponse = yield (0, auth_1.sendOtp)({ email, password, type: types_1.typeEnum.TWOFA });
                if (!sendOtpResponse.status)
                    return (0, utility_1.errorResponse)(res, sendOtpResponse.message);
                const data = { type: '2fa', token: sendOtpResponse.data };
                return (0, utility_1.successResponse)(res, sendOtpResponse.message, data);
            }
            else {
                const loginResponse = yield (0, auth_1.login)({ email, password });
                if (!loginResponse.status)
                    return (0, utility_1.errorResponse)(res, loginResponse.message);
                return (0, utility_1.successResponse)(res, loginResponse.message, loginResponse.data);
            }
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
exports.preLogin = preLogin;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { email, oldPassword, newPassword } = req.body;
    try {
        const agent = yield db_1.default.agents.findOne({ where: { email, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!agent)
            return (0, utility_1.errorResponse)(res, `agent not found!`);
        const validPassword = yield bcryptjs_1.default.compareSync(oldPassword, agent.password);
        if (!validPassword)
            return (0, utility_1.errorResponse)(res, `Incorrect  old password!`);
        const salt = yield bcryptjs_1.default.genSalt(15);
        const hashPassword = yield bcryptjs_1.default.hash(newPassword, salt);
        const updatedPassword = yield agent.update({ password: hashPassword });
        if (!updatedPassword)
            return (0, utility_1.errorResponse)(res, `Unable update password!`);
        return (0, utility_1.successResponse)(res, `Password updated successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
exports.updatePassword = updatePassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { email } = req.body;
    try {
        const agent = yield db_1.default.agents.findOne({
            where: { email },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        if (agent) {
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
exports.resetPassword = resetPassword;
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
        const agent = yield db_1.default.agents.findOne({ where: { email: decoded.email, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!agent)
            return (0, utility_1.errorResponse)(res, `Account Suspended!, Please contact support!`);
        const salt = yield bcryptjs_1.default.genSalt(15);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        const updatedPassword = yield agent.update({ password: hashPassword });
        if (!updatedPassword)
            return (0, utility_1.errorResponse)(res, `Unable update password!`);
        return (0, utility_1.successResponse)(res, `Password changed successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
exports.changePassword = changePassword;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    try {
        var currentdate = new Date();
        const { token, otp, email, type } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, configSetup_1.default.JWTSECRET);
        if (!decoded)
            return (0, utility_1.errorResponse)(res, `Invalid verification`);
        if (decoded.email != email)
            return (0, utility_1.errorResponse)(res, `OTP was not sent to this particular email`);
        const otpInstance = yield db_1.default.otp.findOne({ where: { id: decoded.otpId } });
        if (!otpInstance)
            return (0, utility_1.errorResponse)(res, `OTP does not exists`);
        if (otpInstance.verified)
            return (0, utility_1.errorResponse)(res, `OTP Already Used`);
        if (!(0, utility_1.otpValidity)(otpInstance.expirationTime, currentdate))
            return (0, utility_1.errorResponse)(res, 'OTP Expired');
        if (otp != otpInstance.otp)
            return (0, utility_1.errorResponse)(res, 'OTP NOT Matched');
        const updateData = { verified: true, verifiedAt: currentdate };
        yield otpInstance.update(updateData);
        if (type === types_1.typeEnum.TWOFA) {
            const loginResponse = yield (0, auth_1.login)({ email, password: decoded.password });
            if (!loginResponse.status)
                return (0, utility_1.errorResponse)(res, loginResponse.message);
            return (0, utility_1.successResponse)(res, 'Login Successful', loginResponse.data);
        }
        else if (type === types_1.typeEnum.RESET) {
            if (decoded.password)
                return (0, utility_1.errorResponse)(res, 'Suspicious attempt discovered! Pls reset password again');
            return (0, utility_1.successResponse)(res, 'OTP Matched', token);
        }
        else {
            const accountActivated = yield (0, auth_1.activateAccount)(email);
            if (!accountActivated.status)
                return (0, utility_1.errorResponse)(res, accountActivated.message);
            return (0, utility_1.successResponse)(res, 'Email verified', email);
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
exports.verifyOtp = verifyOtp;
const updateUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { twoFa } = req.body;
    const { id } = req.agent;
    try {
        const agent = yield db_1.default.agents.findOne({ where: { id } });
        const updatedSettings = yield agent.update({ twoFa });
        if (!updatedSettings)
            return (0, utility_1.errorResponse)(res, `Unable update settings!`);
        return (0, utility_1.successResponse)(res, `Settings updated successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
exports.updateUserSettings = updateUserSettings;
