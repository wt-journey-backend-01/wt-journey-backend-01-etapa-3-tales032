require('dotenv').config();

module.exports = {
 development: {
   client: 'pg',
   connection: {
     host: '127.0.0.1',
     port: 5432,
     user: process.env.POSTGRES_USER || 'postgres',
     password: process.env.POSTGRES_PASSWORD || 'postgres',
     database: process.env.POSTGRES_DB || 'policia_db',
   },
   migrations: {
     directory: './db/migrations',
   },
   seeds: {
     directory: './db/seeds',
   },
 },
 
 ci: {
   client: 'pg',
   connection: {
     host: process.env.DB_HOST || 'localhost', 
     port: parseInt(process.env.DB_PORT) || 5432,
     user: process.env.POSTGRES_USER || 'postgres',
     password: process.env.POSTGRES_PASSWORD || 'postgres',
     database: process.env.POSTGRES_DB || 'policia_db',
   },
   migrations: {
     directory: './db/migrations',
   },
   seeds: {
     directory: './db/seeds',
   },
 },

 test: {
   client: 'pg',
   connection: {
     host: process.env.DB_HOST || 'localhost',
     port: parseInt(process.env.DB_PORT) || 5432,
     user: process.env.POSTGRES_USER || 'postgres',
     password: process.env.POSTGRES_PASSWORD || 'postgres',
     database: process.env.POSTGRES_DB || 'policia_db',
   },
   migrations: {
     directory: './db/migrations',
   },
   seeds: {
     directory: './db/seeds',
   },
 }
};