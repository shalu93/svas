import Joi from 'joi';

const transactionvalidation = Joi.object().keys({
    inputparamnumber: Joi.number().required(),
    inputparamnumberamt : Joi.number().required(),
});

export default transactionvalidation;