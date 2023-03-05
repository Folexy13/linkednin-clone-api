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
exports.postPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const configSetup_1 = __importDefault(require("../config/configSetup"));
const reqConfig = (url, method, data = null) => {
    console.log(method);
    return {
        method,
        url: `${configSetup_1.default.PAYMENT_BASE_URL}${url}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${configSetup_1.default.PAYMENT_AUTH}`,
        },
        data,
    };
};
const postPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, axios_1.default)(reqConfig('/api/ph-backend/process-payment/bookonhold', 'POST', data));
    console.log(res.data);
    return res.data;
});
exports.postPayment = postPayment;
