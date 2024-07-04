import Joi from 'joi';

type validation = {
    name: string;
    email?: string;
};

export const postHealthCheckValidation = Joi.object<validation>({
    name: Joi.string().required(),
    email: Joi.string().email()
});
