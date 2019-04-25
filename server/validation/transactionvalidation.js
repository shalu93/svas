import Joi from 'joi';

const transactionvalidation = Joi.object().keys({
    inputparamnumber: Joi.number().positive().required(),
    inputparamnumberamt : Joi.number().positive().required()
});

export default transactionvalidation;