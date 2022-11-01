const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URI)

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.log(err)
    }
}

module.exports = { connectDB, sequelize }