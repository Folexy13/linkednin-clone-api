"use strict";
/*************************************************************************
BRANCHES TABLE
*************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, Sequelize) {
    var Branches = sequelize.define('branches', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lga: {
            type: Sequelize.STRING,
        },
        email: { type: Sequelize.STRING },
        phone: { type: Sequelize.STRING },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'inactive',
        },
    }, {
        freezeTableName: true,
    });
    Branches.associate = function (models) {
        models.branches.hasMany(models.agents, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'branchId' });
        models.branches.hasMany(models.revenueHeads, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'branchId' });
        models.branches.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
    };
    return Branches;
}
exports.default = default_1;
