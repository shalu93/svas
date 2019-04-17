import {accountDb} from '../Db/accountsDb';
import {userDb} from '../Db/userDb'
import validation from '../validation/accountValidation'

const AcctInfo = accountDb;
const UserInfo=userDb;

export default class authUsers{
   static getAcctInfo(req, res){
        return res.send({
            status :200,
            data: AcctInfo
        })
    };

    static createAccount(req, res){
        try{
            if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.type ) {
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in first name , last name , email and type as inputs of the form'});
            }
            if(validation.validateAccount(req, res)){
                const users = UserInfo.filter(user => user.email == req.body.email);
                if(users.length < 1){
                   return res.status(404).json({
                        status:404,
                        message: "Email not found"
                    });
                } else{
                    const account = {
                        accountNumber:AcctInfo.length +1,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        type: req.body.type,
                        Status:"draft",
                        openingBalance:0
                    }
                    AcctInfo.push(account);
                    let accountNumber=account.accountNumber,firstName=account.firstName,lastName=account.lastName,email=account.email,type=account.type,status=account.status,openingBalance=account.openingBalance;
                    res.status(201).json({
                        status :201,
                        data: {accountNumber,firstName,lastName,email,type,status,openingBalance}
                    });
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

    static updateAccount(req, res){
        try{
            if(!req.body.status ) {
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in status as inputs of the form'});
            }
            const accountNumber=req.params.accountNumber;
            const accounts = AcctInfo.filter(account => account.accountNumber == accountNumber);
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
                message: "Bank account not found"
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
                message:"Bank account successfully deleted"
            });
         } else {
             return res.status(404).json({
                status:404,
                message: "Bank account entered not found"
            });
        }
     }
}