import { Router } from 'express';
import accounts from '../controllers/accountController';

const AcctRouter=Router();

AcctRouter.get('/accounts',accounts.getAcctInfo);
AcctRouter.post('/accounts',accounts.createAccount);
AcctRouter.patch('/account/:accountNumber',accounts.updateAccount);
AcctRouter.delete('/accounts/:accountNumber',accounts.deleteAccount);

export default AcctRouter;