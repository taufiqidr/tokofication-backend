const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn')

const Category = sequelize.define('Category', {
    // Model attributes are defined here
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});

module.exports = Category