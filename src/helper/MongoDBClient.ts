import mongoose from "mongoose";
import logger from "./logger";
import { IMongoDBClient } from "../../types";

class MongoDBClient implements IMongoDBClient {
  async connectMongoDB(): Promise<void> {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI!)
      logger.info(`MongoDB Connect!`)
    } catch(err) {
      logger.error(`Error Occurred: ${(err as Error).message}`)
    }
  }
}

export default MongoDBClient