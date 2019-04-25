const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

const addAdminuser = (req, res, next) => {
    const text = `INSERT INTO users(userid,firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5,$6) RETURNING *`;
    const values = ['1','shalu', 'chandwani', 'shaluchandwani@rocketmail.com', 'Shalu@1993', 'admin'];
    db.query(text, values);
    const text1 = `INSERT INTO users(userid,firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5,$6) RETURNING *`;
    const values1 = ['2','pankaj', 'vaswani', 'pankajvaswani@rocketmail.com', 'Pankaj@1993', 'client'];   
    db.query(text1, values1);
    const text2 = `INSERT INTO users(userid,firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5,$6) RETURNING *`;
    const values3 = ['3','sakshi', 'chandwani', 'sakshichandwani@rocketmail.com', 'Sakshi@1993', 'staff'];    
    db.query(text2, values3);
}

module.exports = {
    addAdminuser
};

require('make-runnable');