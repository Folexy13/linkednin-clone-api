"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentNotifTemplateData = exports.getOtpTemplateData = void 0;
const moment_1 = __importDefault(require("moment"));
// Import types
const types_1 = require("../types");
const utility_1 = require("../utility");
const getOtpTemplateData = ({ otp, type }) => {
    if (type === types_1.typeEnum.VERIFICATION) {
        return {
            mailSubject: 'Email Verification',
            mailBody: `
				<p>OTP for your email verification is :</p>
				<p>${otp}</p>
				<p>This Otp is valid for only 10 minutes</p>
			`,
        };
    }
    else if (type === types_1.typeEnum.RESET) {
        return {
            mailSubject: 'Password Reset',
            mailBody: `
				<p>OTP for your password reset request is :</p>
				<p>${otp}</p>
				<p>This Otp is valid for only 10 minutes</p>
			`,
        };
    }
    else {
        return {
            mailSubject: 'Two Factor Authentication',
            mailBody: `
				<p>OTP for your 2FA is :</p>
				<p>${otp}</p>
				<p>This Otp is valid for only 10 minutes</p>
			`,
        };
    }
};
exports.getOtpTemplateData = getOtpTemplateData;
const paymentNotifTemplateData = ({ party, paymentData }) => {
    const { phone, amount, date, business } = paymentData;
    if (party === types_1.payEnum.PAYEE) {
        return {
            mailSubject: 'Payment Notification',
            mailBody: `
				<p>Your payment has been succesfully processed, below are the details</p>
				<table>
					<tr>
						<td><b>Amount:- </b></td>
						<td>${utility_1.formatCurrency.format(amount)}</td>
					</tr>
					<tr>
						<td><b>Phone:- </b></td>
						<td>${phone}</td>
					</tr>
					<tr>
						<td><b>Details:- </b></td>
						<td>${business.name} | ${business.branch} | ${business.revenue}</td>
					</tr>
					<tr>
						<td><b>Date:- </b></td>
						<td>${(0, moment_1.default)(date).format('LLLL')}</td>
					</tr>
				</table>
			`,
        };
    }
    else {
        return {
            _mailSubject: 'Payment Notification',
            _mailBody: `
				<p>A payment was received, below are the details</p>
				<table>
					<tr>
						<td><b>Amount:- </b></td>
						<td>${utility_1.formatCurrency.format(amount)}</td>
					</tr>
					<tr>
						<td><b>Phone:- </b></td>
						<td>${phone}</td>
					</tr>
					<tr>
						<td><b>Details:- </b></td>
						<td>${business.name} | ${business.branch} | ${business.revenue}</td>
					</tr>
					<tr>
						<td><b>Date:- </b></td>
						<td>${(0, moment_1.default)(date).format('LLLL')}</td>
					</tr>
				</table>
			`,
        };
    }
};
exports.paymentNotifTemplateData = paymentNotifTemplateData;
