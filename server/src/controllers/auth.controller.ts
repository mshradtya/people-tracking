import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Validate } from '../decorators/validate';
import { loginUserValidation } from '../validations/user.validation';
import User from '../models/user.model';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/config';

@Controller('/auth')
class AuthController {
    @Route('post', '/login')
    @Validate(loginUserValidation)
    async loginUser(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'email not registered' });
            }
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                return res.status(400).json({ message: 'incorrect password' });
            }
            const accessToken = jwt.sign(
                {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                },
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1d'
                }
            );

            const refreshToken = jwt.sign(
                {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                },
                REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '7d'
                }
            );

            const _id = user._id;
            const username = user.username;
            const role = user.role;

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({ _id, username, role, accessToken });
        } catch (error: any) {
            logging.error(error);
            return res.status(400).json({ message: error.message });
        }
    }

    @Route('post', '/refresh')
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const cookies = req.cookies;
            console.log(req.cookies);

            if (!cookies?.jwt) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const refreshToken = cookies.jwt;

            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err: any, decoded: any) => {
                if (err) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
                const { user } = decoded;
                const newUser = await User.findById(user._id);
                if (!newUser) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const accessToken = jwt.sign(
                    {
                        user: {
                            _id: newUser._id,
                            username: newUser.username,
                            email: newUser.email,
                            role: newUser.role
                        }
                    },
                    ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '1d'
                    }
                );
                const _id = newUser._id;
                const username = newUser.username;
                const role = newUser.role;
                const email = newUser.email;

                res.json({ _id, username, role, email, accessToken });
            });
        } catch (error: any) {
            logging.error(error);
            return res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;
