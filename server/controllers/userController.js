import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {userData} from '../models/usersData';
import validation from '../validation/userValidation';

const allUsers = userData;

export default class authUsers{
   static getAll(req, res){
        const allUsers= userData;
        return res.send({
            status :200,
            data: allUsers
        })
    };

    static SignupUser(req, res){
        try{
            if(validation.validateSignup(req, res)){
                const users = allUsers.filter(user => user.email == req.body.email);
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
                            id:allUsers.length +1,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            type:"client"
                        }
                        allUsers.push(user);
                        
                        const users = allUsers.filter(user => user.email == req.body.email);
                        const token = jwt.sign({
                            email: users.email,
                            userId: users.id
                        }, "mysupersecretkey",
                        {
                            expiresIn: "12h"
                        });
                        
                        let id=user.id,firstName=user.firstName,lastName=user.lastName,email=user.email,password=hash,type=user.type;
                        res.status(201).json({
                            status :201,
                            data: {token,id,firstName,lastName,email,password,type}
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
            const allUsers = userData;
            let oneUser,loginDetails;
            if(validation.validateLogin(req, res)){
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
                        
                        const users = allUsers.filter(user =>user.email==oneUser.email);
                        if(users.length<1){
                            return res.status(401).json({
                                status:401,
                                message: "Incorrect email or password"
                            });
                        }
                        const userPassword = allUsers.find(user => user.email == req.body.email);
                        bcrypt.compare(req.body.password, userPassword.password, function (err, result) {
                            if (result == false) {
                                return res.status(401).json({
                                    status:401,
                                    message: "Incorrect email or password"
                                });
                            } else {
                                const token = jwt.sign({
                                    email: users.email,
                                    userId: users.id
                                }, "mysupersecretkey",
                                { 
                                    expiresIn: "24h"
                                });
                                let email=req.body.email,password=hash;
                                return res.status(200).json({
                                    status:200,
                                    data: {token,email,password}

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
