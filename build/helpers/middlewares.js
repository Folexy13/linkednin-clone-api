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
exports.checkRevenueHead = exports.checkBranch = exports.checkBusiness = exports.isAdmin = exports.isAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Import db & configs
const configSetup_1 = __importDefault(require("../config/configSetup"));
const db_1 = __importDefault(require("../controllers/db"));
// Import function files
const utility_1 = require("../helpers/utility");
const isAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //this is the url without query params
    const route = req.originalUrl.split('?').shift();
    const publicRoutes = configSetup_1.default.PUBLIC_ROUTES;
    if (publicRoutes.includes(route))
        return next();
    console.log(route);
    let token = req.headers.authorization;
    if (!token)
        return (0, utility_1.handleResponse)(res, 401, false, `Access Denied / Unauthorized request`);
    try {
        token = token.split(' ')[1]; // Remove Bearer from string
        if (token === 'null' || !token)
            return (0, utility_1.handleResponse)(res, 401, false, `Unauthorized request`);
        let verified = jsonwebtoken_1.default.verify(token, configSetup_1.default.JWTSECRET);
        if (!verified)
            return (0, utility_1.handleResponse)(res, 401, false, `Unauthorized request`);
        if (verified.type === 'admin') {
            req.admin = verified;
        }
        else {
            req.agent = verified;
        }
        next();
    }
    catch (error) {
        (0, utility_1.handleResponse)(res, 400, false, `Token Expired`);
    }
});
exports.isAuthorized = isAuthorized;
const isAdmin = (roles) => {
    return (req, res, next) => {
        if (!req.admin)
            return (0, utility_1.handleResponse)(res, 401, false, `Unauthorized access`);
        if (!roles.includes(req.admin.role))
            return (0, utility_1.handleResponse)(res, 401, false, `Permission denied`);
        next();
    };
};
exports.isAdmin = isAdmin;
const checkBusiness = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const business = yield db_1.default.businesses.findByPk(id);
        if (!business)
            return (0, utility_1.fnResponse)({ status: false, message: 'Businesss not found', data: null });
        return (0, utility_1.fnResponse)({ status: true, message: 'Business Found', data: business });
    }
    catch (error) {
        console.log(error);
        return { status: false, message: 'An error occured', data: error };
    }
});
exports.checkBusiness = checkBusiness;
const checkBranch = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const branch = yield db_1.default.branches.findByPk(id);
        if (!branch)
            return (0, utility_1.fnResponse)({ status: false, message: 'Branch not found', data: null });
        return (0, utility_1.fnResponse)({ status: true, message: 'Branch Found', data: branch });
    }
    catch (error) {
        console.log(error);
        return { status: false, message: 'An error occured', data: error };
    }
});
exports.checkBranch = checkBranch;
const checkRevenueHead = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenue = yield db_1.default.revenueHeads.findByPk(id);
        if (!revenue)
            return (0, utility_1.fnResponse)({ status: false, message: 'Revenue Head not found', data: null });
        return (0, utility_1.fnResponse)({ status: true, message: 'Revenue Head Found', data: revenue });
    }
    catch (error) {
        console.log(error);
        return { status: false, message: 'An error occured', data: error };
    }
});
exports.checkRevenueHead = checkRevenueHead;
