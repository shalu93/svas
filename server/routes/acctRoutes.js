import { Router } from 'express';
import accounts from '../controllers/accountController';
import auth from '../authorization/auth';

const AcctRouter=Router();

AcctRouter.get('/accounts',auth.authorization,accounts.getAcctInfo);
AcctRouter.post('/accounts',auth.authorization,accounts.createAccount);
AcctRouter.patch('/account/:accountNumber',auth.authorization,accounts.updateAccount);
AcctRouter.delete('/accounts/:accountNumber',auth.authorization,accounts.deleteAccount);

AcctRouter.get('/user/:useremail/accounts',auth.authorization,accounts.getAcctInfoOfUser);
AcctRouter.get('/accounts/:accountNumber',auth.authorization,accounts.getSpecificAcctInfo);

export default AcctRouter;