import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validation from '../validation/userValidation';
import dotenv from 'dotenv';
const db = require('../db');

dotenv.config();

export default class authUsers{
    // get all users details 
    static getAll(req, res){
        db.query('SELECT * FROM users',function(err,result) {
            if (result.rowCount  == 0) {
                return res.status(404).json({ 
                    status:404,
                    message: 'no records found'});
            }
            if(err){
                res.status(400).send(err);
            } else { 
                return res.send({
                    status : 200 ,   
                    data : result.rows});
            }
        });
    }

    static SignupUser(req, res){
        try{

            if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password ) {
                return res.status(400).json({ 
                    status:400,
                    message: 'Please fill in firstName , lastName , email and password as inputs of the form'});
            }

            if(validation.Signup(req, res)){
                let email= '{'+req.body.email+'}';          
                const text1 = 'SELECT email FROM users WHERE users.email = ($1)';
                const values1 = [email];
                db.query(text1, values1 ,function(err,result) {
                    if (result.rows[0].email === values1){
                        return res.status(400).json({ 
                            status:400,
                            message: 'This email is already present in our database'});
                    }
                });
            }
            bcrypt.hash(req.body.password, 10, (err) =>{
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = {
                        id:Math.floor(Math.random() * 1000),
                        firstName: '{'+req.body.firstName+ '}',
                        lastName: '{'+req.body.lastName+'}',
                        email:'{'+ req.body.email + '}',
                        password:'{'+ req.body.password + '}',
                        UserType:'{client}'
                    };
                    // eslint-disable-next-line 
                        const token = jwt.sign(user, process.env.JWTSECRETKEY);
                    const text = 'INSERT INTO users(userid,firstname,lastname,email,password,usertype) VALUES($1,$2,$3,$4,$5,$6)';
                    const values = [user.id,user.firstName,user.lastName,user.email,user.password,user.UserType];
                    db.query(text, values ,function(err) {
                        if(err){
                            res.status(400).send(err);
                        } else {
                            let id=user.id,firstName=user.firstName,lastName=user.lastName,email=user.email,UserType=user.UserType;
                            return res.send({
                                status : 200 ,   
                                data : {token,id,firstName,lastName,email,UserType}});
                                 
                        }
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

            if(validation.Login(req, res)){
                bcrypt.hash(req.body.password, 10, (err) =>{
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        let email= '{'+req.body.email+'}';          
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
