import { Router } from 'express';
import accounts from '../controllers/accountController';
import auth from '../authorization/auth';

const AccountRouter=Router();

AccountRouter.get('/v1/accounts',auth.authorization,accounts.getAcctInfo);
AccountRouter.post('/v1/accounts',auth.authorization,accounts.createAccount);
AccountRouter.patch('/v1/account/:accountNumber',auth.authorization,accounts.updateAccount);
AccountRouter.delete('/v1/accounts/:accountNumber',auth.authorization,accounts.deleteAccount);

AccountRouter.get('/v2/user/:useremail/accounts',auth.authorization,accounts.getAcctInfoOfUser);
AccountRouter.get('/v2/accounts/:accountNumber',auth.authorization,accounts.getSpecificAcctInfo);

export default AccountRouter;