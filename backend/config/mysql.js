module.exports = {
  HOST: process.env.MYSQLDB_HOST || 'mydbinstance.cxxo538sc81p.us-west-1.rds.amazonaws.com',
  USER: process.env.MYSQLDB_USER || 'admin',
  PASSWORD: process.env.MYSQLDB_ROOT_PASSWORD || 'qwerty123',
  DB: process.env.MYSQLDB_DATABASE || 'etsy_db',
  port: process.env.MYSQLDB_LOCAL_PORT || '3306',
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};