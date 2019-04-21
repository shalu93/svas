import {accountDb} from '../Db/accountsDb';
import {transactionDb} from '../Db/transactionDb';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const AcctInfo = accountDb;
const TranInfo= transactionDb;

export default class transaction{

// get all transaction details 
    static viewTransaction(req, res){
        console.log(req.params.accountNumber)
        pg.connect(process.env.connectionString,function(err,client,done) {
            if(err){
                console.log("not able to get connection "+ err);
                res.status(400).send(err);
            } 
            var accountNumb = parseInt(req.params.accountNumber);
            console.log(accountNumb)
            client.query('SELECT * FROM transactions where transactions.accountnumber = $1', [accountNumb],function(err,result) {
                done(); // closing the connection;
                if(err){
                    console.log(err);
                    res.status(400).send(err);
                } else {
                return res.send({
                 status : 200 ,   
                 data : result.rows});
                }
            });
         });
     };

     // get specific transaction detail
    static viewTransactionid(req, res){
        console.log(req.params.transactionid)
        pg.connect(process.env.connectionString,function(err,client,done) {
            if(err){
                console.log("not able to get connection "+ err);
                res.status(400).send(err);
            } 
            var TranId = parseInt(req.params.transactionid);
            console.log(TranId)
            client.query('SELECT * FROM transactions where transactions.transactionid = $1', [TranId],function(err,result) {
                done(); // closing the connection;
                if(err){
                    console.log(err);
                    res.status(400).send(err);
                } else {
                return res.send({
                 status : 200 ,   
                 data : result.rows});
                }
            });
         });
     };

    static debitAccount(req, res){
        if(!req.body.amount ) {
            return res.status(400).json({
                status:400,
                message: 'Please fill in amount as input of the form'});
        }

        const accountNumb=req.params.accountNumber;
        let toDay = new Date();
        const accounts = AcctInfo.filter(account => account.accountNumber == accountNumb);
        if(accounts.length==1){
            if(accounts[0].status ==='draft' || accounts[0].status==='dormant'){
                return res.status(404).json({
                    status :404,
                    message: 'You have to activate this account first'
                }); 


            } else {
                const transaction = TranInfo.filter(transaction => transaction.accountNumber == accountNumb);
                const debit = {
                    id : TranInfo.length + 1,
                    createdOn : toDay,
                    type : 'debit',
                    accountNumber : accountNumb,
                    amount : req.body.amount ,
                    oldBalance : transaction[0].oldBalance,
                    newBalance : (transaction[0].oldBalance + +req.body.amount) ,
                };
                transaction[0].oldBalance=debit.newBalance;
                TranInfo.push(debit);
                let transactionId = debit.id, accountNumber = debit.accountNumber, amount = debit.amount, transactionType = debit.type, accountBalance = debit.newBalance;
                return res.status(201).json({
                    status :201,
                    data: {transactionId,accountNumber,amount,transactionType,accountBalance}
                });
            }
        }
            
        if(accounts.length==0){
            return res.status(404).json({
                status :404,
                message: 'The bank account entered does not exist!'
            }); 
        }
    }

    static creditAccount(req, res){

        if(!req.body.amount ) {
            return res.status(400).json({ 
                status:400,
                message: 'Please fill in amount as input of the form'});
        }
        const accountNumb=req.params.accountNumber;
        let toDay = new Date();
        const accounts = AcctInfo.filter(account => account.accountNumber == accountNumb);
        if(accounts.length==1){
            if(accounts[0].status ==='draft' || accounts[0].status==='dormant'){
                return res.status(404).json({
                    status :404,
                    message: 'You have to activate this account first'
                });
    
    
            }
            if(accounts[0].balance < req.body.amount ){
                return res.status(500).json({
                    status :409,
                    message: 'You dont have that amount on your account'
                });
            }
                    
            else {
                const transaction = TranInfo.filter(transaction => transaction.accountNumber == accountNumb);
                const credit = {
                    id : TranInfo.length + 1,
                    createdOn : toDay,
                    type : 'credit',
                    accountNumber : accountNumb,
                    amount : req.body.amount ,
                    oldBalance : transaction[0].oldBalance,
                    newBalance : (+transaction[0].oldBalance - +req.body.amount) ,
                };
                transaction[0].oldBalance=credit.newBalance;
                TranInfo.push(credit);
                let transactionId = credit.id, accountNumber = credit.accountNumber, amount = credit.amount, transactionType = credit.type, accountBalance = credit.newBalance;
                return res.status(201).json({
                    status :201,
                    data: {transactionId,accountNumber,amount,transactionType,accountBalance}
                });
            }
        }
                
        if(accounts.length==0){
            return res.status(404).json({
                status :404,
                message: 'The bank account entered does not exist!'
            });
        }
    }


}