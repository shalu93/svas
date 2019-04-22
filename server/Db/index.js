const { Pool } = require('pg');
import dotenv from 'dotenv';
dotenv.config();


const pool = new Pool({
    // eslint-disable-next-line
    connectionString:process.env.connectionString,
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    }
};