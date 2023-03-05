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
// create branch
const createBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { name, businessId } = req.body;
    const insertData = { name, businessId };
    try {
        const branchExists = yield db_1.default.branches.findOne({ where: { name }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        // if branch exists, stop the process and return a message
        if (branchExists)
            return (0, utility_1.errorResponse)(res, `branch with name ${name} already exists`);
        const branch = yield db_1.default.branches.create(insertData);
        if (branch)
            return (0, utility_1.successResponse)(res, `Branch creation successfull`);
        return (0, utility_1.errorResponse)(res, `An error occured`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// get all branches
const getBranches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = {};
        if (!req.params) {
            where.status = 'active';
        }
        const branches = yield db_1.default.branches.findAll({ where, order: [['id', 'DESC']] });
        if (!branches.length)
            return (0, utility_1.successResponse)(res, `No address available!`, []);
        return (0, utility_1.successResponse)(res, `${branches.length} branch${branches.length > 1 ? 'es' : ''} retrived!`, branches);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// get branch details
const getBranchDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const branch = yield db_1.default.branches.findOne({ where: { id } });
        if (!branch)
            return (0, utility_1.errorResponse)(res, `Address with ID ${id} not found!`);
        return (0, utility_1.successResponse)(res, `Address details retrived!`, branch);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// update branch
const updateBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const branch = yield db_1.default.branches.findOne({ where: { id }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!branch)
            return (0, utility_1.errorResponse)(res, `branch not found!`);
        const updateData = {
            name: name || branch.name,
            status: status || branch.status,
        };
        const updatedBranch = yield branch.update(updateData);
        if (!updatedBranch)
            return (0, utility_1.errorResponse)(res, `Unable to update branch!`);
        return (0, utility_1.successResponse)(res, `Branch updated successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// delete branch
const deleteBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const checkBranch = yield db_1.default.branches.findOne({ where: { id } });
        if (!checkBranch)
            return (0, utility_1.errorResponse)(res, `Branch with ID ${id} not found!`);
        yield checkBranch.destroy({ force: true });
        return (0, utility_1.successResponse)(res, `Branch with ID ${id} deleted successfully!`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// delete multiple branch
const deleteMultipleBranches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { ids } = req.body;
    try {
        let errorArr = [];
        let successArr = [];
        for (let i = 0; i < ids.length; i++) {
            const checkBranch = yield db_1.default.addresses.findOne({
                where: { id: ids[i] },
            });
            if (checkBranch) {
                yield checkBranch.destroy();
                successArr.push({
                    successMsg: `Branch with ID ${ids[i]} deleted successfully!`,
                });
            }
            else {
                errorArr.push({ errorMsg: `Branch with ID ${ids[i]} not found!` });
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
    createBranch,
    getBranches,
    getBranchDetails,
    updateBranch,
    deleteBranch,
    deleteMultipleBranches,
};
