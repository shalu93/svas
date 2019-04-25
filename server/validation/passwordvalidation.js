import Joi from 'joi';

const passwordvalidation = Joi.object().keys({
    firstName: Joi.string().trim().alphanum().min(3).max(50).required(),
    lastName: Joi.string().trim().alphanum().min(3).max(50).required(),
    email: Joi.string().email().regex(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/).required(),
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/).required().error( errors => {
        return {
            message: 'password should have at least 1 digit,special character,upper and lower case English letter and a Min 10 characters'
        }
    }),
    UserType:Joi.string().required()
});

export default passwordvalidation;