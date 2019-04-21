import {accountDb} from '../Db/accountsDb';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const AcctInfo = accountDb;

export default class authUsers{
    // get all account details 
    static getAcctInfo(req, res){
        pg.connect(process.env.connectionString,function(err,client,done) {
           if(err){
               console.log("not able to get connection "+ err);
               res.status(400).send(err);
           } 
           client.query('SELECT * FROM accounts',function(err,result) {
               done(); // closing the connection;
               if(err){
                   console.log(err);
                   res.status(400).send(err);
               } else {
               console.log(result.rows)
               return res.send({
                status : 200 ,   
                data : result.rows});
               }
           });
        });
    };

     // get specific account detail
     static getSpecificAcctInfo(req, res){
        console.log(req.params.accountNumber)
        pg.connect(process.env.connectionString,function(err,client,done) {
            if(err){
                console.log("not able to get connection "+ err);
                res.status(400).send(err);
            } 
            var AcctId = parseInt(req.params.accountNumber);
            console.log(AcctId)
            client.query('SELECT * FROM accounts where accounts.accountnumber = $1', [AcctId],function(err,result) {
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

    // get all account details of user filtered by email 
    static getAcctInfoOfUser(req, res){
        console.log(req.params.useremail)
        pg.connect(process.env.connectionString,function(err,client,done) {
            if(err){
                console.log("not able to get connection "+ err);
                res.status(400).send(err);
            } 
            var UserMailId = String(req.params.useremail);
            console.log(UserMailId)
            client.query('SELECT * FROM accounts WHERE accounts.email = $[UserMailId]',function(err,result) {
                done(); // closing the connection;
                if(err){
                    console.log(err);
                    res.status(400).send(err);
                } else {
                    console.log(result.rows)
                return res.send({
                 status : 200 ,   
                 data : result.rows});
                }
            });
         });
     };    

    static createAccount(req, res){
        try{

            if(req.body.type !== 'saving') {
                if(req.body.type !== 'current') {
                    if(req.body.type !== 'dormant') {
                        return res.status(400).json({ 
                            status: 400,
                            message: 'Sorry your account type can be either saving ,current or dormant'
                        });
                    }
                }
            }         
            
            if( !req.body.type ) { 
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in type as inputs of the form'});
            }
            else{
                const account = {
                    accountNumber: Math.floor(Math.random() * 10000000000),
                    firstName: req.Info.firstName,
                    lastName: req.Info.lastName,
                    email: req.Info.email,
                    type: req.body.type,
                    Status:'Active',
                    openingBalance:0
                };
                AcctInfo.push(account);
                let accountNumber=account.accountNumber,firstName=account.firstName,lastName=account.lastName,email=account.email,type=account.type,status=account.status,openingBalance=account.openingBalance;
                res.status(201).json({
                    status :201,
                    data: {accountNumber,firstName,lastName,email,type,status,openingBalance}
                });
            }
        }
        
        catch(err){
            return res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }

    static updateAccount(req, res){
        try{

            if(!req.body.status ) {
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in status as inputs of the form'});
            }

            if(req.body.status !== 'active') {
                if(req.body.status !== 'inactive') {
                    return res.status(400).json({ 
                        status: 400,
                        message: 'Sorry your account status can be either active or inactive'
                    });
                }
            }

            const accountNumber=req.params.accountNumber;
            const accounts = AcctInfo.filter(account => account.accountNumber == accountNumber);
            // eslint-disable-next-line no-console
            console.log(accounts);
            if(accounts.length==1){
                accounts[0].status=req.body.status;
            }
            let accountNumb=accounts[0].accountNumber,firstName=accounts[0].firstName,lastName=accounts[0].lastName,email=accounts[0].email,type=accounts[0].type,status=accounts[0].status,openingBalance=accounts[0].openingBalance;
            return res.status(200).json({
                status :200,
                data: {accountNumb,firstName,lastName,email,type,status,openingBalance}
            });
        }
        catch(err){
            return res.status(404).json({
                status:404,
                message: 'Bank account not found'
            });
        }
    }

    static deleteAccount(req, res){
        const accountNumber=req.params.accountNumber;
        const accounts = AcctInfo.filter(account => account.accountNumber == accountNumber);
        if(accounts.length==1){
            delete AcctInfo[accountNumber-1];
            return res.status(200).json({
                status :200,
                message:'Bank account successfully deleted'
            });
        } else {
            return res.status(404).json({
                status:404,
                message: 'Bank account entered not found'
            });
        }
    }
}