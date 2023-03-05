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
exports.activateAccount = exports.login = exports.sendOtp = void 0;
// Import packages
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Import DB and configs
const db_1 = __importDefault(require("../controllers/db"));
const configSetup_1 = __importDefault(require("../config/configSetup"));
const utility_1 = require("./utility");
const templateData_1 = require("./mailer/templateData");
const mailer_1 = require("./mailer/mailer");
const template_1 = require("./mailer/template");
const sendOtp = ({ email, type, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Generate OTP
        const otp = (0, utility_1.generateOtp)(), now = new Date(), expirationTime = (0, utility_1.addMinutesToDate)(now, 10);
        const otpInstance = yield db_1.default.otp.create({ otp, expirationTime });
        // Create details object containing the email and otp id
        const otpDetails = {
            timestamp: now,
            email,
            password,
            success: true,
            message: 'OTP sent to agent',
            otpId: otpInstance.id,
        };
        // Encrypt the details object
        const encoded = jsonwebtoken_1.default.sign(JSON.stringify(otpDetails), configSetup_1.default.JWTSECRET);
        const { mailSubject, mailBody } = (0, templateData_1.getOtpTemplateData)({ otp, type });
        // prepare and send mail
        const sendEmail = yield (0, mailer_1.prepareMail)({
            mailRecipients: email,
            mailSubject,
            mailBody: (0, template_1.otpMailTemplate)({ subject: mailSubject, body: mailBody }),
        });
        console.log(sendEmail);
        if (sendEmail.status)
            return (0, utility_1.fnResponse)({ status: true, message: 'OTP Sent', data: encoded });
        return (0, utility_1.fnResponse)({ status: false, message: 'OTP not sent' });
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.fnResponse)({ status: false, message: `An error occured:- ${error}` });
    }
});
exports.sendOtp = sendOtp;
const login = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield db_1.default.agents.findOne({ where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (agent) {
            const validPass = yield bcryptjs_1.default.compareSync(password, agent.password);
            if (!validPass)
                return (0, utility_1.fnResponse)({ status: false, message: 'Email or Password is incorrect!' });
            if (agent.status === 'inactive')
                return (0, utility_1.fnResponse)({ status: false, message: 'Account Suspended!, Please contact support!' });
            // Create and assign token
            let payload = {
                id: agent.id,
                email,
                names: agent.names,
                phone: agent.phone,
                status: agent.status,
                type: 'agent',
            };
            const token = jsonwebtoken_1.default.sign(payload, configSetup_1.default.JWTSECRET);
            const data = { type: 'token', token, agent: payload };
            return (0, utility_1.fnResponse)({ status: true, message: 'Login successfull', data });
        }
        else {
            return (0, utility_1.fnResponse)({ status: false, message: 'Incorrect Email' });
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.fnResponse)({ status: false, message: `An error occured - ${error}` });
    }
});
exports.login = login;
const activateAccount = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield db_1.default.agents.findOne({ where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        agent.update({ status: 'active' });
        return (0, utility_1.fnResponse)({ status: true, message: 'User Activated' });
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.fnResponse)({ status: false, message: `An error occured - ${error}` });
    }
});
exports.activateAccount = activateAccount;
