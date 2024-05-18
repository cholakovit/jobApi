import { NextFunction, Request, Response } from "express";
import ApiError from "../helper/ApiError";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { IAuthMiddleware } from "../../types";

class AuthMiddleware implements IAuthMiddleware {
  private static instance: AuthMiddleware
  private tokenBlackList: string[] = []

  constructor() {
    if (AuthMiddleware.instance) {
      return AuthMiddleware.instance;
    }
    AuthMiddleware.instance = this;
  }

  authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      if (this.isTokenBlacklisted(token)) {
        return next(new ApiError(StatusCodes.FORBIDDEN, "Token has been blacklisted"));
      }

      jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
          return next(new ApiError(StatusCodes.FORBIDDEN, "Invalid token"));
        }
        req.user = user;
        next();
      });
    } else {
      next(
        new ApiError(StatusCodes.UNAUTHORIZED, "Authorization header missing")
      );
    }
  }

  addToBlackList = (token: string) => {
    this.tokenBlackList.push(token)
  }
  
  isTokenBlacklisted = (token: string): boolean => {
    return this.tokenBlackList.includes(token)
  }
}

export default AuthMiddleware;