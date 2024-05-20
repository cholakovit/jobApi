import express, { Application, NextFunction, Request, Response } from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import logger from './helper/logger';
import helmet from 'helmet';
import cors from 'cors';
import SanitizeRequests from './middleware/SanitizeRequests';
import MongoDBClient from './helper/MongoDBClient';
import rateLimit from 'express-rate-limit';
import jobRouter from './routers/jobRouter';
import userRouter from './routers/userRouter';
import authRouter from './routers/authRouter';
import ErrorHandler from './middleware/errorHandler';
import ApiError from './helper/ApiError';
import csurf from 'csurf';

dotenv.config();
const app: Application = express();
const sanitizeRequests = new SanitizeRequests();
const mongoDBClient = new MongoDBClient();

app.use(compression());
app.use(helmet());
app.use(sanitizeRequests.sanitizeRequestBody);
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',  // Only allow this origin to access your API
  credentials: true  // Allow credentials (cookies)
}));

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CSRF protection middleware
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: false, // Set to false for development
    sameSite: 'strict',
  },
});

// Apply CSRF middleware
app.use(csrfProtection);

// Middleware to set a CSRF token cookie for every request
app.use((req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken, { httpOnly: false }); // Accessible by client-side JS
  next();
});

app.get('/', (req: Request, res: Response) => {
  logger.info(`Hello from Express and TypeScript!`);
  res.send(`Hello from Express and TypeScript!`);
});

app.use('/jobs', jobRouter);
app.use('/users', userRouter);
app.use('/', authRouter);

app.get('/example', (req: Request, res: Response, next: NextFunction) => {
  try {
    // some logic
    throw new ApiError(404, 'Example Not Found');
  } catch (error) {
    next(error);
  }
});

app.use(ErrorHandler.errorHandler);

const start = async () => {
  await mongoDBClient.connectMongoDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  });
};

start();