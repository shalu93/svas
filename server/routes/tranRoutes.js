import { Router } from 'express';
import transactions from '../controllers/transactionController';
import auth from '../authorization/auth';

const tranRouter=Router();

tranRouter.post('/transactions/:accountNumber/debit',auth.authorization,transactions.debitAccount);
tranRouter.post('/transactions/:accountNumber/credit',auth.authorization,transactions.creditAccount);

tranRouter.get('/accounts/:accountNumber/transactions',auth.authorization,transactions.viewTransaction);
tranRouter.get('/transactions/:transactionid',auth.authorization,transactions.viewTransactionid);

export default tranRouter;