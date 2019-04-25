import { Router } from 'express';
import accounts from '../controllers/accountController';
import auth from '../authorization/auth';

const AcctRouter=Router();

AcctRouter.get('/v1/accounts',auth.authorization,accounts.getAcctInfo);
AcctRouter.post('/v1/accounts',auth.authorization,accounts.createAccount);
AcctRouter.patch('/v1/account/:accountNumber',auth.authorization,accounts.updateAccount);
AcctRouter.delete('/v1/accounts/:accountNumber',auth.authorization,accounts.deleteAccount);

AcctRouter.get('/v2/user/:useremail/accounts',auth.authorization,accounts.getAcctInfoOfUser);
AcctRouter.get('/v2/accounts/:accountNumber',auth.authorization,accounts.getSpecificAcctInfo);

export default AcctRouter;