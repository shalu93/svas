import dotenv from 'dotenv';
const db = require('../db');

dotenv.config();


export default class transaction{

    // get all transaction details 
    static viewTransaction(req, res){
        if(req.Info.UserType == 'client'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction'
            });
        }
        var accountNumb = parseInt(req.params.accountNumber);
        db.query('SELECT * FROM transactions where transactions.accountnumber = $1', [accountNumb],function(err,result) {
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
                message: 'You are not authorized to perform this transaction'
            });
        }
        var TranId = parseInt(req.params.transactionid);
        db.query('SELECT * FROM transactions where transactions.transactionid = $1', [TranId],function(err,result) {
            if(err){
                res.status(400).send(err);
            } else {
                return res.send({
                    status : 200 ,   
                    data : result.rows});
            }
        });
    }

    static debitAccount(req, res){
        
        if(!req.body.amount ) {
            return res.status(400).json({
                status:400,
                message: 'Please fill in amount as input of the form'});
        }
        
        if(req.Info.UserType != 'client'){
            if(req.Info.UserType != 'admin'){
                return res.status(400).json({ 
                    status: 400,
                    message: 'You are not authorized to perform this transaction'
                });
            }
        }
        let toDay = new Date();
        const debits = {
            createdOn : toDay,
            accountNumber : req.params.accountNumber,
            amount : req.body.amount 
        };
        const text = 'select * from  accounts where accounts.accountnumber =$1';
        const values= [debits.accountNumber];
        db.query(text, values ,function(err,result) { 
            const debit = {
                Owneruserid:req.info.UserId,
                accountNumber:result.rows[0].accountnumber ,
                createdOn:toDay,
                TransactionType:'{debit}',
                TransactionAmt:req.body.amount,
                oldBalance: result.rows[0].currentbalance,
                newBalance: (result.rows[0].currentbalance + +req.body.amount),
                TransactionId:Math.floor(Math.random() * 1000)
            };               
            let Owneruserid = debit.Owneruserid,transactionId = debit.TransactionId, accountNumber = debit.accountNumber, amount = debit.TransactionAmt, transactionType = debit.TransactionType, accountBalance = debit.newBalance;
            const text = 'update accounts set currentbalance =$1 where accountnumber =$2';
            const values= [debit.newBalance , debit.accountNumber];
            db.query(text, values ,function(err) {
                if(err){
                    res.status(400).send(err);
                } else {
                    // eslint-disable-next-line 
                    console.log('accounts table current balance updated');
                    const text2 = 'INSERT INTO transactions(owneruserid,accountnumber,transactionid, createdon, transactiontype, transactionamount, oldbalance, newbalance) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
                    const values2= [debit.Owneruserid,debit.accountNumber,debit.TransactionId,debit.createdOn,debit.TransactionType,debit.TransactionAmt, debit.oldBalance,debit.newBalance];
                    db.query(text2, values2 ,function(err) {
                        if(err){
                            res.status(400).send(err);
                        } else {                  
                            return res.status(201).json({
                                status :201,
                                data: {transactionId,accountNumber,amount,Owneruserid,transactionType,accountBalance}
                            });
                        }
                    });
                }
            });
        });
    }
   

    static creditAccount(req, res){

        if(!req.body.amount ) {
            return res.status(400).json({ 
                status:400,
                message: 'Please fill in amount as input of the form'});
        }

        if(req.Info.UserType != 'client'){
            if(req.Info.UserType != 'admin'){
                return res.status(400).json({ 
                    status: 400,
                    message: 'You are not authorized to perform this transaction'
                });
            }
        }

        let toDay = new Date();
        const debits = {
            createdOn : toDay,
            accountNumber : req.params.accountNumber,
            amount : req.body.amount 
        };
        const text = 'select * from  accounts where accounts.accountnumber =$1';
        const values= [debits.accountNumber];
        db.query(text, values ,function(err,result) { 
            const debit = {
                Owneruserid:req.info.UserId,
                accountNumber:result.rows[0].accountnumber ,
                createdOn:toDay,
                TransactionType:'{credit}',
                TransactionAmt:req.body.amount,
                oldBalance: result.rows[0].currentbalance,
                newBalance: (result.rows[0].currentbalance - +req.body.amount),
                TransactionId:Math.floor(Math.random() * 1000)
            };               
            let Owneruserid = debit.Owneruserid,transactionId = debit.TransactionId, accountNumber = debit.accountNumber, amount = debit.TransactionAmt, transactionType = debit.TransactionType, accountBalance = debit.newBalance;
            const text = 'update accounts set currentbalance =$1 where accountnumber =$2';
            const values= [debit.newBalance , debit.accountNumber];
            db.query(text, values ,function(err) {
                if(err){
                    res.status(400).send(err);
                } else {
                    // eslint-disable-next-line 
                    console.log('accounts table current balance updated');
                    const text2 = 'INSERT INTO transactions(owneruserid,accountnumber,transactionid, createdon, transactiontype, transactionamount, oldbalance, newbalance) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
                    const values2= [debit.Owneruserid,debit.accountNumber,debit.TransactionId,debit.createdOn,debit.TransactionType,debit.TransactionAmt, debit.oldBalance,debit.newBalance];
                    db.query(text2, values2 ,function(err) {
                        if(err){
                            res.status(400).send(err);
                        } else {                  
                            return res.status(201).json({
                                status :201,
                                data: {transactionId,accountNumber,amount,Owneruserid,transactionType,accountBalance}
                            });
                        }
                    });
                }
            });
        });
    }
}