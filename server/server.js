import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import AccountRouter from './routes/acctRoutes';
import authRouter from './routes/authRoutes';
import tranRouter from './routes/tranRoutes';
import swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
 
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v2', AccountRouter);
app.use('/api/v2', authRouter);
app.use('/api/v2', tranRouter);

// eslint-disable-next-line
const port=process.env.PORT||3001;
// eslint-disable-next-line
const server=app.listen(port, ()=>console.log(`The server is up on port ${port}`));

module.exports = server;
