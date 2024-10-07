import mongoose from "mongoose";
import logger from "./logger";
import { IMongoDBClient } from "../../types";

class MongoDBClient implements IMongoDBClient {
  async connectMongoDB(): Promise<void> {
    const conn = await mongoose.connect(process.env.MONGO_URI!)
    logger.info(`MongoDB Connect!`)
  }
}

export default MongoDBClient