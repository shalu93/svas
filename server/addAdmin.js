const db = require('db');

const addAdminuser = (req, res, next) => {
    const text = `INSERT INTO users(firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values = ['shalu', 'chandwani', 'shaluchandwani@rocketmail.com', 'shalu@1993', 'admin'];
    
    db.query(text, values);
    next();
}
