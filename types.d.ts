import { NextFunction, Request } from "express";

interface IAuthController {
  login(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
  register(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): Promise<void>;
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