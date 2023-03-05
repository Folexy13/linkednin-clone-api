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
exports.prepareSms = exports.sendSms = void 0;
const twilio_1 = require("twilio");
const configSetup_1 = __importDefault(require("../../config/configSetup"));
const sendSms = ({ phone, text }) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new twilio_1.Twilio(configSetup_1.default.TWILLIO_ACCOUNT_SID, configSetup_1.default.TWILLIO_AUTH_TOKEN);
    client.messages
        .create({
        body: text,
        to: phone,
        messagingServiceSid: configSetup_1.default.TWILLIO_MESSAGE_SERVICE_ID,
        // from: '+12345678901', // From a valid Twilio number
    })
        .then((message) => {
        console.log(message.sid);
        return {
            status: true,
            message: `Email sent`,
        };
    });
});
exports.sendSms = sendSms;
const prepareSms = ({ phone, text }) => __awaiter(void 0, void 0, void 0, function* () {
    const _sendSms = yield (0, exports.sendSms)({
        phone,
        text,
    });
    return { status: _sendSms.status, message: _sendSms.message };
});
exports.prepareSms = prepareSms;
