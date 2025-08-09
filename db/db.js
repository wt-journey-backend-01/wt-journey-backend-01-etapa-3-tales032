const config = require("../knexfile");
const knex = require("knex");
require('dotenv').config();

const db = knex(config.development);

module.exports = db;