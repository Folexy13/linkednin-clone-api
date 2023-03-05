"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
// Import function files
const authentication_1 = require("./controllers/authentication");
const admins_1 = __importDefault(require("./controllers/admins"));
const businesses_1 = __importDefault(require("./controllers/businesses"));
const branches_1 = __importDefault(require("./controllers/branches"));
const categories_1 = __importDefault(require("./controllers/categories"));
const revenueHeads_1 = __importDefault(require("./controllers/revenueHeads"));
const validate_1 = __importDefault(require("./validate"));
const middlewares_1 = require("./helpers/middlewares");
const types_1 = require("./helpers/types");
const payments_1 = __importDefault(require("./controllers/payments"));
const router = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE
router.get('/', (req, res) => {
    return res.status(200).send('API Working');
});
router.post('/agent/register', (0, validate_1.default)('/register'), authentication_1.register);
router.post('/login', (0, validate_1.default)('/login'), authentication_1.preLogin);
router.post('/update-password', (0, validate_1.default)('/update-password'), authentication_1.updatePassword);
router.post('/reset-password', (0, validate_1.default)('/reset-password'), authentication_1.resetPassword);
router.post('/change-password', (0, validate_1.default)('/change-password'), authentication_1.changePassword);
router.post('/verify-otp', (0, validate_1.default)('/verify-otp'), authentication_1.verifyOtp);
router.post('/update-user-settings', (0, validate_1.default)('/update-user-settings'), authentication_1.updateUserSettings);
router.post('/admin/register', (0, middlewares_1.isAdmin)([types_1.AdminRoles.CONTROL]), (0, validate_1.default)('/register'), admins_1.default.register);
router.post('/admin/login', (0, validate_1.default)('/login'), admins_1.default.login);
router.post('/admin/update-password', (0, validate_1.default)('/update-password'), admins_1.default.updatePassword);
router.post('/admin/reset-password', (0, validate_1.default)('/reset-password'), admins_1.default.resetPassword);
router.post('/admin/change-password', (0, validate_1.default)('/change-password'), admins_1.default.changePassword);
router.get('/business/:status?', (0, middlewares_1.isAdmin)([types_1.AdminRoles.CONTROL]), businesses_1.default.getBusinesses);
router.get('/business/get-details/:id', (0, validate_1.default)('id'), businesses_1.default.getBusinessDetails);
router.get('/business/delete/:id', (0, middlewares_1.isAdmin)([types_1.AdminRoles.CONTROL]), (0, validate_1.default)('id'), businesses_1.default.getBusinessDetails);
router.post('/business/create', (0, middlewares_1.isAdmin)([types_1.AdminRoles.CONTROL]), businesses_1.default.createBusiness);
router.post('/business/update/:id', (0, middlewares_1.isAdmin)([types_1.AdminRoles.CONTROL]), businesses_1.default.updateBusiness);
router.get('/branch/:status?', branches_1.default.getBranches);
router.get('/branch/get-details/:id', (0, validate_1.default)('id'), branches_1.default.getBranchDetails);
router.get('/branch/delete/:id', (0, validate_1.default)('id'), branches_1.default.getBranchDetails);
router.post('/branch/create', branches_1.default.createBranch);
router.post('/branch/update/:id', branches_1.default.updateBranch);
router.get('/category/:status?', categories_1.default.getCategories);
router.get('/category/get-details/:id', (0, validate_1.default)('id'), categories_1.default.getCategoryDetails);
router.get('/category/delete/:id', (0, validate_1.default)('id'), categories_1.default.getCategoryDetails);
router.post('/category/create', categories_1.default.createCategory);
router.post('/category/update/:id', categories_1.default.updateCategory);
router.get('/revenue/:status?', revenueHeads_1.default.getRevenueHeads);
router.get('/revenue/get-details/:id', (0, validate_1.default)('id'), revenueHeads_1.default.getRevenueHeadDetails);
router.get('/revenue/delete/:id', (0, validate_1.default)('id'), revenueHeads_1.default.getRevenueHeadDetails);
router.post('/revenue/create', revenueHeads_1.default.createRevenueHead);
router.post('/revenue/update/:id', revenueHeads_1.default.updateRevenueHead);
router.post('/payment/log', payments_1.default.logPayment);
router.get('/payments', payments_1.default.getPaymentLogs);
router.post('/payment/webhook', payments_1.default.paymentWebhook);
exports.default = router;
