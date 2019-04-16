import { Router } from "express";
import accounts from "../controllers/accountController";

const AcctRouter=Router();

AcctRouter.get('/v1/accounts',accounts.getAcctInfo);
AcctRouter.post('/v1/accounts',accounts.createAccount);
AcctRouter.patch('/v1/account/:accountNumber',accounts.updateAccount);
AcctRouter.delete('/v1/accounts/:accountNumber',accounts.deleteAccount);

export default AcctRouter;