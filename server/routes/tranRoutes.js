import { Router } from "express";
import transactions from "../controllers/transactionController"



const tranRouter=Router();

tranRouter.post('/transactions/:accountNumber/debit',transactions.debitAccount);
tranRouter.post('/transactions/:accountNumber/credit',transactions.creditAccount);

export default tranRouter;