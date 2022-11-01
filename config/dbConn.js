const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/tokofication')

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.log(err)
    }
}

module.exports = { connectDB, sequelize }