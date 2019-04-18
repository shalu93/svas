import {accountDb} from '../Db/accountsDb';
import dotenv from 'dotenv';

dotenv.config();

const AcctInfo = accountDb;

export default class authUsers{
    static getAcctInfo(req, res){
        return res.send({
            status :200,
            data: AcctInfo
        });
    }

    static createAccount(req, res){
        try{

            if(req.body.type !== 'saving') {
                if(req.body.type !== 'current') {
                    if(req.body.type !== 'dormat') {
                        return res.status(400).json({ 
                            status: 400,
                            message: 'Sorry your account type can be either saving ,current or dormat'
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
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
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