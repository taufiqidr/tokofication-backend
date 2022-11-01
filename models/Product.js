const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn')

const Product = sequelize.define('Product', {
    // Model attributes are defined here
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sold_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    // Other model options go here
});

module.exports = Product