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
// create category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { name, businessId } = req.body;
    const insertData = { name, businessId };
    try {
        const categoryExists = yield db_1.default.categories.findOne({ where: { name }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        // if category exists, stop the process and return a message
        if (categoryExists)
            return (0, utility_1.errorResponse)(res, `category with name ${name} already exists`);
        const category = yield db_1.default.categories.create(insertData);
        if (category)
            return (0, utility_1.successResponse)(res, `Category creation successfull`);
        return (0, utility_1.errorResponse)(res, `An error occured`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = {};
        if (!req.params) {
            where.status = 'active';
        }
        const categories = yield db_1.default.categories.findAll({ where, order: [['id', 'DESC']] });
        if (!categories.length)
            return (0, utility_1.successResponse)(res, `No address available!`, []);
        return (0, utility_1.successResponse)(res, `${categories.length} category${categories.length > 1 ? 'es' : ''} retrived!`, categories);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// get category details
const getCategoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const category = yield db_1.default.categories.findOne({ where: { id } });
        if (!category)
            return (0, utility_1.errorResponse)(res, `Address with ID ${id} not found!`);
        return (0, utility_1.successResponse)(res, `Address details retrived!`, category);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// update category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const category = yield db_1.default.categories.findOne({ where: { id }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        if (!category)
            return (0, utility_1.errorResponse)(res, `category not found!`);
        const updateData = {
            name: name || category.name,
            status: status || category.status,
        };
        const updatedCategory = yield category.update(updateData);
        if (!updatedCategory)
            return (0, utility_1.errorResponse)(res, `Unable to update category!`);
        return (0, utility_1.successResponse)(res, `Category updated successfully`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occured - ${error}`);
    }
});
// delete category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    try {
        const checkCategory = yield db_1.default.categories.findOne({ where: { id } });
        if (!checkCategory)
            return (0, utility_1.errorResponse)(res, `Category with ID ${id} not found!`);
        yield checkCategory.destroy({ force: true });
        return (0, utility_1.successResponse)(res, `Category with ID ${id} deleted successfully!`);
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 401, false, `An error occured - ${error}`);
    }
});
// delete multiple category
const deleteMultipleCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, utility_1.errorResponse)(res, 'Validation Error', errors.array());
    }
    const { ids } = req.body;
    try {
        let errorArr = [];
        let successArr = [];
        for (let i = 0; i < ids.length; i++) {
            const checkCategory = yield db_1.default.addresses.findOne({
                where: { id: ids[i] },
            });
            if (checkCategory) {
                yield checkCategory.destroy();
                successArr.push({
                    successMsg: `Category with ID ${ids[i]} deleted successfully!`,
                });
            }
            else {
                errorArr.push({ errorMsg: `Category with ID ${ids[i]} not found!` });
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
    createCategory,
    getCategories,
    getCategoryDetails,
    updateCategory,
    deleteCategory,
    deleteMultipleCategories,
};
