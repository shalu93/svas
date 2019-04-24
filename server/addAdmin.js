const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

const addAdminuser = (req, res, next) => {
    const text = `INSERT INTO users(userid,firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5,$6) RETURNING *`;
    const values = ['12','shalu', 'chandwani', 'shaluchandwani@rocketmail.com', 'shalu@1993', 'admin'];
    
    db.query(text, values);
}

module.exports = {
    addAdminuser
};

require('make-runnable');