import { Router } from "express";
import transactions from "../controllers/transactionController"



const tranRouter=Router();

tranRouter.post('/v1/transactions/:accountNumber/debit',transactions.debitAccount);
tranRouter.post('/v1/transactions/:accountNumber/credit',transactions.creditAccount);

export default tranRouter;