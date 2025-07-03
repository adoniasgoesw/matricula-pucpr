const sql = require('mssql');

const config = {
  server: process.env.SQL_SERVER || 'matriculasql.database.windows.net',
  database: process.env.SQL_DATABASE || 'matricula-db',
  options: {
    encrypt: true,
  },
  authentication: {
    type: 'azure-active-directory-msi-app',
  }
};

async function conectar() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Erro na conexão com o banco:', err);
    throw err;
  }
}

module.exports = conectar;
