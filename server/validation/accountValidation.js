import validator from 'validator';

export default class validation {
    static validateAccount (req){
    
        if (validator.isEmpty(req.body.email)) {
       
            throw Error('Email is required');
        } 

        if (validator.isEmpty(req.body.type)) {
       
            throw Error('account type is required'); 
        }

        else {
            return true;
        }
    }
}