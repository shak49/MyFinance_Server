//
//
//
import Joi from 'joi';

export const validateSignUp = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data);
};

export const validateSignIn = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data);
};

export const validatePasswordResetEmail = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email()
    });
    return schema.validate(data);
};