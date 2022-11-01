const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn')

const User = sequelize.define('User', {
    // Model attributes are defined here
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isMerchant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    roles: {
        type: DataTypes.STRING,
        defaultValue: "user"
    }

}, {
    // Other model options go here
});

module.exports = User