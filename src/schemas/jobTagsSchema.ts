import mongoose from "mongoose";
import { IJobTag } from "../../types";

const jobTagsSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true, index: true }, // indexed to optimize queries filtering by jobId
  tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'tags', required: true, index: true }  // indexed to optimize queries filtering by tagId
})

// ensure the uniqueness of each job-tag pair, optimizes queries that filter by both fields.
jobTagsSchema.index({ jobId: 1, tagId: 1 }, { unique: true })

export default mongoose.model<IJobTag>('jobTags', jobTagsSchema)