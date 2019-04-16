import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {userDb} from '../Db/userDb';
import validation from '../validation/userValidation';

const UserInfo = userDb;

export default class authUsers{
   static getAll(req, res){
        const UserInfo= userDb;
        return res.send({
            status :200,
            data: UserInfo
        })
    };

    static SignupUser(req, res){
        try{
            if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password ) {
                return res.status(400).json({ msg: 'Please fill in first name , last name , email and password as inputs of the form'});
            }

            if(validation.Signup(req, res)){
                const users = UserInfo.filter(user => user.email == req.body.email);
                if(users.length === 1){
                   return res.status(409).json({
                        status:409,
                        message: "This email already exists"
                    })
                }
                                
                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = {
                            id:UserInfo.length +1,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            type:"client"
                        }
                        UserInfo.push(user);
                        
                        const users = UserInfo.filter(user => user.email == req.body.email);
                        const token = jwt.sign({
                            email: users.email,
                            userId: users.id
                        }, "mysupersecretkey",
                        {
                            expiresIn: "12h"
                        });
                        
                        let id=user.id,firstName=user.firstName,lastName=user.lastName,email=user.email,password=hash,type=user.type;
                        return res.status(201).json({
                            status :201,
                            data: {token,id,firstName,lastName,email,type}
                        });
                    }
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

    static SigninUser (req, res){
        try{
            if(!req.body.email ||  !req.body.password ) {
                return res.status(400).json({ msg: 'Please fill in  email and password as inputs of the form'});
            }

            const UserInfo = userDb;
            let oneUser,loginDetails;
            if(validation.Login(req, res)){
                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        oneUser = {
                            email: req.body.email,
                            password: hash
                        }
                        
                        const users = UserInfo.filter(user =>user.email==oneUser.email);
                        if(users.length<1){
                            return res.status(211).json({
                                status:211,
                                message: "Incorrect email or password"
                            });
                        }
                        const userPassword = UserInfo.find(user => user.email == req.body.email);
                        bcrypt.compare(req.body.password, userPassword.password, function (err, result) {
                            if (result == false) {
                                return res.status(211).json({
                                    status:211,
                                    message: "Incorrect email or password"
                                });
                            } else {
                                const token = jwt.sign({
                                    email: users.email,
                                    userId: users.id
                                }, "mysupersecretkey",
                                { 
                                    expiresIn: "12h"
                                });
                                let email=req.body.email,password=hash;
                                return res.status(200).json({
                                    status:200,
                                    data: {token,email}

                                });
                            }
                        });
                    }
                })
            }
        } catch(err){
            res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }
}
