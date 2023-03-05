"use strict";
/*************************************************************************
CATEGORIES TABLE
*************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, Sequelize) {
    var Categories = sequelize.define('categories', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'inactive',
        },
    }, {
        freezeTableName: true,
    });
    Categories.associate = function (models) {
        models.categories.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
    };
    return Categories;
}
exports.default = default_1;
