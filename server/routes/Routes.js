import { Router } from "express";
import users from "../controllers/userController";
import accounts from "../controllers/accountController";
import transactions from "../controllers/transactionController"



const myRouter=Router();

myRouter.get('/v1/users',users.getAll);
myRouter.post('/v1/auth/signup',users.SignupUser);
myRouter.post('/v1/auth/signin',users.SigninUser);
myRouter.get('/v1/accounts',accounts.getAcctInfo);
myRouter.post('/v1/accounts',accounts.createAccount);
myRouter.patch('/v1/account/:accountNumber',accounts.updateAccount);
myRouter.delete('/v1/accounts/:accountNumber',accounts.deleteAccount);
myRouter.post('/v1/transactions/:accountNumber/debit',transactions.debitAccount);
myRouter.post('/v1/transactions/:accountNumber/credit',transactions.creditAccount);

export default myRouter;