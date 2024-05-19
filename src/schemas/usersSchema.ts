import mongoose from "mongoose";
import { IUser } from "../../types";

const usersSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String
  }
})

export default mongoose.model<IUser>('users', usersSchema)