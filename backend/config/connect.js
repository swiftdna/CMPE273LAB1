const dbConfig = require("./mysql");
const Sequelize = require("sequelize");

module.exports = async () => {
  // console.log('>>>> connect called >>>');
  // console.log('dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, dbConfig.HOST, dbConfig.port' , dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, dbConfig.HOST, dbConfig.port);
  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    logging: process.env.NODE_ENV === 'test' ? false : console.log,
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }  
};