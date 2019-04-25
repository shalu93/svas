const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const config = require('../../config');


const pool = new Pool({
    // eslint-disable-next-line
    connectionString: process.env.NODE_ENV==='test' ? config.test.dbPath : config.dev.dbPath
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    }
}; 