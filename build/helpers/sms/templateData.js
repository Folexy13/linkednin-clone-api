"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpTemplateData = void 0;
// Import types
const types_1 = require("../types");
const getOtpTemplateData = ({ otp, type }) => {
    if (type === types_1.typeEnum.VERIFICATION) {
        return {
            mailSubject: 'Email Verification',
            mailBody: `
				OTP for your email verification is :\n
				${otp}\n
				This Otp is valid for only 10 minutes\n
			`,
        };
    }
    else if (type === types_1.typeEnum.RESET) {
        return {
            mailSubject: 'Password Reset',
            mailBody: `
				OTP for your password reset request is :\n
				${otp}\n
				This Otp is valid for only 10 minutes\n
			`,
        };
    }
    else {
        return {
            mailSubject: 'Two Factor Authentication',
            mailBody: `
				OTP for your 2FA is :\n
				${otp}\n
				This Otp is valid for only 10 minutes
			`,
        };
    }
};
exports.getOtpTemplateData = getOtpTemplateData;
