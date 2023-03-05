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
// create business
const createBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { name, address, phone, email, state, country } = req.body;
    const insertData = { name, address, phone, email, state, country };
    try {
        const businessExists = yield db_1.default.businesses.findOne({ where: { name }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        // if business exists, stop the process and return a message
        if (businessExists)
            return (0, utility_1.errorResponse)(res, `business with name ${name} already exists`);
        const business = yield db_1.default.businesses.create(insertData);
        if (business) {
            yield db_1.default.branches.create({ name: 'Main Branch', address: business.address, state: business.state, businessId: business.id });
            return (0, utility_1.successResponse)(res, `Business creation successfull`);
        }
        return (0, utility_1.errorResponse)(res, `An error occured`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// get all businesses
const getBusinesses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = {};
        if (!req.params) {
            where.status = 'active';
        }
        const businesses = yield db_1.default.businesses.findAll({ where, order: [['id', 'DESC']] });
        if (!businesses.length)
            return (0, utility_1.successResponse)(res, `No address available!`, []);
        return (0, utility_1.successResponse)(res, `${businesses.length} business${businesses.length > 1 ? 'es' : ''} retrived!`, businesses);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// get business details
const getBusinessDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const business = yield db_1.default.businesses.findOne({ where: { id } });
        if (!business)
            return (0, utility_1.errorResponse)(res, `Address with ID ${id} not found!`);
        return (0, utility_1.successResponse)(res, `Address details retrived!`, business);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// update business
const updateBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const { name, address, phone, email, state, country, status } = req.body;
    try {
        const business = yield db_1.default.businesses.findOne({ where: { id }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!business)
            return (0, utility_1.errorResponse)(res, `business not found!`);
        const updateData = {
            name: name || business.name,
            address: address || business.address,
            phone: phone || business.phone,
            email: email || business.email,
            state: state || business.state,
            country: country || business.country,
            status: status || business.status,
        };
        const updatedBusiness = yield business.update(updateData);
        if (!updatedBusiness)
            return (0, utility_1.errorResponse)(res, `Unable to update business!`);
        return (0, utility_1.successResponse)(res, `Business updated successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// delete business
const deleteBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const checkBusiness = yield db_1.default.businesses.findOne({ where: { id } });
        if (!checkBusiness)
            return (0, utility_1.errorResponse)(res, `Business with ID ${id} not found!`);
        yield checkBusiness.destroy({ force: true });
        return (0, utility_1.successResponse)(res, `Business with ID ${id} deleted successfully!`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// delete multiple business
const deleteMultipleBusinesses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { ids } = req.body;
    try {
        let errorArr = [];
        let successArr = [];
        for (let i = 0; i < ids.length; i++) {
            const checkBusiness = yield db_1.default.addresses.findOne({
                where: { id: ids[i] },
            });
            if (checkBusiness) {
                yield checkBusiness.destroy();
                successArr.push({
                    successMsg: `Business with ID ${ids[i]} deleted successfully!`,
                });
            }
            else {
                errorArr.push({ errorMsg: `Business with ID ${ids[i]} not found!` });
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
    createBusiness,
    getBusinesses,
    getBusinessDetails,
    updateBusiness,
    deleteBusiness,
    deleteMultipleBusinesses,
};
