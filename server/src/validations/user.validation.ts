import Joi from 'joi';

type UserRegistration = {
    name: string;
    username: string;
    email: string;
    role: 'SuperAdmin' | 'User';
    password: string;
};

type UserLogin = {
    email: string;
    password: string;
};

export const registerUserValidation = Joi.object<UserRegistration>({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('SuperAdmin', 'User').required(),
    password: Joi.string().required()
});

export const loginUserValidation = Joi.object<UserLogin>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
