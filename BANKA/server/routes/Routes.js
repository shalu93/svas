import { Router } from "express";
import users from "../controllers/userController";
import accounts from "../controllers/accountController";



const myRouter=Router();

myRouter.get('/v1/users',users.getAll);
myRouter.post('/v1/auth/signup',users.SignupUser);
myRouter.post('/v1/auth/signin',users.SigninUser);
myRouter.get('/v1/accounts',accounts.getAllAccounts);
myRouter.post('/v1/accounts',accounts.createAccount);
myRouter.patch('/v1/account/:accountNumber',accounts.updateAccount);
myRouter.delete('/v1/accounts/:accountNumber',accounts.deleteAccount);

export default myRouter;