import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

export { sql, poolConnect };
