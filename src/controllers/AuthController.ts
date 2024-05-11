import { NextFunction, Request, Response } from "express";
import * as argon2 from "argon2";
import ApiError from "../helper/ApiError";
import { StatusCodes } from "http-status-codes";
import usersSchema from "../schemas/usersSchema";
import { IAuthController } from "../../types";


class AuthController implements IAuthController {
  private hashOptions = {
    type: argon2.argon2id, // Recommended for password hashing
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3, // 3 iterations
    parallelism: 1 // 1 thread
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.verifyUsers(req.body.username, req.body.password)
      if(result === true) {
        res.status(StatusCodes.OK).send({ result })
      } else {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
      }
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred during login: ${(error as Error).message}`));
    }
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const existingUser = await usersSchema.findOne({ username: req.body.username }).exec();
      if(existingUser) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'Username already exists.'))
      }
      const hashPassword: string = await this.hashPassword(req.body.password)
      const newUser = new usersSchema({
        username: req.body.username,
        password: hashPassword
      })
      await newUser.save()
      res.status(StatusCodes.CREATED).json({ newUser })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred during register: ${(error as Error).message}`));
    }
  }

  private verifyUsers = async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await usersSchema.findOne({ username }).exec()
      if(!user || user.password == null) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Username not found or no password set');
      }
      const validPassword = await argon2.verify(user.password, password)
      if(!validPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Password!');
      }
      return true;
    } catch(error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred during verifing users: ${(error as Error).message}`);
    }
  }

  private hashPassword = async (password: string): Promise<string> => {
    try {
      return await argon2.hash(password, this.hashOptions);
    } catch(error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurring During Password Hashing: ${(error as Error).message}`);
    }
  }
}

export default AuthController