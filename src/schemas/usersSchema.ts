import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  roles: {
    type: String
  }
})

export default mongoose.model('users', usersSchema)