import { NextFunction, Request, Response } from "express";
import ApiError from "../helper/ApiError";
import logger from "../helper/logger";
import { StatusCodes } from "http-status-codes";

class ErrorHandler {
  public static errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
    const { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = "Internal Server Error", status = "error" } = err
    logger.error(`${status.toUpperCase()} - Code: ${statusCode} - Message: ${message}`)

    if(err.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: err.message,
        details: err.errors,
      })
    }

    if(err.name === 'MongoNetworkError') {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        status: "error",
        message: "Database connection failed. Please try again later."
      })
    }


    res.status(statusCode).json({ status, message })
  }
}

export default ErrorHandler