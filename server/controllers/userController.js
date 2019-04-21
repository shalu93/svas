import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {userDb} from '../Db/userDb';
import validation from '../validation/userValidation';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const UserInfo = userDb; 

export default class authUsers{
    // get all users details 
    static getAll(req, res){
        pg.connect(process.env.connectionString,function(err,client,done) {
           if(err){
               console.log("not able to get connection "+ err);
               res.status(400).send(err);
           } 
           client.query('SELECT * FROM users',function(err,result) {
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

    static SignupUser(req, res){
        try{

            if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password ) {
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in firstName , lastName , email and password as inputs of the form'});
            }
                                
                bcrypt.hash(req.body.password, 10, (err) =>{
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = {
                            id:UserInfo.length +1,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email.trim(),
                            AcctType:'client'
                        };
                        UserInfo.push(user);
                        // eslint-disable-next-line 
                        const token = jwt.sign(user, process.env.JWTSECRETKEY);
                        let id=user.id,firstName=user.firstName,lastName=user.lastName,email=user.email,type=user.type;
                        return res.status(201).json({
                            status :201,
                            data: {token,id,firstName,lastName,email,type}
                        });
                    }
                });
            }
        
        catch(err){
            return res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }

    static SigninUser (req, res){
        try{
            if(!req.body.email ||  !req.body.password ) {
                return res.status(400).json({
                    status:400,
                    message: 'Please fill in  email and password as inputs of the form'});
            }

            const UserInfo = userDb;
            let oneUser;
            if(validation.Login(req, res)){
                bcrypt.hash(req.body.password, 10, (err) =>{
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        oneUser = {
                            email: req.body.email
                            
                        };
                        
                        const users = UserInfo.filter(user =>user.email==oneUser.email);
                        if(users.length<1){
                            return res.status(204).json({
                                status:204,
                                message: 'Incorrect email or password'
                            });
                        }
                        const userPassword = UserInfo.find(user => user.email == req.body.email);
                        bcrypt.compare(req.body.password, userPassword.password, function (err, result) {
                            if (result == false) {
                                return res.status(204).json({
                                    status:204,
                                    message: 'Incorrect email or password'
                                });
                            } else {
                                const user = {
                                    id: users[0].id,
                                    firstName: users[0].firstName,
                                    lastName: users[0].lastName,
                                    email: req.body.email.trim(),
                                    AcctType:users[0].AcctType
                                };
                                // eslint-disable-next-line
                                const token = jwt.sign(user, process.env.JWTSECRETKEY);
                                let email=req.body.email;
                                return res.status(200).json({
                                    status:200,
                                    data: {token,email}

                                });
                            }
                        });
                    }
                });
            }
        } catch(err){
            res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }
}
