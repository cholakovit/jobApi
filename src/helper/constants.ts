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

