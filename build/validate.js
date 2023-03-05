"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate = (method) => {
    switch (method) {
        case '/register': {
            return [
                (0, express_validator_1.body)('names').not().isEmpty().isString().withMessage('names is required!'),
                (0, express_validator_1.body)('email').not().isEmpty().isString().withMessage('Email is required!'),
                (0, express_validator_1.body)('password').not().isEmpty().isString().withMessage('Password is required!'),
                (0, express_validator_1.body)('phone').not().isEmpty().isString().withMessage('Phone is required!'),
                (0, express_validator_1.body)('role').optional().isString().withMessage('role is required'),
            ];
        }
        case '/login': {
            return [
                (0, express_validator_1.body)('email').not().isEmpty().isString().withMessage('Email is required!'),
                (0, express_validator_1.body)('password').not().isEmpty().isString().withMessage('Password is required!'),
            ];
        }
        case '/update-user-settings': {
            return [(0, express_validator_1.body)('twoFa').not().isEmpty().isBoolean().withMessage('2fa is required and must be boolean!')];
        }
        case '/update-password': {
            return [
                (0, express_validator_1.body)('email').not().isEmpty().isString().withMessage('Email is required!'),
                (0, express_validator_1.body)('oldPassword').not().isEmpty().isString().withMessage('Old password is required!'),
                (0, express_validator_1.body)('newPassword').not().isEmpty().isString().withMessage('New password is required!'),
            ];
        }
        case '/reset-password': {
            return [(0, express_validator_1.body)('email').not().isEmpty().isString().withMessage('Email is required!')];
        }
        case '/change-password': {
            return [
                (0, express_validator_1.body)('token').not().isEmpty().isString().withMessage('token is required!'),
                (0, express_validator_1.body)('password').not().isEmpty().isString().withMessage('password is required!'),
            ];
        }
        case '/verify-otp': {
            const validType = ['verification', 'reset', '2fa'];
            return [
                (0, express_validator_1.body)('token').not().isEmpty().isString().withMessage('token is required!'),
                (0, express_validator_1.body)('email').not().isEmpty().isString().withMessage('email is required!'),
                (0, express_validator_1.body)('type')
                    .not()
                    .isEmpty()
                    .custom((value) => {
                    return validType.includes(value);
                })
                    .withMessage(`type can only include ${validType}`),
                (0, express_validator_1.body)('otp')
                    .not()
                    .isEmpty()
                    .custom((value) => {
                    return Number(value);
                })
                    .withMessage('otp is required!'),
            ];
        }
        case 'id': {
            return [(0, express_validator_1.param)('id').isInt().withMessage('ID must be a number!')];
        }
    }
};
exports.default = validate;
