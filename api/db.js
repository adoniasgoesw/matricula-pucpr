const sql = require('mssql');

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  options: { encrypt: true },
  authentication: { type: 'azure-active-directory-default' }
};

const poolPromise = sql.connect(config);

module.exports = {
  sql,
  poolConnect: poolPromise
}; 