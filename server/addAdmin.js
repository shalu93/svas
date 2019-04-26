const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

const addAdminuser = (req, res, next) => {
    const text = `INSERT INTO users(firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values = ['shalu', 'chandwani', 'shaluchandwani@rocketmail.com', '$2b$10$jVCLG5FrtrXen/gQDs4ikOBWz5izs0iAfKspkPDm8UiNQ/yHBX4tG', 'admin'];
    db.query(text, values);
    const text1 = `INSERT INTO users(firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values1 = ['pankaj', 'vaswani', 'pankajvaswani@rocketmail.com', '$2b$10$jVCLG5FrtrXen/gQDs4ikOBWz5izs0iAfKspkPDm8UiNQ/yHBX4tG', 'client'];   
    db.query(text1, values1);
    const text2 = `INSERT INTO users(firstname, lastname, email, password, usertype) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values3 = ['sakshi', 'chandwani', 'sakshichandwani@rocketmail.com', '$2b$10$jVCLG5FrtrXen/gQDs4ikOBWz5izs0iAfKspkPDm8UiNQ/yHBX4tG', 'staff'];    
    db.query(text2, values3);
}

module.exports = {
    addAdminuser
};

require('make-runnable');