// config.js
const dotenv = require('dotenv');
dotenv.config();

// const env = process.env.NODE_ENV;

const dev = {
 app: {
   port: 3001
 },
 dbPath: process.env.connectionString,
}

const test = {
 app: {
   port: 3001
 },
 dbPath: process.env.TEST_DB,
}

const config = {
 dev,
 test
//  env
};

module.exports = config;