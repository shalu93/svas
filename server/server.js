import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import AccountRouter from './routes/acctRoutes';
import authRouter from './routes/authRoutes';
import tranRouter from './routes/tranRoutes';
import swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
 
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', AccountRouter);
app.use('/api', authRouter);
app.use('/api', tranRouter);

// eslint-disable-next-line
const port=process.env.PORT||3001;
// eslint-disable-next-line
const server=app.listen(port, ()=>console.log(`The server is up on port ${port}`));

module.exports = server;