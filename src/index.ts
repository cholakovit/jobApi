import express, { Application, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import logger from './helper/logger'
import helmet from 'helmet'
import cors from 'cors'
import SanitizeRequests from './middleware/SanitizeRequests'
import MongoDBClient from './helper/MongoDBClient'
import rateLimit from 'express-rate-limit'
import jobRouter from './routers/jobRouter'
import userRouter from './routers/userRouter'
import ErrorHandler from './middleware/errorHandler'
import ApiError from './helper/ApiError'

dotenv.config()
const app: Application = express()
const sanitizeRequests = new SanitizeRequests()
const mongoDBClient = new MongoDBClient()


app.use(helmet())
app.use(sanitizeRequests.sanitizeRequestBody)
app.use(express.json())

//app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173'  // Only allow this origin to access your API
}));

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // limit each IP to a 100 requests per windowMs
})
app.use(limiter)

app.get('/', (req: Request, res: Response) => {
  logger.info(`Hello from Express and TypeScript!`)
  res.send(`Hello from Express and TypeScript!`)
})

app.use('/jobs', jobRouter)
app.use('/users', userRouter)

app.get('/example', (req: Request, res: Response, next: NextFunction) => {
  try {
    // some logic
    throw new ApiError(404, 'Example Not Found')
  } catch(error) {
    next(error)
  }
})

app.use(ErrorHandler.errorHandler)

const start = async () => {
  await mongoDBClient.connectMongoDB()
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
  })
}

start()