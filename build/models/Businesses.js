"use strict";
/*************************************************************************
BUSINESSES TABLE
*************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, Sequelize) {
    var Businesses = sequelize.define('businesses', {
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
        country: {
            type: Sequelize.STRING,
            allowNull: false,
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
    Businesses.associate = function (models) {
        models.businesses.hasMany(models.agents, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
        models.businesses.hasMany(models.branches, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
        models.businesses.hasMany(models.categories, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
    };
    return Businesses;
}
exports.default = default_1;
