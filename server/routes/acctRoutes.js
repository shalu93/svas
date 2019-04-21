import { Router } from 'express';
import accounts from '../controllers/accountController';
import auth from '../authorization/auth';

const AcctRouter=Router();

AcctRouter.get('/accounts',accounts.getAcctInfo);
AcctRouter.post('/accounts',auth.authorization,accounts.createAccount);
AcctRouter.patch('/account/:accountNumber',accounts.updateAccount);
AcctRouter.delete('/accounts/:accountNumber',accounts.deleteAccount);

AcctRouter.get('/user/:useremail/accounts',accounts.getAcctInfoOfUser);
AcctRouter.get('/accounts/:accountNumber',accounts.getSpecificAcctInfo);



export default AcctRouter;