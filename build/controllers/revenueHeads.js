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
const express_validator_1 = require("express-validator");
// Import db
const db_1 = __importDefault(require("./db"));
// Import function files
const utility_1 = require("../helpers/utility");
// create revenueHead
const createRevenueHead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { name, amount, branchId, businessId } = req.body;
    const insertData = { name, amount, branchId, businessId };
    try {
        const revenueHeadExists = yield db_1.default.revenueHeads.findOne({
            where: { name, amount, businessId },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        // if revenueHead exists, stop the process and return a message
        if (revenueHeadExists)
            return (0, utility_1.errorResponse)(res, `RevenueHead with name ${name} already exists`);
        const revenueHead = yield db_1.default.revenueHeads.create(insertData);
        if (revenueHead)
            return (0, utility_1.successResponse)(res, `RevenueHead creation successfull`);
        return (0, utility_1.errorResponse)(res, `An error occured`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// get all revenueHeads
const getRevenueHeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = {};
        if (!req.params) {
            where.status = 'active';
        }
        const revenueHeads = yield db_1.default.revenueHeads.findAll({ where, order: [['id', 'DESC']] });
        if (!revenueHeads.length)
            return (0, utility_1.successResponse)(res, `No address available!`, []);
        return (0, utility_1.successResponse)(res, `${revenueHeads.length} revenueHead${revenueHeads.length > 1 ? 'es' : ''} retrived!`, revenueHeads);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// get revenueHead details
const getRevenueHeadDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const revenueHead = yield db_1.default.revenueHeads.findOne({ where: { id } });
        if (!revenueHead)
            return (0, utility_1.errorResponse)(res, `Address with ID ${id} not found!`);
        return (0, utility_1.successResponse)(res, `Address details retrived!`, revenueHead);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// update revenueHead
const updateRevenueHead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const { name, amount, branchId, businessId, status } = req.body;
    try {
        const revenueHead = yield db_1.default.revenueHeads.findOne({ where: { id }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!revenueHead)
            return (0, utility_1.errorResponse)(res, `revenueHead not found!`);
        const updateData = {
            name: name || revenueHead.name,
            amount: amount || revenueHead.amount,
            branchId: branchId || revenueHead.branchId,
            businessId: businessId || revenueHead.businessId,
            status: status || revenueHead.status,
        };
        const updatedRevenueHead = yield revenueHead.update(updateData);
        if (!updatedRevenueHead)
            return (0, utility_1.errorResponse)(res, `Unable to update revenueHead!`);
        return (0, utility_1.successResponse)(res, `RevenueHead updated successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// delete revenueHead
const deleteRevenueHead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const checkRevenueHead = yield db_1.default.revenueHeads.findOne({ where: { id } });
        if (!checkRevenueHead)
            return (0, utility_1.errorResponse)(res, `RevenueHead with ID ${id} not found!`);
        yield checkRevenueHead.destroy({ force: true });
        return (0, utility_1.successResponse)(res, `RevenueHead with ID ${id} deleted successfully!`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// delete multiple revenueHead
const deleteMultipleRevenueHeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { ids } = req.body;
    try {
        let errorArr = [];
        let successArr = [];
        for (let i = 0; i < ids.length; i++) {
            const checkRevenueHead = yield db_1.default.revenueHeads.findOne({
                where: { id: ids[i] },
            });
            if (checkRevenueHead) {
                yield checkRevenueHead.destroy();
                successArr.push({
                    successMsg: `RevenueHead with ID ${ids[i]} deleted successfully!`,
                });
            }
            else {
                errorArr.push({ errorMsg: `RevenueHead with ID ${ids[i]} not found!` });
            }
        }
        return (0, utility_1.successResponse)(res, `Operation successful!`, {
            success: successArr.length,
            successData: successArr,
            failure: errorArr.length,
            failureData: errorArr,
        });
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
exports.default = {
    createRevenueHead,
    getRevenueHeads,
    getRevenueHeadDetails,
    updateRevenueHead,
    deleteRevenueHead,
    deleteMultipleRevenueHeads,
};
