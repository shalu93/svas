import { Router } from 'express';
import accounts from '../controllers/accountController';
import auth from '../authorization/auth';

const AccountRouter=Router();

AccountRouter.get('/accounts',auth.authorization,accounts.getAcctInfo);
AccountRouter.post('/accounts',auth.authorization,accounts.createAccount);
AccountRouter.patch('/account/:accountNumber',auth.authorization,accounts.updateAccount);
AccountRouter.delete('/accounts/:accountNumber',auth.authorization,accounts.deleteAccount);

AccountRouter.get('/user/:useremail/accounts',auth.authorization,accounts.getAcctInfoOfUser);
AccountRouter.get('/accounts/:accountNumber',auth.authorization,accounts.getSpecificAcctInfo);

export default AccountRouter;