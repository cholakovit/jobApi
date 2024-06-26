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

export interface IUser extends Document {
  _id?: string;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  profilePicture?: string;
  bio?: string;
  role: 'User' | 'Admin';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface IJob extends Document {
  title: string;
  description: string;
  company?: string;
  location?: string;
  employment_type?: string;
  salary?: string;
  requirements?: string;
  responsibilities?: string;
  post_date: Date;
  expiry_date?: Date;
  contact_information?: string;
  application_process?: string;
  posted_by: mongoose.Schema.Types.ObjectId;
}

export interface ITag extends Document {
  _id?: ObjectId;
  tag: string;
}

export interface IJobTag extends Document {
  jobId: mongoose.Schema.Types.ObjectId;
  tagId: mongoose.Schema.Types.ObjectId;
}