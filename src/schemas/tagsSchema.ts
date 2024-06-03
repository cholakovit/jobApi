import mongoose from "mongoose";
import { ITag } from "../../types";

const tagsSchema = new mongoose.Schema({
  tag: { type: String, required: true, index: true }
})

export default mongoose.model<ITag>('tags', tagsSchema)