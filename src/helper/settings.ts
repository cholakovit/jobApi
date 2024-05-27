import csurf from "csurf";
import rateLimit from "express-rate-limit";
import promBundle from 'express-prom-bundle';
import { NextFunction, Request, Response } from 'express';



// Define the Content Security Policy
export const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https:"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
};

// Define CORS options
export const corsOptions = {
  origin: 'http://localhost:5173',  // Only allow this origin to access your API
  //methods: ['GET', 'POST'], // Allow only these HTTP methods
  //allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
  credentials: true // Allow cookies to be sent
};

export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: false, // Set to false for development
    sameSite: 'strict',
  },
});

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // limit each IP to 100 requests per windowMs
});

// Define the metrics middleware
export const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeUp: true,
  customLabels: { project_name: 'jobApi', project_type: 'api' },
  promClient: {
    collectDefaultMetrics: {},
  },
});

export const enforceHttps = (req: Request, res: Response, next: NextFunction) => {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  const url = new URL(`https://req.headers.host}${req.url}`);
}

export const csrfTokenCookie = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken, { httpOnly: false }); // Accessible by client-side JS
  next();
}