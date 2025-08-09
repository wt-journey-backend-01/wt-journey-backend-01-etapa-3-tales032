require('dotenv').config();

module.exports = {
development: {
  client: 'pg',
  connection: {
    host: 'localhost', 
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
}
};