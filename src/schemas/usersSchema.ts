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
  email: {
    type: String
  },
  role: {
    type: String
  },
  profilePicture: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

usersSchema.pre<IUser>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IUser>('users', usersSchema)