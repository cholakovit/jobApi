import mongoose from "mongoose";
import { IJob } from "../../types";

const jobsSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  company: { type: String },
  location: { type: String, index: true },
  employment_type: { type: String, index: true },
  salary: { type: String },
  requirements: { type: String },
  responsibilities: { type: String },
  post_date: { type: Date, required: true, default: Date.now() },
  expiry_date: { type: Date },
  contact_information: { type: String },
  application_process: { type: String },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
})

// TTL index to expire documents 30 days after `expiry_date`
jobsSchema.index({ expiry_date: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model<IJob>('jobs', jobsSchema)