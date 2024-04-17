const { Pool } = require('pg');
require('dotenv').config();

const postgresUser = process.env.POSTGRES_USER;
const postgresPassword = process.env.POSTGRES_PASSWORD;
const postgresHost = process.env.POSTGRES_HOST || 'localhost';
const postgresPort = process.env.POSTGRES_PORT  || '5432';
const postgresDatabase = process.env.POSTGRES_DATABASE;

const pool = new Pool({
  user: postgresUser,
  password: postgresPassword,
  host: postgresHost,
  port: postgresPort,
  database: postgresDatabase,
});

module.exports = pool;