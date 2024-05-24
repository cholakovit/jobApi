import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  location: {
    type: String
  },
  employment_type: {
    type: String
  },
  salary: {
    type: String
  },
  requirements: {
    type: String
  },
  responsibilities: {
    type: String
  },
  post_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  expiry_date: {
    type: Date,
  },
  contact_information: {
    type: String
  },
  application_process: {
    type: String
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export default mongoose.model('jobs', jobsSchema)