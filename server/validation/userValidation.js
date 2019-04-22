import validator from 'validator';

export default class validation {

    static Signup (req){

        if (validator.isEmpty(req.body.firstName)) {
           
            throw Error('First Name is required'); 
        }

        if (validator.isEmpty(req.body.lastName)) {
           
            throw Error('Last Name is required');
        }

        if (validator.isEmpty(req.body.email)) {
            
            throw Error('Email should not be empty');
        }
        
        if (validator.isEmpty(req.body.password)) {
            throw Error('Password is required');
        }

        if (typeof req.body.email ==='number') {
            
            throw Error(' email can not be an integer');
        }

        if (!validator.isLength(req.body.password, {
            min: 10, max: 20
        })) {
            throw Error('Password should be at least 10 characters');
        }

        if (!validator.isEmail(req.body.email)) {

            throw Error('email should look like this : google@gmail.com');
        }
        
        if (!validator.equals(req.body.password, req.body.confirmPassword)) {
            throw Error('Passwords should match');
        }

        if (validator.isEmpty(req.body.confirmPassword)) {
            throw Error('confirm your password');
        }
        return true;
    }
        
        
    static Login (req){

        if (typeof req.body.email == 'number') {
            throw Error('email should not be an integer');
        }

        if (validator.isEmpty(req.body.email)) {
            throw Error('Email should not be empty');
        }
               
        if (!validator.isEmail(req.body.email)) {
            throw Error('Your email should look like this : example@email.com');
        }
        if (validator.isEmpty(req.body.password)) {
            throw Error('Password is required');
        }
        return true;
    }
    
}