import mongoose from "mongoose";

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
  roles: {
    type: String
  }
})

export default mongoose.model('users', usersSchema)