const dbConfig = require("../config/mysql");
const Sequelize = require("sequelize");
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const db = {};

console.log('dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, dbConfig.HOST, dbConfig.port' , dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, dbConfig.HOST, dbConfig.port);
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
      return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
      let model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;