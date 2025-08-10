require('dotenv').config();
const knex = require("knex");
const knexConfig = require("../knexfile");

const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Using environment: ${nodeEnv}`);


const config = knexConfig[nodeEnv] || knexConfig.development;

if (!config) {
 console.error(`No database configuration found for environment: ${nodeEnv}`);
 process.exit(1);
}

console.log(`Database config:`, {
 host: config.connection.host,
 port: config.connection.port,
 database: config.connection.database
});

const db = knex(config);

module.exports = db;