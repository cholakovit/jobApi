import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  company: {
    type: String
  }
})

export default mongoose.model('jobs', jobsSchema)