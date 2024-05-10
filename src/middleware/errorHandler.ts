import { NextFunction, Request, Response } from "express";
import ApiError from "../helper/ApiError";
import logger from "../helper/logger";
import { StatusCodes } from "http-status-codes";

class ErrorHandler {
  public static errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
    const { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = "Internal Server Error", status = "error" } = err
    logger.error(`${status.toUpperCase()} - Code: ${statusCode} - Message: ${message}`)
    res.status(statusCode).json({ status, message })
  }
}

export default ErrorHandler


// export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
//   const { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = "Internal Server Error", status = "error" } = err

//   logger.error(`${status.toUpperCase()} - Code: ${statusCode} - Message: ${message}`)
//   res.status(statusCode).json({ status, message })
// }

