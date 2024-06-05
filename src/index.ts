import express, { Application, Request, Response } from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import client from 'prom-client'

import SanitizeRequests from './middleware/SanitizeRequests';
import MongoDBClient from './helper/MongoDBClient';
import jobRouter from './routers/jobRouter';
import userRouter from './routers/userRouter';
import authRouter from './routers/authRouter';
import ErrorHandler from './middleware/errorHandler';
import { cspOptions, corsOptions, csrfProtection, limiter, metricsMiddleware, enforceHttps, csrfTokenCookie } from './helper/settings';
import RequestDurationMiddleware from './middleware/requestDurationMiddleware';

dotenv.config();
const app: Application = express();
const sanitizeRequests = new SanitizeRequests();
const mongoDBClient = new MongoDBClient();
const requestDurationMiddleware = new RequestDurationMiddleware()

app.use(compression());

// Ensures that all incoming requests are redirected to HTTPS, enhancing the security 
// of the application by enforcing secure communication. --
app.use(enforceHttps);

// Helmet helps secure the app by setting various HTTP headers, protecting against common web 
// vulnerabilities like cross-site scripting (XSS), content security policy violations, and other attacks.
app.use(helmet());

// Extend Helmet to configure X-Frame-Options to prevent clickjacking
app.use(helmet.frameguard({ action: 'deny' }));

// Helmet's content security policy with the provided options to enhance security by defining allowed content sources.
app.use(helmet.contentSecurityPolicy(cspOptions));

// Sanitizes the body of incoming requests. By doing this, it helps to prevent injection attacks 
// and ensures that the data received in the request body is clean and safe to use.
app.use(sanitizeRequests.sanitizeRequestBody);
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS).
app.use(cors(corsOptions));

app.set('trust proxy', 1);

// apply rate limiting middleware to all routes, which helps to control the number of 
// requests a client can make to the server within a certain time frame.
app.use(limiter);

// Helps to protect the application from CSRF attacks by ensuring that requests 
// made to the server are from authenticated and trusted sources. --
app.use(csrfProtection);

// Ensures that each request is protected against CSRF attacks by including a CSRF token in cookies. --
app.use(csrfTokenCookie);

// Measure request duration for all incoming requests
app.use(requestDurationMiddleware.handle)

// For all incoming requests, allowing the application to gather performance metrics.
app.use(metricsMiddleware);

app.use('/metrics', (req: Request, res: Response) => {
  res.set('Content-Type', client.register.contentType)
  res.end(client.register.metrics())
})

app.use('/jobs', jobRouter);
app.use('/users', userRouter);
app.use('/', authRouter);

app.use(ErrorHandler.errorHandler);


const start = async () => {
  await mongoDBClient.connectMongoDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  });
};

start();