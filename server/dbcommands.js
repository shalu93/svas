const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({connectionString: process.env.NODE_ENV==='test' ? config.test.dbPath : config.dev.dbPath});

pool.on('connect', () => {
    console.log('connected to the Database');
});


const createUserTables = () => {
    const userTable = `CREATE TABLE IF NOT EXISTS
        users(
            userid SERIAL PRIMARY KEY,
            firstname VARCHAR(50) NOT NULL,
            lastname VARCHAR(50) NOT NULL,
            email VARCHAR(225) NOT NULL,
            password VARCHAR(1000) NOT NULL,
            usertype VARCHAR(6) NOT NULL
        )`;
    pool.query(userTable)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

const createAccountTables = () => {
    const accountsTable = `CREATE TABLE IF NOT EXISTS
        accounts(
            accountnumber SERIAL PRIMARY KEY,
            email VARCHAR(225) NOT NULL,
            accounttype VARCHAR(7) NOT NULL,
            userid INT NOT NULL,
            accountstatus VARCHAR(7),
            openingbalance FLOAT,
            createdon FLOAT,
            currentbalance FLOAT
        )`;
    pool.query(accountsTable)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

const createTransactionTables = () => {
    const transactionsTable = `CREATE TABLE IF NOT EXISTS
        transactions(
            transactionid SERIAL PRIMARY KEY,
            accountnumber INT NOT NULL,
            staffid INT NOT NULL,
            userid INT NOT NULL,
            createdon FLOAT,
            transactiontype VARCHAR(7) NOT NULL,
            transactionamount FLOAT,
            oldbalance FLOAT,
            newbalance FLOAT
        )`;
    pool.query(transactionsTable)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};


const dropTables = () => {
    const deleteTables = 'DROP TABLE IF EXISTS users, accounts, transactions';
    pool.query(deleteTables)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };

pool.on('remove', () => {
    console.log('clients removed');
    process.exit(0);
});

module.exports = {
    createUserTables,
    createAccountTables,
    createTransactionTables,
    dropTables,
    pool,
};

require('make-runnable');

