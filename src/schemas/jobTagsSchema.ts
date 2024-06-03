import mongoose from "mongoose";
import { IJobTag } from "../../types";

const jobTagsSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true, index: true },
  tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'tags', required: true, index: true }
})

jobTagsSchema.index({ jobId: 1, tagId: 1 }, { unique: true })

export default mongoose.model<IJobTag>('jobTags', jobTagsSchema)