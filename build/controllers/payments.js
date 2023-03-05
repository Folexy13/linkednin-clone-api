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
// Import db
const db_1 = __importDefault(require("./db"));
// Import function files
const utility_1 = require("../helpers/utility");
const types_1 = require("../helpers/types");
const middlewares_1 = require("../helpers/middlewares");
const mailer_1 = require("../helpers/mailer/mailer");
const templateData_1 = require("../helpers/mailer/templateData");
const template_1 = require("../helpers/mailer/template");
// log payment
const logPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { payeeName, payeePhone, payeeEmail, amount, businessId, branchId, revenueHeadId } = req.body;
    const business = yield (0, middlewares_1.checkBusiness)(businessId);
    if (!business.status)
        return (0, utility_1.errorResponse)(res, 'Business Not found');
    const branch = yield (0, middlewares_1.checkBranch)(branchId);
    if (!branch.status)
        return (0, utility_1.errorResponse)(res, 'Branch Not found');
    const revenueHead = yield (0, middlewares_1.checkRevenueHead)(revenueHeadId);
    if (!revenueHead.status)
        return (0, utility_1.errorResponse)(res, 'Revenue Head Not found');
    const insertData = {
        payeeName,
        payeePhone,
        payeeEmail,
        transRef: (0, utility_1.randId)(),
        amount: revenueHead.data.amount ? revenueHead.data.amount : amount,
        businessId,
        branchId,
        revenueHeadId,
        agentId: req.agent.id,
    };
    try {
        const logPayment = yield db_1.default.paymentReports.create(insertData);
        if (logPayment) {
            const postData = {
                ReferenceNumber: insertData.transRef,
                ServiceNumber: insertData.payeePhone,
                Description: '',
                Amount: insertData.amount,
                FirstName: insertData.payeeName.split(' ')[0],
                LastName: insertData.payeeName.split(' ')[1],
                Email: insertData.payeeEmail,
                ItemCode: 1,
            };
            // await postPayment(postData);
            const { mailSubject, mailBody } = (0, templateData_1.paymentNotifTemplateData)({
                party: types_1.payEnum.PAYEE,
                paymentData: {
                    phone: payeePhone,
                    amount: insertData.amount,
                    date: logPayment.createdAt,
                    business: { name: business.data.name, branch: branch.data.name, revenue: revenueHead.data.name },
                },
            });
            // prepare and send mail
            const sendEmail = yield (0, mailer_1.prepareMail)({
                mailRecipients: payeeEmail,
                mailSubject,
                mailBody: (0, template_1.paymentNotifTemplate)({ subject: mailSubject, body: mailBody }),
            });
            // sending email to business email
            const { _mailSubject, _mailBody } = (0, templateData_1.paymentNotifTemplateData)({
                party: types_1.payEnum.PAYER,
                paymentData: {
                    phone: payeePhone,
                    amount: insertData.amount,
                    date: logPayment.createdAt,
                    business: { name: business.data.name, branch: branch.data.name, revenue: revenueHead.data.name },
                },
            });
            // prepare and send mail for business
            const _sendEmail = yield (0, mailer_1.prepareMail)({
                mailRecipients: business.data.email,
                mailSubject,
                mailBody: (0, template_1.paymentNotifTemplate)({ subject: _mailSubject, body: _mailBody }),
            });
            console.log(sendEmail);
            return (0, utility_1.successResponse)(res, `Payment successfully logged`);
        }
        return (0, utility_1.errorResponse)(res, `An error occured`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// get all branches
const getPaymentLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = {};
        if (req.agent) {
            where.businessId = req.agent.businessId;
        }
        const paymentLogs = yield db_1.default.paymentReports.findAll({
            where,
            include: [
                { model: db_1.default.businesses, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: db_1.default.branches, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: db_1.default.revenueHeads, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: db_1.default.agents, as: 'agent', attributes: { exclude: ['createdAt', 'updatedAt', 'password'] } },
            ],
            order: [['id', 'DESC']],
        });
        if (!paymentLogs.length)
            return (0, utility_1.successResponse)(res, `No payment report available!`, []);
        return (0, utility_1.successResponse)(res, `${paymentLogs.length} Payment report${paymentLogs.length > 1 ? 's' : ''} retrived!`, paymentLogs.map((log) => {
            const { id, createdAt, payeeName, transRef, branch, revenueHead, amount, respDescription, agent } = log;
            return {
                id,
                payeeName,
                transRef,
                description: respDescription,
                agencyName: branch.name,
                revenueHead: revenueHead.name,
                agent: agent.name,
                amount,
                status: 'pending',
                createdAt,
            };
        }));
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// get branch details
const getPaymentLogDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { transRef } = req.params;
    try {
        const paymentLog = yield db_1.default.paymentReports.findOne({
            where: { transRef },
            include: [
                { model: db_1.default.businesses, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: db_1.default.branches, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: db_1.default.revenueHeads, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: db_1.default.agents, as: 'agent', attributes: { exclude: ['createdAt', 'updatedAt', 'password'] } },
            ],
        });
        if (!paymentLog)
            return (0, utility_1.errorResponse)(res, `Payment log with transRef ${transRef} not found!`);
        return (0, utility_1.successResponse)(res, `Address details retrived!`, paymentLog);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
const paymentWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { transRef, respCode, respDescription, transDate, transPaylog, terminal, terminalId, channelName, instituitionId, intistitutionName, branchName, bankName, bankCode, receiptNumber, collectionAccount, customerPhone, depositNumber, itemName, itemCode, isReversal, } = req.body;
    try {
        const paymentLog = yield db_1.default.paymentReports.findOne({
            where: { transRef },
            include: [{ model: db_1.default.businesses }, { model: db_1.default.branch }, { model: db_1.default.revenueHeads }, { model: db_1.default.agents, as: 'agent' }],
        });
        if (!paymentLog)
            return (0, utility_1.errorResponse)(res, `Payment log with transRef ${transRef} not found!`);
        if (paymentLog.respCode)
            return (0, utility_1.errorResponse)(res, `Payment log with transRef ${transRef} already updated!`);
        const updateData = {
            respCode,
            respDescription,
            transDate,
            transPaylog,
            terminal,
            terminalId,
            channelName,
            instituitionId,
            intistitutionName,
            branchName,
            bankName,
            bankCode,
            receiptNumber,
            collectionAccount,
            customerPhone,
            depositNumber,
            itemName,
            itemCode,
            isReversal,
        };
        yield paymentLog.update(updateData);
        return (0, utility_1.successResponse)(res, `Payment report updated!`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
exports.default = {
    logPayment,
    getPaymentLogs,
    getPaymentLogDetails,
    paymentWebhook,
};
