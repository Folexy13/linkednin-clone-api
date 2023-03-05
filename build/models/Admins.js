"use strict";
/*************************************************************************
ADMINS TABLE
*************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, Sequelize) => {
    var Admins = sequelize.define('admins', {
        names: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        role: {
            type: Sequelize.ENUM('support', 'control'),
            defaultValue: 'support',
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive', 'suspended'),
            defaultValue: 'inactive',
        },
        lastLogin: Sequelize.DATE,
    }, {
        freezeTableName: true,
    });
    Admins.associate = (models) => { };
    return Admins;
};
