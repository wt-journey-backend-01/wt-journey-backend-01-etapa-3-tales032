
require('dotenv').config();
const knex = require("knex");
const knexConfig = require("../knexfile");


const nodeEnv = process.env.NODE_ENV || 'development';
const config = knexConfig[nodeEnv];

const db = knex(config);

module.exports = db;
