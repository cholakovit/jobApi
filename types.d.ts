import { NextFunction, Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}


interface IAuthController {
  login(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  register(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
}

interface IJobController {
  listJobs(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  newJob(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  showJob(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  updateJob(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  deleteJob(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
}

interface IUserController {
  listUser(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  newUser(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  showUser(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
}

interface IAuthMiddleware {
  authenticateJWT(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): void;
  addToBlackList(token: string): void;
  isTokenBlacklisted(token: string): boolean;
}

interface IApiError {
  statusCode: number;
  status: string;
  message: string;
}

interface IMongoDBClient {
  connectMongoDB(): Promise<void>;
}

interface ISanitizeRequests {
  sanitizeRequestBody(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
}

interface IUser {
  username: string;
  password: string;
  roles?: string | null;
  _id: string; // or ObjectId, depending on your setup
}