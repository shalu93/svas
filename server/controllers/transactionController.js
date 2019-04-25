import dotenv from 'dotenv';
const db = require('../db');
import Joi from 'joi';
import numvalidation from '../validation/numvalidation';
import transactionvalidation from '../validation/transactionvalidation';

dotenv.config();


export default class transaction{

    
    // get all transaction details 
    static viewTransaction(req, res){
        if(req.Info.UserType == 'client'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only admin/staff can'
            });
        }
        var accountNumb = parseInt(req.params.accountNumber);
        db.query('SELECT * FROM transactions where transactions.accountnumber = $1', [accountNumb],function(err,result) {
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: 'no records found'});
            }
            if(err){
                res.status(400).send(err);
            } else {
                return res.send({
                    status : 200 ,   
                    data : result.rows});
            }
        });
    }

    // get specific transaction detail
    static viewTransactionid(req, res){
        if(req.Info.UserType != 'client'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only client can'
            });
        }
        const num = {
            inputparamnumber: req.params.transactionid
        }
        const result = Joi.validate(num, numvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only numbers are allowed in the transaction id field'
            });
        }
        var TranId = parseInt(req.params.transactionid);
        db.query('SELECT * FROM transactions where transactions.transactionid = $1', [TranId],function(err,result) {
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: 'no accounts found for the transaction id'});
            }
            if(err){
                res.status(400).send(err);
            } else {
                if(result.rows[0].userid !=req.Info.UserId ){
                    return res.status(404).send({ 
                    status:404,
                    message: 'This transaction id doesnot belong to any of your account'}); 
                } else {
                return res.send({
                    status : 200 ,   
                    data : result.rows});
                }
            }
        });
    }

    static debitAccount(req, res){
        
        if(!req.body.amount ) {
            return res.status(400).json({
                status:400,
                message: 'Please fill in amount as input of the form'});
        }
        
        if(req.Info.UserType != 'staff'){
                return res.status(400).json({ 
                    status: 400,
                    message: 'You are not authorized to perform this transaction only staff can'
                });
        }

        const num = {
            inputparamnumber: req.params.accountNumber,
            inputparamnumberamt : req.body.amount 
        }
        const result = Joi.validate(num, transactionvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only numbers will be accepted for account number and amount'
            });
        }
        let toDay = Date.now();
        const debits = {
            createdOn : toDay,
            accountNumber : req.params.accountNumber,
            amount : req.body.amount 
        };
        const text = 'select * from  accounts where accounts.accountnumber =$1';
        const values= [debits.accountNumber];
        db.query(text, values ,function(err,result) { 
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: 'no accounts found to perform the transaction'});
            }
            if (result.rows[0].accountstatus != 'active'){
                return res.status(400).send({ 
                    status:400,
                    message: 'your accounts should be active to perform the debit transaction'});
            }
            const debit = {
                staffid:req.Info.UserId,
                userid:result.rows[0].userid,
                accountNumber:result.rows[0].accountnumber ,
                createdOn:toDay,
                TransactionType:'debit',
                TransactionAmt:req.body.amount,
                oldBalance: result.rows[0].currentbalance,
                newBalance: (result.rows[0].currentbalance - +req.body.amount),
                TransactionId:Math.floor(Math.random() * 1000)
            };               
            if (result.rows[0].currentbalance < req.body.amount){
                return res.status(400).send({ 
                    status:400,
                    message: `your accounts doesnot have enough funds only ${result.rows[0].currentbalance} left`}); 
            } else {
            let staffid = debit.staffid,transactionId = debit.TransactionId, accountNumber = debit.accountNumber, amount = debit.TransactionAmt, transactionType = debit.TransactionType, accountBalance = debit.newBalance;
            const text = 'update accounts set currentbalance =$1 where accountnumber =$2';
            const values= [debit.newBalance , debit.accountNumber];
            db.query(text, values ,function(err,result) {
                if(err){
                    res.status(400).send(err);
                } else {
                    // eslint-disable-next-line 
                    console.log('accounts table current balance updated');
                    const text2 = 'INSERT INTO transactions(transactionid,accountnumber,staffid,userid, createdon, transactiontype, transactionamount, oldbalance, newbalance) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';
                    const values2= [debit.TransactionId,debit.accountNumber,debit.staffid,debit.userid, debit.createdOn,debit.TransactionType,debit.TransactionAmt, debit.oldBalance,debit.newBalance];
                    db.query(text2, values2 ,function(err,result) {
                        if(err){
                            res.status(400).send(err);
                        } else {                  
                            return res.status(201).json({
                                status :201,
                                data: {transactionId,accountNumber,amount,staffid,transactionType,accountBalance}
                            });
                        }
                    });
                }
            });
        }
        });
    }
   

    static creditAccount(req, res){

        if(!req.body.amount ) {
            return res.status(400).json({ 
                status:400,
                message: 'Please fill in amount as input of the form'});
        }

        if(req.Info.UserType != 'staff'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only staff can'
            });
        }

        const num = {
            inputparamnumber: req.params.accountNumber,
            inputparamnumberamt : req.body.amount 
        }
        const result = Joi.validate(num, transactionvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only numbers will be accepted for account number and amount field'
            });
        }

        let toDay = Date.now();
        const debits = {
            createdOn : toDay,
            accountNumber : req.params.accountNumber,
            amount : req.body.amount 
        };
        const text = 'select * from  accounts where accounts.accountnumber =$1';
        const values= [debits.accountNumber];
        db.query(text, values ,function(err,result) { 
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: 'no accounts found to perform the transaction'});
            }
            if (result.rows[0].accountstatus != 'active'){
                return res.status(400).send({ 
                    status:400,
                    message: 'your account should be active to perform the credit transaction'});
            }
            const debit = {
                staffid:req.Info.UserId,
                userid:result.rows[0].userid,
                accountNumber:result.rows[0].accountnumber ,
                createdOn:toDay,
                TransactionType:'credit',
                TransactionAmt:req.body.amount,
                oldBalance: result.rows[0].currentbalance,
                newBalance: (result.rows[0].currentbalance + +req.body.amount),
                TransactionId:Math.floor(Math.random() * 1000)
            };               
            let staffid = debit.staffid,transactionId = debit.TransactionId, accountNumber = debit.accountNumber, amount = debit.TransactionAmt, transactionType = debit.TransactionType, accountBalance = debit.newBalance;
            const text = 'update accounts set currentbalance =$1 where accountnumber =$2';
            const values= [debit.newBalance , debit.accountNumber];
            db.query(text, values ,function(err,result) {
                if(err){
                    res.status(400).send(err);
                } else {
                    // eslint-disable-next-line 
                    console.log('accounts table current balance updated');
                    const text2 = 'INSERT INTO transactions(transactionid,accountnumber,staffid,userid, createdon, transactiontype, transactionamount, oldbalance, newbalance) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';
                    const values2= [debit.TransactionId,debit.accountNumber,debit.staffid,debit.userid, debit.createdOn,debit.TransactionType,debit.TransactionAmt, debit.oldBalance,debit.newBalance];
                    db.query(text2, values2 ,function(err,result) {
                        if(err){
                            res.status(400).send(err);
                        } else {                  
                            return res.status(201).json({
                                status :201,
                                data: {transactionId,accountNumber,amount,staffid,transactionType,accountBalance}
                            });
                        }
                    });
                }
            });
        });
    }
}