import dotenv from 'dotenv';
const db = require('../db');
import Joi from 'joi';
dotenv.config();
import numvalidation from '../validation/numvalidation';

export default class authUsers{
    // get all account details 
    static getAcctInfo(req, res){
        if(req.Info.UserType == 'client'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only admin/staff can'
            });
        } else {
        const {status} =  req.query;
        if (!status){
            db.query('SELECT * FROM accounts',function(err,result) {
                if (result.rowCount  == 0) {
                    return res.status(404).send({ 
                        status:404,
                        message: 'No accounts found'});
                }
                if(err){
                    res.status(400).json(err);
                } else {
                    return res.status(200).send({
                        status : 200 ,   
                        data : result.rows.map((accounts) => {
                            return {
                            accountNumber : accounts.accountnumber,
                            email: accounts.email,
                            accountType: accounts.accounttype,
                            userId:accounts.userid,
                            accountStatus: accounts.accountstatus,
                            openingBalance: accounts.openingbalance,
                            createdOn:accounts.createdon,
                            currentBalance: accounts.currentbalance
                        } 
                        }
                    )}
                    )}
            });
        } else {
            var stat =  status ;
            const text = 'SELECT * FROM accounts WHERE accounts.accountstatus = ($1)';
            const values= [stat];
            db.query(text, values ,function(err,result) {
                if (result.rowCount  == 0) {
                    return res.status(404).send({ 
                        status:404,
                        message: `No accounts found for ${stat} status`});
                }
                if(err){
                    res.status(400).json(err);
                } else {
                    return res.status(200).send({
                        status : 200 ,   
                        data : result.rows.map((accounts) => {
                            return {
                            accountNumber : accounts.accountnumber,
                            email: accounts.email,
                            accountType: accounts.accounttype,
                            userId:accounts.userid,
                            accountStatus: accounts.accountstatus,
                            openingBalance: accounts.openingbalance,
                            createdOn:accounts.createdon,
                            currentBalance: accounts.currentbalance
                        } 
                    }
                    )}
                    )} 
                }
            );      
        } } }

    // get specific account detail
    static getSpecificAcctInfo(req, res){
        if(req.Info.UserType != 'client'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only client can'
            });
        } else {
        const num = {
            inputparamnumber: req.params.accountNumber
        }
        const result = Joi.validate(num, numvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only positive numbers are allowed in the account number field'
            });
        } else {
        var AccountNumber = parseInt(req.params.accountNumber);
        db.query('SELECT * FROM accounts where accounts.accountnumber = $1', [AccountNumber],function(err,result) {
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: `Account Number: ${AccountNumber} doesnot exists`});
            }         
            if(result.rows[0].userid !=req.Info.UserId ){
                return res.status(404).send({ 
                status:404,
                message: `This account number doesnot belong to user: ${req.Info.UserId}`}); 
            }   
            if(err){
                res.status(400).send(err);
            } else {
                return res.status(200).send({
                    status : 200 ,   
                    data : result.rows.map((accounts) => {
                        return {
                        accountNumber : accounts.accountnumber,
                        email: accounts.email,
                        accountType: accounts.accounttype,
                        userId:accounts.userid,
                        accountStatus: accounts.accountstatus,
                        openingBalance: accounts.openingbalance,
                        createdOn:accounts.createdon,
                        currentBalance: accounts.currentbalance
                    } 
                }
                )}
                )} 
            }
        );
    } } }

    // get all account details of user filtered by email 
    static getAcctInfoOfUser(req, res){
        if(req.Info.UserType == 'client'){
            return res.status(400).json({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only admin/staff can'
            });
        } else {
        var UserMailId =  req.params.useremail;
        const text = 'SELECT * FROM accounts WHERE accounts.email = ($1)';
        const values= [UserMailId];
        db.query(text, values ,function(err,result) {
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message:`No accounts found for the user email address: ${UserMailId}`});
            }
            if(err){
                res.status(400).send(err);
            } else {
                return res.status(200).send({
                    status : 200 ,   
                    data : result.rows.map((accounts) => {
                        return {
                        accountNumber : accounts.accountnumber,
                        email: accounts.email,
                        accountType: accounts.accounttype,
                        userId:accounts.userid,
                        accountStatus: accounts.accountstatus,
                        openingBalance: accounts.openingbalance,
                        createdOn:accounts.createdon,
                        currentBalance: accounts.currentbalance
                    } 
                }
                )}
                )} 
            }
        );
    } }    

    static createAccount(req, res){
        try{
            if( !req.body.type ) { 
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in type'});
            } else {
            if(req.Info.UserType != 'client'){
                return res.status(400).json({ 
                    status: 400,
                    message: 'You are not authorized to perform this transaction only client can'
                });
            } else {
            if(req.body.type.toLowerCase() != 'saving' && req.body.type.toLowerCase() != 'current') {
                    return res.status(400).json({ 
                        status: 400,
                        message: 'Sorry your account type can be either saving ,current'
                    });
            } else{
                let toDay = Date.now();
                const account = {
                    accountNumber: Math.floor(Math.random() * 1000),
                    firstName:  req.Info.firstName ,
                    lastName:  req.Info.lastName ,
                    email:  req.Info.email ,
                    type:  req.body.type.toLowerCase() ,
                    userid:req.Info.UserId,
                    status:'active',
                    openingBalance:0.0,
                    createdOn : toDay,
                    currentbalance: 0.0
                };
                const text = 'INSERT INTO accounts(accountnumber, email, accounttype,userid, accountstatus, openingbalance, createdon, currentbalance) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
                const values= [account.accountNumber,account.email,account.type,account.userid, account.status,account.openingBalance,account.createdOn,account.currentbalance];
                db.query(text, values ,function(err,result) {
                    console.log(err)
                    if(err){
                        res.status(400).send(err);
                    } else {
                        let accountNumber=account.accountNumber,firstName=account.firstName,lastName=account.lastName,email=account.email,type=account.type,status=account.status,openingBalance=account.openingBalance;    
                        return res.status(200).send({
                            status : 200 ,   
                            data : {accountNumber,firstName,lastName,email,type,status,openingBalance}});
                    }
                });
            }    
        }                                  
    } 
}
        catch(err){
            return res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     */
    static updateAccount(req, res){
        try{
            
            if(!req.body.status ) {
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in status'});
            } else {
            const num = {
                inputparamnumber: req.params.accountNumber
            }
            const result = Joi.validate(num, numvalidation);
            if (result.error){
                return res.status(400).send({
                    status: 400,
                    message: 'only positive numbers are allowed in the account number field'
                });
            } else {
            if(req.body.status.toLowerCase() != 'active' && req.body.status.toLowerCase() != 'draft' && req.body.status.toLowerCase() != 'dormant') {
                    return res.status(400).json({ 
                        status: 400,
                        message: 'Sorry your account status can be either active/draft/dormant'
                    });
            }
            else {
            if(req.Info.UserType == 'client'){
                return res.status(400).json({ 
                    status: 400,
                    message: 'You are not authorized to perform this transaction only admin/staff can'
                });
            } else {
            const accounts = {
                accountNumber: req.params.accountNumber,
                firstName:req.Info.firstName ,
                lastName:req.Info.lastName,
                email:req.Info.email,
                UserType : req.Info.UserType,
                status :req.body.status.toLowerCase()
            }; 
            const text = 'select * from  accounts where accountnumber =$1';
            const values= [accounts.accountNumber];
            db.query(text, values ,function(err,result) {
                if (result.rowCount  == 0) {
                    return res.status(404).send({ 
                        status:404,
                        message: `Account Number:${accounts.accountNumber} doesnot exists`});
                }
                if (req.body.status.toLowerCase() == result.rows[0].accountstatus){
                    return res.status(400).send({ 
                    status:400,
                    message: `The status is already ${req.body.status}`});  
                }
                const account = {
                    accountNumber: result.rows[0].accountnumber,
                    email:result.rows[0].email,
                    type:result.rows[0].accounttype,
                    status:req.body.status.toLowerCase()
                };            
                let accountNumber=account.accountNumber,firstName=accounts.firstName,lastName=accounts.lastName,email=account.email,type=account.type,status=account.status;
                const text = 'update accounts set accountstatus = ($1) where accountnumber =($2)';
                const values= [account.status,account.accountNumber];
                db.query(text, values ,function(err,result) {
                    if (result.rowCount  == 0) {
                        return res.status(404).send({ 
                            status:404,
                            message: 'No records found to update'});
                    }
                    if(err){
                        res.status(400).send(err);
                    } else {
                        return res.status(200).send({
                            status : 200 ,   
                            data : {accountNumber,firstName,lastName,email,type,status}});
                    }
                });
            });  
        }  }  }  }  }                  
        catch(err){
            return res.status(404).json({
                status:404,
                message: 'Bank account not found'
            });
        }
    }

    static deleteAccount(req, res){

        if(req.Info.UserType == 'client'){
            return res.status(400).send({ 
                status: 400,
                message: 'You are not authorized to perform this transaction only admin/staff can'
            });
        } else{
        const num = {
            inputparamnumber: req.params.accountNumber
        }
        const result = Joi.validate(num, numvalidation);
        if (result.error){
            return res.status(400).send({
                status: 400,
                message: 'only positive numbers are allowed in the account number field'
            });
        } else {
        const accountNumber=req.params.accountNumber;
        const text = 'delete from accounts where accountnumber =($1)';
        const values= [accountNumber];
        db.query(text, values ,function(err,result) {
            console.log(result.rowCount)
            if (result.rowCount  == 0) {
                return res.status(404).send({ 
                    status:404,
                    message: 'No Record found to delete'});
            }
            if(err){
                res.status(400).send(err);
            } else {
                return res.status(200).send({
                    status : 200 ,   
                    data : `Account: ${accountNumber} sucessfully deleted`});
            }
        });             
      } } } 
    }     