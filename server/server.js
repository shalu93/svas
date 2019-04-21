import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import AcctRouter from './routes/acctRoutes';
import authRouter from './routes/authRoutes';
import tranRouter from './routes/tranRoutes';
var pg = require("pg");

dotenv.config();
 
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/v1', AcctRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1', tranRouter);

 
const port=process.env.PORT||3001;

const server=app.listen(port, ()=>console.log(`The server is up on port ${port}`));

module.exports = server