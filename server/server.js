import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import myRouter from './routes/Routes';

dotenv.config();


const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', myRouter);


const port=process.env.PORT||3000;

const server=app.listen(port, ()=>console.log(`The server is up on port ${port}`));

module.exports = server
