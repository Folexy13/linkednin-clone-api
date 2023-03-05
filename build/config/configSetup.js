"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getConfig = () => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: Number(process.env.PORT) || 8806,
        SSL: true,
        JWTSECRET: process.env.JWTSECRET,
        JWT_EXPIRY_TIME: process.env.JWT_EXPIRY_TIME,
        DBNAME: process.env.DBNAME,
        DBUSERNAME: process.env.DBUSERNAME,
        DBPASSWORD: process.env.DBPASSWORD,
        DBHOST: process.env.DBHOST,
        DBPORT: Number(process.env.DBPORT),
        DBDIALECT: process.env.DBDIALECT,
        MAIL_FROM: process.env.MAIL_FROM,
        MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        TWILLIO_ACCOUNT_SID: process.env.TWILLIO_ACCOUNT_SID,
        TWILLIO_AUTH_TOKEN: process.env.TWILLIO_AUTH_TOKEN,
        TWILLIO_MESSAGE_SERVICE_ID: process.env.TWILLIO_MESSAGE_SERVICE_ID,
        PAYMENT_BASE_URL: process.env.PAYMENT_BASE_URL,
        PAYMENT_AUTH: process.env.PAYMENT_AUTH,
        PUBLIC_ROUTES: [
            '/',
            '/login',
            '/register',
            '/send-otp',
            '/verify-otp',
            '/change-password',
            '/reset-password',
            '/admin/login',
            '/admin/change-password',
            '/admin/reset-password',
        ],
    };
};
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
exports.default = sanitizedConfig;
