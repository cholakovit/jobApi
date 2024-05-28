import mongoose from "mongoose";
import { IJobTag } from "../../types";

const jobTagsSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobs',
    required: true
  },
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tags',
    required: true
  }
})

export default mongoose.model<IJobTag>('jobTags', jobTagsSchema)