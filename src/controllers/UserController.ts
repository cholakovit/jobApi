import { NextFunction, Request, Response } from "express";
import logger from "../helper/logger";
import usersSchema from "../schemas/usersSchema";
import { StatusCodes } from "http-status-codes";
import ApiError from "../helper/ApiError";
import { IUserController } from "../../types";

class UserController implements IUserController {
  listUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users = await usersSchema.find()
    if(users.length === 0) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
    }
    res.status(StatusCodes.OK).json({ users })
  }
  newUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await usersSchema.create(req.body)
    res.status(StatusCodes.CREATED).json({ user })
  }
  showUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await usersSchema.findById(req.params.id)
    if(!user) {
      logger.error(`User not found`)  
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
    }
    res.status(StatusCodes.OK).json({ user })
  }
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await usersSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if(!user) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
    }
    res.status(StatusCodes.OK).json({ user })
  }
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await usersSchema.findByIdAndDelete(req.params.id, req.body)
    if(!user) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Users not found'));
    }
    res.status(StatusCodes.OK).json({ user })
  }
}

export default UserController