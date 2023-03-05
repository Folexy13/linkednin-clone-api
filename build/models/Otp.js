"use strict";
/*************************************************************************
OTP TABLE
*************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, Sequelize) {
    var Otp = sequelize.define('otp', {
        otp: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        expirationTime: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        verifiedAt: Sequelize.DATE,
    }, {
        freezeTableName: true,
    });
    return Otp;
}
exports.default = default_1;
