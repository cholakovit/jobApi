import { NextFunction, Request, Response } from "express";
import ApiError from "../helper/ApiError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
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

      const user = this.verifyToken(token)
      req.user = user
      next()
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

  checkRole(requiredRole: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const token: string | undefined = req.headers.authorization?.split(' ')[1]
      if(!token) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'No token provided'))
      }

      if (this.isTokenBlacklisted(token)) {
        return next(new ApiError(StatusCodes.FORBIDDEN, "Token has been blacklisted"));
      }

      const decoded = this.verifyToken(token)
      if(!decoded.role) {
        return next(new ApiError(StatusCodes.FORBIDDEN, "Role not included in token"))
      }

      const userRole = decoded.role
      if(userRole !== requiredRole) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "Insufficient Permissions"))
      }
      next()
    }
  }

  private verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    } catch(error) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
  }
}

export default AuthMiddleware;