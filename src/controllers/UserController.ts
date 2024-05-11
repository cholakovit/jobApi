import { NextFunction, Request, Response } from "express";
import logger from "../helper/logger";
import usersSchema from "../schemas/usersSchema";
import { StatusCodes } from "http-status-codes";
import ApiError from "../helper/ApiError";
import { IUserController } from "../../types";

class UserController implements IUserController {
  listUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await usersSchema.find()
      if(users.length === 0) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
      }
      res.status(StatusCodes.OK).json({ users })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }
  newUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await usersSchema.create(req.body)
      res.status(StatusCodes.CREATED).json({ user })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }
  showUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await usersSchema.findById(req.params.id)
      if(!user) {
        logger.error(`User not found`)  
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
      }
      res.status(StatusCodes.OK).json({ user })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await usersSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if(!user) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
      }
      res.status(StatusCodes.OK).json({ user })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await usersSchema.findByIdAndDelete(req.params.id, req.body)
      if(!user) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
      }
      res.status(StatusCodes.OK).json({ user })
    } catch(error) {  
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }
}

export default UserController