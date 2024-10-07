import { NextFunction, Request, Response } from "express";
import * as argon2 from "argon2";
import ApiError from "../helper/ApiError";
import { StatusCodes } from "http-status-codes";
import usersSchema from "../schemas/usersSchema";
import { IAuthController, IUser } from "../../types";
import jwt from 'jsonwebtoken'
import AuthMiddleware from "../middleware/Authentication";

class AuthController implements IAuthController {
  private hashOptions = {
    type: argon2.argon2id, // Recommended for password hashing
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3, // 3 iterations
    parallelism: 1 // 1 thread
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user: IUser = await this.verifyUsers(req.body.username, req.body.password)
    if (user) {
      const token = jwt.sign(
        { username: user.username, id: user._id, role: user.role }, 
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      res.status(StatusCodes.OK).send({ user, token })
    } else {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization
    if(authHeader) {
      const token = authHeader.split(' ')[1]
      const authMiddleware = new AuthMiddleware()
      //const authMiddleware = AuthMiddleware.getInstance();
      
      authMiddleware.addToBlackList(token)

      console.log(authMiddleware.isTokenBlacklisted(token))

      res.status(StatusCodes.OK).send({ message: 'Logout Successfully!' })
    } else {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authorization header missing'))
    }
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const existingUser = await usersSchema.findOne({ username: req.body.username }).exec();
    if(existingUser) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, 'Username already exists.'))
    }
    const hashPassword: string = await this.hashPassword(req.body.password)
    const newUser = new usersSchema({
      username: req.body.username,
      password: hashPassword,
      role: req.body.role
    })
    await newUser.save()
    res.status(StatusCodes.CREATED).json({ newUser })
  }

  private verifyUsers = async (username: string, password: string): Promise<IUser> => {
    const user = await usersSchema.findOne({ username }).exec()
    if(!user || user.password == null) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Username not found or no password set');
    }
    const validPassword = await argon2.verify(user.password, password)
    if(!validPassword) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Password!');
    }
    return user;
  }

  private hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password, this.hashOptions);
  }
}

export default AuthController