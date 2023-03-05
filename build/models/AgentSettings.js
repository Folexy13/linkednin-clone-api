"use strict";
/*************************************************************************
AGENT SETTINGS TABLE
*************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, Sequelize) {
    var AgentSettings = sequelize.define('agentSettings', {
        twoFa: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });
    AgentSettings.associate = function (models) {
        models.agentSettings.belongsTo(models.agents, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'agentId' });
    };
    return AgentSettings;
}
exports.default = default_1;
