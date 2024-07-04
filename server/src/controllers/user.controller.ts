import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Validate } from '../decorators/validate';
import { registerUserValidation } from '../validations/user.validation';
import User from '../models/user.model';
import { MongoCreate } from '../decorators/mongoose/create';

@Controller('/user')
class UserController {
    @Route('post', '/register')
    @Validate(registerUserValidation)
    @MongoCreate(User)
    registerUser(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(req.mongoCreate);
    }
}

export default UserController;
