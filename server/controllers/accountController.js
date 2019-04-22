import dotenv from 'dotenv';
const db = require('../db');
import { Router } from "express";

dotenv.config();

export default class authUsers{
    // get all account details 
    static getAcctInfo(req, res){
           db.query('SELECT * FROM accounts',function(err,result) {
               if(err){
                   console.log(err);
                   res.status(400).send(err);
               } else {
               return res.send({
                status : 200 ,   
                data : result.rows});
               }
           });
    };

     // get specific account detail
     static getSpecificAcctInfo(req, res){
            var AcctId = parseInt(req.params.accountNumber);
            db.query('SELECT * FROM accounts where accounts.accountnumber = $1', [AcctId],function(err,result) {
                if(err){
                    console.log(err);
                    res.status(400).send(err);
                } else {
                return res.send({
                 status : 200 ,   
                 data : result.rows});
                }
            });
     };    

    // get all account details of user filtered by email 
    static getAcctInfoOfUser(req, res){
            var UserMailId = '{' + req.params.useremail +'}';
            const text = 'SELECT * FROM accounts WHERE accounts.email = ($1)'
            const values= [UserMailId]
            db.query(text, values ,function(err,result) {
                if(err){
                    console.log(err);
                    res.status(400).send(err);
                } else {
                return res.send({
                 status : 200 ,   
                 data : result.rows});
                }
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
            if(req.Info.UserType == 'admin'){
                if(req.Info.UserType == 'staff'){
                return res.status(400).json({ 
                    status: 400,
                    message: 'only client have access to create a bank account'
                });
            }
            }

            if( !req.body.type ) { 
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in type as inputs of the form'});
            }
            else{
                let toDay = new Date();
                const account = {
                    accountNumber: Math.floor(Math.random() * 1000),
                    firstName: '{' + req.Info.firstName + '}',
                    lastName: '{' + req.Info.lastName + '}',
                    email: '{' + req.Info.email + '}',
                    type: '{' + req.body.type + '}',
                    Status:'{Active}',
                    openingBalance:0,
                    createdOn : toDay
                };
                     const text = 'INSERT INTO accounts(accountnumber, firstname, lastname, email, accounttype, accountstatus, openingbalance, createdon) VALUES($1,$2,$3,$4,$5,$6,$7,$8)'
                     const values= [account.accountNumber,account.firstName,account.lastName,account.email,account.type,account.Status,account.openingBalance,account.createdOn]
                     db.query(text, values ,function(err,result) {
                        if(err){
                            console.log(err);
                            res.status(400).send(err);
                        } else {
                            let accountNumber=account.accountNumber,firstName=account.firstName,lastName=account.lastName,email=account.email,type=account.type,status=account.status,openingBalance=account.openingBalance,createdOn=account.createdOn;    
                            console.log(result.rows)
                        return res.send({
                         status : 200 ,   
                         data : {accountNumber,firstName,lastName,email,type,status,openingBalance,createdOn}});
                        }
                    });
             };    
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

            const accounts = {
                accountNumber: req.params.accountNumber,
                firstName:req.Info.firstName ,
                lastName:req.Info.lastName,
                email:req.Info.email,
                UserType : req.Info.UserType,
                Status :'{'+req.body.status+'}'
            }; 
                const text = 'select * from  accounts where accountnumber =$1'
                const values= [accounts.accountNumber]
                db.query(text, values ,function(err,result) {
                    const account = {
                        accountNumber: result.rows[0].accountnumber,
                        firstName:result.rows[0].firstname ,
                        lastName:result.rows[0].lastname,
                        email:result.rows[0].email,
                        type:result.rows[0].accounttype,
                        Status:'{'+req.body.status+'}'
                    };             
                    let accountNumber=account.accountNumber,firstName=account.firstName,lastName=account.lastName,email=account.email,type=account.type,status=account.Status;
                 const text = 'update accounts set accountstatus = ($1) where accountnumber =($2)'
                 const values= [account.Status,account.accountNumber]
                db.query(text, values ,function(err,result) {
                    if(err){
                        console.log(err);
                        res.status(400).send(err);
                    } else {
                    return res.send({
                     status : 200 ,   
                     data : {accountNumber,firstName,lastName,email,type,status}});
                    }
                 });
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
            const text = 'delete from accounts where accountnumber =($1)'
            const values= [accountNumber]
            db.query(text, values ,function(err,result) {;
                if(err){
                    console.log(err);
                    res.status(400).send(err);
                } else {
                console.log(result.rows)
                return res.send({
                 status : 200 ,   
                 data : 'Account sucessfully deleted'});
                }
            });
     }; 
     catch(err){
        return res.status(404).json({
            status:404,
            message: 'Bank account not found'
        });
    }


    // get all active account details 

}