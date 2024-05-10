import mongoose from "mongoose";
import logger from "./logger";

class MongoDBClient {
  async connectMongoDB() {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI!)
      logger.info(`MongoDB Connect!`)
    } catch(err) {
      logger.error(`Error Occurred: ${(err as Error).message}`)
    }
  }
}

export default MongoDBClient