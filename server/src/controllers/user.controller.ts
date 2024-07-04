import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Validate } from '../decorators/validate';
import { registerUserValidation } from '../validations/user.validation';
import User from '../models/user.model';

import { MongoCreate } from '../decorators/mongoose/create';
import { MongoGetAll } from '../decorators/mongoose/getAll';
import { MongoGet } from '../decorators/mongoose/get';
import { MongoDelete } from '../decorators/mongoose/delete';

@Controller('/user')
class UserController {
    @Route('post', '/register')
    @Validate(registerUserValidation)
    @MongoCreate(User)
    registerUser(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(req.mongoCreate);
    }

    @Route('get', '/get/all')
    @MongoGetAll(User)
    getAll(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoGetAll);
    }

    @Route('get', '/get/:id')
    @MongoGet(User)
    get(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoGet);
    }

    @Route('delete', '/delete/:id')
    @MongoDelete(User)
    remove(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json({ message: 'Deleted' });
    }
}

export default UserController;
