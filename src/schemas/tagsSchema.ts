import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tag: {
    type: String,
    required: true
  }
})

export default mongoose.model('tags', tagsSchema)