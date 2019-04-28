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
        } else {
            const num = {
                inputparamnumber: req.params.accountNumber
            }
            const result = Joi.validate(num, numvalidation);
            if (result.error){
                return res.status(400).send({
                    status: 400,
                    message: 'only positive numbers are allowed in the Account Number field'
                });
        } else {
        db.query('SELECT * FROM transactions where transactions.accountnumber = $1', [req.params.accountNumber],function(err,result) {
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: 'No records found'});
            }
            if(err){
                res.status(400).send(err);
            } else {
                return res.send({
                    status : 200 ,   
                    data : result.rows.map((transactions) => {
                        return {
                        transactionId : transactions.transactionid,
                        accountNumber: transactions.accountnumber,
                        staffId: transactions.staffid,
                        userId:transactions.userid,
                        createdOn: transactions.createdon,
                        transactionType: transactions.transactiontype,
                        transactionAmount:transactions.transactionamount,
                        oldBalance: transactions.oldbalance,
                        newBalance: transactions.newbalance
                    } 
                }
                )}
                )} 
            }
        );
    } }
    }

    // get specific transaction detail
    static viewTransactionid(req, res){
        if(req.Info.UserType != 'client'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only client can'
            });
        } else {
        const num = {
            inputparamnumber: req.params.transactionid
        }
        const result = Joi.validate(num, numvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only positive numbers are allowed in the transaction id field'
            });
        } else {
        db.query('SELECT * FROM transactions where transactions.transactionid = $1', [req.params.transactionid],function(err,result) {
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: `No Records found for the transaction id:${req.params.transactionid}`});
            }
            if(err){
                res.status(400).send(err);
            } else {
                if(result.rows[0].userid !=req.Info.UserId ){
                    return res.status(404).send({ 
                    status:404,
                    message: `This transaction id doesnot belong to user: ${req.Info.UserId}`}); 
                } else {
                return res.send({
                    status : 200 ,   
                    data : result.rows.map((transactions) => {
                        return {
                        transactionId : transactions.transactionid,
                        accountNumber: transactions.accountnumber,
                        staffId: transactions.staffid,
                        userId:transactions.userid,
                        createdOn: transactions.createdon,
                        transactionType: transactions.transactiontype,
                        transactionAmount:transactions.transactionamount,
                        oldBalance: transactions.oldbalance,
                        newBalance: transactions.newbalance
                    } 
                }
                )}
                )} 
                }
            }
        );
    } }
    }

    static debitAccount(req, res){
        
        if(!req.body.amount ) {
            return res.status(400).json({
                status:400,
                message: 'Please fill in amount'});
        } else{
        if(req.Info.UserType != 'staff'){
                return res.status(400).json({ 
                    status: 400,
                    message: 'You are not authorized to perform this transaction only staff can'
                });
        } else {
        const num = {
            inputparamnumber: req.params.accountNumber,
            inputparamnumberamt : req.body.amount 
        }
        const result = Joi.validate(num, transactionvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only positive numbers will be accepted for account number and amount'
            });
        } else {
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
                    message: 'No account found to perform the transaction'});
            }
            if (result.rows[0].accountstatus != 'active'){
                return res.status(400).send({ 
                    status:400,
                    message: 'your accounts should be active to perform the debit transaction'});
            }
            const debit = {
                staffId:req.Info.UserId,
                userid:result.rows[0].userid,
                accountNumber:result.rows[0].accountnumber ,
                createdOn:toDay,
                TransactionType:'debit',
                TransactionAmt:req.body.amount,
                oldBalance: result.rows[0].currentbalance,
                newBalance: (result.rows[0].currentbalance - +req.body.amount)
            };               
            if (result.rows[0].currentbalance < req.body.amount){
                return res.status(400).send({ 
                    status:400,
                    message: `cannot perform debit transaction remaining balance: ${result.rows[0].currentbalance} RWF`}); 
            } else {
            let staffId = debit.staffId, accountNumber = debit.accountNumber, amount = debit.TransactionAmt, transactionType = debit.TransactionType, accountBalance = debit.newBalance;
            const text = 'update accounts set currentbalance =$1 where accountnumber =$2';
            const values= [debit.newBalance , debit.accountNumber];
            db.query(text, values ,function(err,result) {
                if(err){
                    res.status(400).send(err);
                } else {
                    // eslint-disable-next-line 
                    console.log('accounts table current balance updated');
                    const text2 = 'INSERT INTO transactions(accountnumber,staffid,userid, createdon, transactiontype, transactionamount, oldbalance, newbalance) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
                    const values2= [debit.accountNumber,debit.staffId,debit.userid, debit.createdOn,debit.TransactionType,debit.TransactionAmt, debit.oldBalance,debit.newBalance];
                    db.query(text2, values2 ,function(err,result) {
                        if(err){
                            res.status(400).send(err);
                        } else {                  
                            return res.status(201).json({
                                status :201,
                                data: {accountNumber,amount,staffId,transactionType,accountBalance}
                            });
                        }
                    });
                }
            });
        }
        });
    } } }
    }
   

    static creditAccount(req, res){

        if(!req.body.amount ) {
            return res.status(400).json({ 
                status:400,
                message: 'Please fill in amount'});
        } else {
        if(req.Info.UserType != 'staff'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only staff can'
            });
        } else {
        const num = {
            inputparamnumber: req.params.accountNumber,
            inputparamnumberamt : req.body.amount 
        }
        const result = Joi.validate(num, transactionvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only positive numbers will be accepted for account number and amount field'
            });
        } else {
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
                    message: 'No Records found to perform the transaction'});
            }
            if (result.rows[0].accountstatus != 'active'){
                return res.status(400).send({ 
                    status:400,
                    message: 'your account should be active to perform the credit transaction'});
            }
            const debit = {
                staffId:req.Info.UserId,
                userid:result.rows[0].userid,
                accountNumber:result.rows[0].accountnumber ,
                createdOn:toDay,
                TransactionType:'credit',
                TransactionAmt:req.body.amount,
                oldBalance: result.rows[0].currentbalance,
                newBalance: (result.rows[0].currentbalance + +req.body.amount)
            };               
            let staffId = debit.staffId, accountNumber = debit.accountNumber, amount = debit.TransactionAmt, transactionType = debit.TransactionType, accountBalance = debit.newBalance;
            const text = 'update accounts set currentbalance =$1 where accountnumber =$2';
            const values= [debit.newBalance , debit.accountNumber];
            db.query(text, values ,function(err,result) {
                if(err){
                    res.status(400).send(err);
                } else {
                    // eslint-disable-next-line 
                    console.log('accounts table current balance updated');
                    const text2 = 'INSERT INTO transactions(accountnumber,staffid,userid, createdon, transactiontype, transactionamount, oldbalance, newbalance) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
                    const values2= [debit.accountNumber,debit.staffId,debit.userid, debit.createdOn,debit.TransactionType,debit.TransactionAmt, debit.oldBalance,debit.newBalance];
                    db.query(text2, values2 ,function(err,result) {
                        if(err){
                            res.status(400).send(err);
                        } else {                  
                            return res.status(201).json({
                                status :201,
                                data: {accountNumber,amount,staffId,transactionType,accountBalance}
                            });
                        }
                    });
                }
            });
        });
    } } }
    }
}