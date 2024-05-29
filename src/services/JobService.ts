import mongoose, { Document, ObjectId } from "mongoose";
import jobsSchema from "../schemas/jobsSchema";
import tagsSchema from "../schemas/tagsSchema";
import jobTagsSchema from "../schemas/jobTagsSchema";
import ApiError from "../helper/ApiError";
import { StatusCodes } from "http-status-codes";
import { ITag } from "../../types";


class JobService {
  static async listJobs() {
    return await jobsSchema.find();
  }

  static async showJob(id: string) {
    return await jobsSchema.findById(id);
  }

  static async updateJob(id: string, jobData: any) {
    return await jobsSchema.findByIdAndUpdate(id, jobData, { new: true });
  }

  static async deleteJob(id: string) {
    return await jobsSchema.findByIdAndDelete(id);
  }

  static async isReplicaSet(): Promise<boolean> {
    const admin = mongoose.connection.db.admin();
    const { replicaSet } = await admin.command({ isMaster: 1 });
    return !!replicaSet;
  }

  static async findOrCreateTags(tags: string[]): Promise<ObjectId[]> {
    const existingTags = await tagsSchema.find({ tag: { $in: tags } }).select('_id tag');
  
    const existingTagNames = new Set(existingTags.map(tag => tag.tag));
  
    const newTagNames = tags.filter(tagName => !existingTagNames.has(tagName));
  
    let insertedTags: ITag[] = [];
    if (newTagNames.length > 0) {
      insertedTags = await tagsSchema.insertMany(newTagNames.map(tagName => ({ tag: tagName })));
    }
  
    return insertedTags.map(tag => tag._id);
  }

  static async createJobWithTags(jobData: any, tagIds: ObjectId[], session: mongoose.ClientSession | null) {
    const job = await jobsSchema.create([jobData], session ? { session } : undefined);
    const jobTagPromises = tagIds.map((tagId: ObjectId) => {
      return jobTagsSchema.create([{ jobId: job[0]._id, tagId }], session ? { session } : undefined);
    });
    await Promise.all(jobTagPromises);
    return job[0];
  }

  static async createJob(req: any): Promise<any> {
    let session: mongoose.ClientSession | null = null;
    try {
      if (mongoose.connection.readyState === 1 && await this.isReplicaSet()) {
        session = await jobsSchema.startSession();
        session.startTransaction();
      }

      const { tags, ...jobData }: any = req.body;

      const tagIds: ObjectId[] = await this.findOrCreateTags(tags);
      const job = await this.createJobWithTags(jobData, tagIds, session);

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }

      return job;
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`);
    }
  }

}

export default JobService