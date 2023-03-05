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
exports.prepareMail = exports.sendMail = void 0;
// Import packages
const mail_1 = __importDefault(require("@sendgrid/mail"));
// Import configs
const configSetup_1 = __importDefault(require("../../config/configSetup"));
const sendMail = ({ mailRecipients, mailSubject, mailBody, mailAttachments }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mail_1.default.setApiKey(configSetup_1.default.SENDGRID_API_KEY);
        const msg = {
            to: mailRecipients,
            from: `${configSetup_1.default.MAIL_FROM_NAME} <${configSetup_1.default.MAIL_FROM}>`,
            subject: mailSubject,
            html: mailBody,
        };
        mail_1.default.send(msg).then(() => {
            console.log(`Email sent to ${mailRecipients}`);
        }, (error) => {
            console.error('hello', error);
            return {
                status: false,
                message: `Email not sent ${error}`,
            };
        });
        return {
            status: true,
            message: `Email sent successfully to ${mailRecipients}`,
        };
    }
    catch (error) {
        console.log(error);
        return {
            status: false,
            message: `Email not sent ${error}`,
            email: mailRecipients,
        };
    }
});
exports.sendMail = sendMail;
const prepareMail = ({ mailRecipients, mailSubject, mailBody }) => __awaiter(void 0, void 0, void 0, function* () {
    const _sendMail = yield (0, exports.sendMail)({
        mailRecipients,
        mailSubject,
        mailBody,
    });
    return { status: _sendMail.status, message: _sendMail.message };
});
exports.prepareMail = prepareMail;
