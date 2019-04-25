import { Router } from 'express';
import transactions from '../controllers/transactionController';
import auth from '../authorization/auth';

const tranRouter=Router();

tranRouter.post('/v1/transactions/:accountNumber/debit',auth.authorization,transactions.debitAccount);
tranRouter.post('/v1/transactions/:accountNumber/credit',auth.authorization,transactions.creditAccount);

tranRouter.get('/v2/accounts/:accountNumber/transactions',auth.authorization,transactions.viewTransaction);
tranRouter.get('/v2/transactions/:transactionid',auth.authorization,transactions.viewTransactionid);

export default tranRouter;