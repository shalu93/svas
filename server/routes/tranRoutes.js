import { Router } from 'express';
import transactions from '../controllers/transactionController';

const tranRouter=Router();

tranRouter.post('/transactions/:accountNumber/debit',transactions.debitAccount);
tranRouter.post('/transactions/:accountNumber/credit',transactions.creditAccount);
tranRouter.get('/accounts/:accountNumber/transactions',transactions.viewTransaction);
tranRouter.get('/transactions/:transactionid/',transactions.viewTransactionid);

export default tranRouter;