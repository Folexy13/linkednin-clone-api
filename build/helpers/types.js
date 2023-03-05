"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payEnum = exports.ModelStatus = exports.AdminRoles = exports.typeEnum = void 0;
var typeEnum;
(function (typeEnum) {
    typeEnum["VERIFICATION"] = "verification";
    typeEnum["RESET"] = "reset";
    typeEnum["TWOFA"] = "2fa";
})(typeEnum = exports.typeEnum || (exports.typeEnum = {}));
var AdminRoles;
(function (AdminRoles) {
    AdminRoles["CONTROL"] = "control";
    AdminRoles["SUPPORT"] = "support";
})(AdminRoles = exports.AdminRoles || (exports.AdminRoles = {}));
var ModelStatus;
(function (ModelStatus) {
    ModelStatus["ACTIVE"] = "active";
    ModelStatus["INACTIVE"] = "inactive";
})(ModelStatus = exports.ModelStatus || (exports.ModelStatus = {}));
var payEnum;
(function (payEnum) {
    payEnum["PAYEE"] = "payee";
    payEnum["PAYER"] = "payer";
})(payEnum = exports.payEnum || (exports.payEnum = {}));
