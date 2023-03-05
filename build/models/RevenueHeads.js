"use strict";
/*************************************************************************
REVENUE HEADS TABLE
*************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, Sequelize) {
    var RevenueHeads = sequelize.define('revenueHeads', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount: {
            type: Sequelize.DOUBLE,
            defaultValue: 0.0,
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'inactive',
        },
    }, {
        freezeTableName: true,
    });
    RevenueHeads.associate = function (models) {
        models.revenueHeads.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
        models.revenueHeads.belongsTo(models.branches, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'branchId' });
    };
    return RevenueHeads;
}
exports.default = default_1;
