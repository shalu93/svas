import Joi from 'joi';

const numvalidation = Joi.object().keys({
    inputparamnumber: Joi.number().required(),
});

export default numvalidation;