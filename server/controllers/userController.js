import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validation from '../validation/userValidation';
import dotenv from 'dotenv';
const db = require('../db');
import Joi from 'joi';
import passwordvalidation from '../validation/passwordvalidation';


dotenv.config();

export default class authUsers{
    // get all users details 
    static getAll(req, res){
        db.query('SELECT * FROM users',function(err,result) {
            if(err){
                res.status(400).send(err);
            } else { 
                if (result.rows.length == 0){
                    return res.status(404).send({
                        status : 404 ,   
                        message: "no records found"});  
                } else {
                return res.send({
                    status : 200 ,   
                    data : result.rows.map((users) => {
                        return {
                        userId : users.userid,
                        firstName: users.firstname,
                        lastName: users.lastname,
                        email:users.email,
                        userType: users.usertype} 
                    }
                )}
                )}
            }
        });
    } 

    static SignupUser(req, res){
        try{

            if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password || !req.body.confirmPassword ) {
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in firstName , lastName , email , password and confirmPassword'});
            } else{
            if(validation.Signup(req, res)){
                let email= req.body.email;          
                const text1 = 'SELECT * FROM users WHERE users.email =$1';
                const values1 = [email];
                db.query(text1, values1 ,function(err,result) {
                        if (result.rows.length != 0){
                            return res.status(409).json({
                                status : 409 ,   
                                message: "this email already exists"});  
                        }
                        else{
                    const user = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email ,
                        password: req.body.password ,
                        UserType:'client'
                    };

                    const result = Joi.validate(user, passwordvalidation);
                    if (result.error){
                        return res.status(400).send({
                            status: 400,
                            message: result.error.details[0].message
                        });
                    }

                    const hash = bcrypt.hashSync(req.body.password, 10);
                    // eslint-disable-next-line 
                    const token = jwt.sign(user, process.env.JWTSECRETKEY);
                    const text = 'INSERT INTO users(firstname,lastname,email,password,usertype) VALUES($1,$2,$3,$4,$5)';
                    const values = [user.firstName,user.lastName,user.email,hash,user.UserType];
                    db.query(text, values ,function(err,result) {
                        if(err){
                            res.status(400).send(err);
                        } else {
                            let firstName=user.firstName,lastName=user.lastName,email=user.email,UserType=user.UserType;
                            return res.send({
                                status : 200 ,   
                                message: 'Welcome to Banka, Your user account has been created',
                                data : {token,firstName,lastName,email,UserType}});
                                 
                        }
                    });    
                }
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

    static SigninUser (req, res){
        try{
            if(!req.body.email ||  !req.body.password ) {
                return res.status(400).json({
                    status:400,
                    message: 'Please fill in  email and password'});
            } else {
            if(validation.Login(req, res)){
                let email= req.body.email;   
                const text1 = 'SELECT * FROM users WHERE users.email =$1';
                const values1 = [email];
                db.query(text1, values1 ,function(err,result) {
                        if (result.rows.length == 0){
                            return res.status(400).send({
                                status : 400 ,   
                                message: "Incorrect Email"});  
                        }
                        bcrypt.compare(req.body.password, result.rows[0].password, (err, result) => {
                            if (result === false) {
                              return res.status(400).json({
                                status: 400,
                                message: 'Incorrect password',
                              });
                            } else {
                        let email= req.body.email;          
                        const text = 'SELECT * FROM users WHERE users.email = $1';
                        const values = [email];
                        db.query(text, values ,function(err,result) {
                            if(err){
                                res.status(400).send(err);
                            } else {
                                const user = {
                                    UserId: result.rows[0].userid,
                                    firstName: result.rows[0].firstname,
                                    lastName: result.rows[0].lastname,
                                    email: req.body.email,
                                    UserType:result.rows[0].usertype
                                };
                                // eslint-disable-next-line
                            const token = jwt.sign(user, process.env.JWTSECRETKEY);
                                let email=user.email;
                                return res.send({
                                    status : 200 ,   
                                    data : {token,email}});
                            }
                        }); 
                    }    
                });
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

    static SignupAdminClient(req, res){
            try{
                if(req.Info.UserType != 'admin'){
                    return res.status(400).json({ 
                        status: 400,
                        message: 'You are not authorized to perform this transaction only admin can'
                    });
                } else {
                if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password || !req.body.confirmPassword || !req.body.UserType) {
                    return res.status(400).json({ 
                        status:400,
                        message: 'Please fill in firstName , lastName , email , password, confirmPassword and UserType'});
                } else{
                if(validation.Signup(req, res)){
                    let email= req.body.email;          
                    const text1 = 'SELECT * FROM users WHERE users.email =$1';
                    const values1 = [email];
                    db.query(text1, values1 ,function(err,result) {
                            if (result.rows.length != 0){
                                return res.status(409).json({
                                    status : 409 ,   
                                    message: "this email already exists"});  
                            }
                            else{
                        const user = {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email ,
                            password: req.body.password ,
                            UserType:req.body.UserType
                        };
    
                        const result = Joi.validate(user, passwordvalidation);
                        if (result.error){
                            return res.status(400).send({
                                status: 400,
                                message: result.error.details[0].message
                            });
                        }
    
                        const hash = bcrypt.hashSync(req.body.password, 10);
                        // eslint-disable-next-line 
                        const token = jwt.sign(user, process.env.JWTSECRETKEY);
                        const text = 'INSERT INTO users(firstname,lastname,email,password,usertype) VALUES($1,$2,$3,$4,$5)';
                        const values = [user.firstName,user.lastName,user.email,hash,user.UserType];
                        db.query(text, values ,function(err,result) {
                            if(err){
                                res.status(400).send(err);
                            } else {
                                let firstName=user.firstName,lastName=user.lastName,email=user.email,UserType=user.UserType;
                                return res.send({
                                    status : 200 ,   
                                    message: 'Welcome to Banka, Your user account has been created',
                                    data : {token,firstName,lastName,email,UserType}});
                                     
                            }
                        });    
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
    }
